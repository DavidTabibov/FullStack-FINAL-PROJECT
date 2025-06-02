import { appendFileSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

// Log errors to file
const logError = (error, req) => {
  if (error.statusCode >= 400) {
    const currentDate = new Date().toISOString().split('T')[0];
    const logEntry = {
      timestamp: new Date().toISOString(),
      statusCode: error.statusCode || 500,
      method: req.method,
      url: req.originalUrl,
      message: error.message
    };

    // Append error to log file
    try {
      appendFileSync(
        path.join(logsDir, `${currentDate}.log`),
        JSON.stringify(logEntry) + '\n',
        'utf8'
      );
    } catch (err) {
      console.error('Error writing to log file:', err);
    }
  }
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  logError(err, req);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Validation error middleware
const validationError = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details.map(e => e.message)
    });
  }
  next(err);
};

export { notFound, errorHandler, validationError };
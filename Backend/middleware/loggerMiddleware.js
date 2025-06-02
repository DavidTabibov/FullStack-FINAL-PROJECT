import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// יצירת תיקיית לוגים אם לא קיימת
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// הגדרת פורמט הלוג
const logFormat = (tokens, req, res) => {
    return [
        `[${new Date().toISOString()}]`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        'User:', req.user?.email || 'guest'
    ].join(' ');
};

// יצירת קובץ לוג יומי
const getLogStream = () => {
    const date = new Date().toISOString().split('T')[0];
    return fs.createWriteStream(
        path.join(logsDir, `${date}.log`),
        { flags: 'a' }
    );
};

// מידלוור ללוגים בסביבת פיתוח
const devLogger = morgan(logFormat, {
    stream: process.stdout,
    skip: (req) => req.url.includes('/health')
});

// מידלוור ללוגים בסביבת ייצור
const prodLogger = morgan(logFormat, {
    stream: getLogStream(),
    skip: (req) => req.url.includes('/health')
});

export default process.env.NODE_ENV === 'development' ? devLogger : prodLogger;
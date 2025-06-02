import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for authentication
 * @param {string} id - User ID to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables');
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('JWT')));
    throw new Error('JWT_SECRET must be defined');
  }
  
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;

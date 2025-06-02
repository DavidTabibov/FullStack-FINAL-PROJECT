import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1000,
    message: {
        status: 429,
        message: 'חרגת ממספר הבקשות המותר. נסה שוב מאוחר יותר.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    }
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: 'יותר מדי ניסיונות התחברות. נסה שוב בעוד 15 דקות.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
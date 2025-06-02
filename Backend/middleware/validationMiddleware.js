// src/Middleware/validationMiddleware.js
import { validateCreateProduct, validateUpdateProduct } from '../validators/productValidator.js';
import { validateRegistration, validateLogin } from '../validators/userValidator.js';

// מידלוור לוולידציית הרשמה
export const validateRegisterInput = (req, res, next) => {
    const { error } = validateRegistration(req.body);
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            details: error.details.map(err => err.message)
        });
    }
    next();
};

// מידלוור לוולידציית התחברות
export const validateLoginInput = (req, res, next) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: 'שגיאת ולידציה',
            details: error.details.map(err => err.message)
        });
    }
    next();
};

// מידלוור לוולידציית יצירת מוצר
export const validateCreateProductInput = (req, res, next) => {
    const { error } = validateCreateProduct(req.body);
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: 'שגיאת ולידציה',
            details: error.details.map(err => err.message)
        });
    }
    next();
};

// מידלוור לוולידציית עדכון מוצר
export const validateUpdateProductInput = (req, res, next) => {
    const { error } = validateUpdateProduct(req.body);
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: 'שגיאת ולידציה',
            details: error.details.map(err => err.message)
        });
    }
    next();
};

// מידלוור להגבלת בקשות (דרישת בונוס)
export const rateLimiter = (maxRequests = 1000) => {
    const requests = new Map();

    return (req, res, next) => {
        const now = Date.now();
        const userId = req.user?._id || req.ip;

        if (!requests.has(userId)) {
            requests.set(userId, {
                count: 1,
                resetTime: now + (24 * 60 * 60 * 1000) // 24 שעות
            });
            return next();
        }

        const userRequests = requests.get(userId);

        // איפוס מונה אם עבר יום
        if (now > userRequests.resetTime) {
            userRequests.count = 1;
            userRequests.resetTime = now + (24 * 60 * 60 * 1000);
            return next();
        }

        // בדיקת הגבלת בקשות
        if (userRequests.count >= maxRequests) {
            return res.status(429).json({
                status: 'error',
                message: 'חרגת ממכסת הבקשות היומית'
            });
        }

        userRequests.count++;
        next();
    };
};

// בדיקת ניתוק אוטומטי (דרישת בונוס)
export const checkLastActivity = (maxInactiveTime = 4 * 60 * 60 * 1000) => {
    return (req, res, next) => {
        const lastActivity = req.session?.lastActivity;
        const currentTime = Date.now();

        if (lastActivity && (currentTime - lastActivity > maxInactiveTime)) {
            req.session.destroy();
            return res.status(401).json({
                status: 'error',
                message: 'פג תוקף החיבור עקב חוסר פעילות'
            });
        }

        req.session.lastActivity = currentTime;
        next();
    };
};
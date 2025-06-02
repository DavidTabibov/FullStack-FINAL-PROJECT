import Joi from 'joi';

// Schema for user registration validation
export const registerSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(256)
        .required()
        .messages({
            'string.min': 'First name must contain at least 2 characters',
            'string.max': 'First name cannot contain more than 256 characters',
            'any.required': 'First name is required'
        }),
    lastName: Joi.string()
        .min(2)
        .max(256)
        .required()
        .messages({
            'string.min': 'Last name must contain at least 2 characters',
            'string.max': 'Last name cannot contain more than 256 characters',
            'any.required': 'Last name is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(8)
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d.*\d.*\d)(?=.*[!@#$%^&*\-_])/)
        .required()
        .messages({
            'string.min': 'Password must contain at least 8 characters',
            'string.pattern.base': 'Password must contain: uppercase letter, lowercase letter, 4 digits and special character (!@#$%^&*-_)',
            'any.required': 'Password is required'
        })
});

// Schema for login validation
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Schema for user update validation
export const updateUserSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(256)
        .messages({
            'string.min': 'First name must contain at least 2 characters',
            'string.max': 'First name cannot contain more than 256 characters'
        }),
    lastName: Joi.string()
        .min(2)
        .max(256)
        .messages({
            'string.min': 'Last name must contain at least 2 characters',
            'string.max': 'Last name cannot contain more than 256 characters'
        })
});

// Validation functions
export const validateRegistration = (userData) => {
    return registerSchema.validate(userData, { abortEarly: false });
};

export const validateLogin = (loginData) => {
    return loginSchema.validate(loginData, { abortEarly: false });
};

export const validateUserUpdate = (updateData) => {
    return updateUserSchema.validate(updateData, { abortEarly: false });
};
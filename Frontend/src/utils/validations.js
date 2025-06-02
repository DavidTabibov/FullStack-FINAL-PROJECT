import joi from 'joi';

// Regular expressions for validations
const REGEX = {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    FOUR_DIGITS: /(?:\d.*){4}/,
    SPECIAL_CHARS: /[!@#$%^&*\-_]/
};

// Password validation pattern
export const passwordValidation = {
    pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{4,})(?=.*[!@#$%^&*\-_])[A-Za-z\d!@#$%^&*\-_]{8,}$/,
    message: 'הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה ואות קטנה באנגלית, 4 מספרים וסימן מיוחד מבין: !@#$%^&*-_'
};

// Detailed password validation
export const validatePassword = (password) => {
    const errors = [];

    if (!password || typeof password !== 'string') {
        errors.push('נא להזין סיסמה');
        return errors;
    }

    if (password.length < 8) {
        errors.push('הסיסמה חייבת להכיל לפחות 8 תווים');
    }

    if (!REGEX.UPPERCASE.test(password)) {
        errors.push('חייבת להכיל לפחות אות גדולה באנגלית');
    }

    if (!REGEX.LOWERCASE.test(password)) {
        errors.push('חייבת להכיל לפחות אות קטנה באנגלית');
    }

    if (!REGEX.FOUR_DIGITS.test(password)) {
        errors.push('חייבת להכיל לפחות 4 מספרים');
    }

    if (!REGEX.SPECIAL_CHARS.test(password)) {
        errors.push('חייבת להכיל לפחות סימן מיוחד מהרשימה: !@#$%^&*-_');
    }

    return errors;
};

// Email validation
export const validateEmail = (email) => {
    if (!email) return 'נא להזין כתובת אימייל';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'נא להזין כתובת אימייל תקינה';
    }

    return '';
};

// Form field validation
export const validateField = (name, value, required = true) => {
    if (!value && required) {
        return 'שדה חובה';
    }

    switch (name) {
        case 'email':
            return validateEmail(value);
        case 'password':
            return validatePassword(value).length > 0 ? passwordValidation.message : '';
        case 'confirmPassword':
            return value !== document.querySelector('input[name="password"]')?.value
                ? 'הסיסמאות אינן תואמות'
                : '';
        default:
            return '';
    }
};

// Form validation
export const validateForm = (formData) => {
    const errors = {};
    Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            errors[key] = error;
        }
    });
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Common validation patterns
export const validationPatterns = {
    name: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-zא-ת\s'-]+$/
    },
    phone: {
        pattern: /^0[2-9]\d{7,8}$/
    },
    url: {
        pattern: /^https?:\/\/.+/
    }
};

// Validation messages
export const validationMessages = {
    required: 'שדה חובה',
    email: 'נא להזין כתובת אימייל תקינה',
    minLength: (min) => `אורך מינימלי הוא ${min} תווים`,
    maxLength: (max) => `אורך מקסימלי הוא ${max} תווים`,
    pattern: 'ערך לא תקין',
    phone: 'מספר טלפון לא תקין',
    url: 'כתובת URL לא תקינה'
};



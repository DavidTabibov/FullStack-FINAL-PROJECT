import { useState, useCallback } from 'react';
import { validateField, validateForm, validationMessages } from '../utils/validations';

export function useFormValidation(initialData = {}) {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(initialData);
    const [isDirty, setIsDirty] = useState(false);

    const handleValidateField = useCallback((name, value) => {
        const fieldError = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: fieldError
        }));
        return !fieldError;
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (isDirty) {
            handleValidateField(name, value);
        }
    }, [isDirty, handleValidateField]);

    const handleSubmit = useCallback((submitFn) => async (e) => {
        e.preventDefault();
        setIsDirty(true);

        const { isValid, errors: validationErrors } = validateForm(formData);
        setErrors(validationErrors);

        if (!isValid) {
            return false;
        }

        try {
            await submitFn(formData);
            return true;
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message || validationMessages.generalError
            }));
            return false;
        }
    }, [formData]);

    const resetForm = useCallback(() => {
        setFormData(initialData);
        setErrors({});
        setIsDirty(false);
    }, [initialData]);

    const setFieldValue = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (isDirty) {
            handleValidateField(name, value);
        }
    }, [isDirty, handleValidateField]);

    return {
        formData,
        errors,
        isDirty,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
        setErrors
    };
}
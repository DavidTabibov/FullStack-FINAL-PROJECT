import { useState, useCallback } from 'react';

export const useNotifications = () => {
    const showSuccess = (message) => {
        console.log('Success:', message);
    };

    const showError = (message) => {
        console.error('Error:', message);
    };

    const showInfo = (message) => {
        console.log('Info:', message);
    };

    const showWarning = (message) => {
        console.warn('Warning:', message);
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning
    };
};
import { useState, useCallback } from 'react';

export const useNotifications = () => {
    const showSuccess = (message) => {
        // Handle success notification
        // Add your success notification logic here
    };

    const showError = (message) => {
        // Handle error notification
        // Add your error notification logic here
    };

    const showInfo = (message) => {
        // Handle info notification
        // Add your info notification logic here
    };

    const showWarning = (message) => {
        // Handle warning notification
        // Add your warning notification logic here
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning
    };
};
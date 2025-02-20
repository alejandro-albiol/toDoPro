"use strict";
class RegisterHandler {
    static validateInputs(loginData) {
        if (!loginData.username || !loginData.password || !loginData.email) {
            return 'Please fill in all fields';
        }
        return null;
    }
    static getFormData(form) {
        const formData = new FormData(form);
        return {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        };
    }
    static async handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const loginData = this.getFormData(form);
        const validationError = this.validateInputs(loginData);
        if (validationError) {
            alert(validationError);
            return;
        }
        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const result = await response.json();
            if (result.success) {
                return;
            }
            else {
                console.error(result.error.code || 'An unknown error occurred');
                alert(result.error.message || 'An unknown error occurred');
            }
        }
        catch (error) {
            console.error('Error during login:', error);
            alert('Error during login. Please try again.');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('registerForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            RegisterHandler.handleLogin(e);
        });
    }
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class LoginHandler {
    static validateInputs(loginData) {
        if (!loginData.username || !loginData.password) {
            return 'Please fill in all fields';
        }
        return null;
    }
    static getFormData(form) {
        const formData = new FormData(form);
        return {
            username: formData.get('username'),
            password: formData.get('password'),
        };
    }
    static handleLoginError(message) {
        switch (message) {
            case 'User not found':
                alert('Username does not exist');
                break;
            case 'Invalid password':
                alert('Incorrect password');
                break;
            default:
                alert('Error during login. Please try again.');
        }
    }
    static saveUserData(data) {
        var _a, _b, _c;
        const userData = {
            id: (_a = data.data) === null || _a === void 0 ? void 0 : _a.id,
            username: (_b = data.data) === null || _b === void 0 ? void 0 : _b.username,
            email: (_c = data.data) === null || _c === void 0 ? void 0 : _c.email,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = `/home/${userData.id}`;
    }
    static handleLogin(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const form = event.target;
            const loginData = this.getFormData(form);
            const validationError = this.validateInputs(loginData);
            if (validationError) {
                alert(validationError);
                return;
            }
            try {
                const response = yield fetch('/api/v1/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginData),
                });
                const result = (yield response.json());
                if (result.isSuccess) {
                    this.saveUserData(result);
                    return;
                }
                this.handleLoginError(result.message || 'An unknown error occurred');
            }
            catch (error) {
                console.error('Error during login:', error);
                alert('Error during login. Please try again.');
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => void LoginHandler.handleLogin(e));
    }
});

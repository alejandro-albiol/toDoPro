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
class RegisterHandler {
    static validateInputs(registerData) {
        if (!registerData.username ||
            !registerData.email ||
            !registerData.password) {
            return 'Please fill in all fields';
        }
        if (registerData.password.length < 8 || registerData.password.length > 20) {
            return 'Password must be at least 8 characters long and less than 20 characters';
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
    static handleRegistrationError(message) {
        switch (message) {
            case 'Username is already taken':
                alert('Username already exists');
                break;
            case 'Email is already registered':
                alert('Email already exists');
                break;
            default:
                alert('Error during registration. Please try again.');
        }
    }
    static saveUserData(data) {
        const userData = {
            id: data.id,
            username: data.username,
            email: data.email,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = `/home/${userData.id}`;
    }
    static handleGoogleSignIn(response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield fetch('/api/v1/auth/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ credential: response.credential }),
                });
                const apiResponse = (yield result.json());
                if (apiResponse.isSuccess && apiResponse.data) {
                    const userData = apiResponse.data;
                    const id = userData.id;
                    const username = userData.username;
                    const email = userData.email;
                    localStorage.setItem('user', JSON.stringify({ id, username, email }));
                    window.location.href = `/home/${id}`;
                }
                else {
                    throw new Error(apiResponse.message || 'Registration failed');
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                }
                else {
                    alert('An unexpected error occurred');
                }
            }
        });
    }
    static setupEventListeners() {
        const signInForm = document.getElementById('signInForm');
        if (signInForm) {
            signInForm.addEventListener('submit', function (e) {
                e.preventDefault();
                void RegisterHandler.handleSubmit(e);
            });
        }
    }
    static handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = e.target;
            const registerData = this.getFormData(form);
            const validationError = this.validateInputs(registerData);
            if (validationError) {
                alert(validationError);
                return;
            }
            try {
                const response = yield fetch('/api/v1/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerData),
                });
                const result = (yield response.json());
                if (response.ok && result.isSuccess && result.data) {
                    this.saveUserData(result.data);
                    return;
                }
                this.handleRegistrationError(result.message || 'Registration failed');
            }
            catch (error) {
                console.error('Error during registration:', error);
                alert('Error during registration. Please try again.');
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    RegisterHandler.setupEventListeners();
});

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
    static handleLogin(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const loginData = {
                username: formData.get('username'),
                password: formData.get('password'),
            };
            try {
                const response = yield fetch('/api/v1/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });
                if (response.ok) {
                    const data = yield response.json();
                    const userData = {
                        id: data.data.id,
                        username: data.data.username,
                        email: data.data.email,
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    window.location.href = `/home/${userData.id}`;
                }
                else {
                    alert('Invalid username or password');
                }
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

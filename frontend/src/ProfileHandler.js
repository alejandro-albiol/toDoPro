var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class ProfileHandler {
    static loadProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    throw new Error('Invalid user ID');
                }
                this.userId = userId.toString();
                const response = yield fetch(`/api/v1/users/${this.userId}`);
                if (!response.ok) {
                    const errorData = yield response.json();
                    throw new Error(errorData.message || 'Failed to load profile');
                }
                const result = yield response.json();
                if (!result) {
                    throw new Error('Invalid response format');
                }
                this.updateProfileView(result);
                this.setupEventListeners();
            }
            catch (error) {
                console.error('Error loading profile:', error);
                this.showMessage('profile-message', error instanceof Error ? error.message : 'Error loading profile', 'error');
            }
        });
    }
    static initialize() {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Stored user:', storedUser);
        if (!storedUser || !storedUser.id) {
            console.error('No valid user found in localStorage');
            window.location.href = '/login';
            return;
        }
        void this.loadProfile(storedUser.id);
    }
    static updateProfileView(user) {
        const usernameDisplay = document.getElementById('display-username');
        const emailDisplay = document.getElementById('display-email');
        const usernameInput = document.getElementById('edit-username');
        const emailInput = document.getElementById('edit-email');
        if (usernameDisplay)
            usernameDisplay.textContent = user.username;
        if (emailDisplay)
            emailDisplay.textContent = user.email;
        if (usernameInput)
            usernameInput.value = user.username;
        if (emailInput)
            emailInput.value = user.email;
    }
    static setupEventListeners() {
        const profileForm = document.getElementById('profile-edit-form');
        const passwordForm = document.getElementById('password-form');
        const editButton = document.querySelector('.edit-button');
        const cancelButton = document.querySelector('.cancel-button');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => void this.handleProfileUpdate(e));
        }
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => void this.handlePasswordChange(e));
        }
        if (editButton) {
            editButton.addEventListener('click', () => this.toggleEditMode());
        }
        if (cancelButton) {
            cancelButton.addEventListener('click', () => this.toggleEditMode());
        }
    }
    static handleProfileUpdate(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = {
                username: formData.get('username'),
                email: formData.get('email')
            };
            try {
                const response = yield fetch(`/api/v1/users/profile/${this.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                const result = yield response.json();
                if (response.ok && result.isSuccess) {
                    this.showMessage('profile-message', 'Profile updated successfully', 'success');
                    this.updateProfileView(result.data);
                    this.toggleEditMode();
                    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                    localStorage.setItem('user', JSON.stringify(Object.assign(Object.assign({}, storedUser), { username: userData.username, email: userData.email })));
                }
                else {
                    throw new Error(result.message || 'Failed to update profile');
                }
            }
            catch (error) {
                console.error('Error updating profile:', error);
                this.showMessage('profile-message', error instanceof Error ? error.message : 'Error updating profile', 'error');
            }
        });
    }
    static handlePasswordChange(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const passwordData = {
                currentPassword: document.getElementById('currentPassword').value,
                newPassword: document.getElementById('newPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                this.showMessage('password-message', 'New passwords do not match', 'error');
                return;
            }
            try {
                const response = yield fetch(`/api/v1/users/change-password/${this.userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(passwordData)
                });
                const result = yield response.json();
                if (response.ok && result.isSuccess) {
                    e.target.reset();
                    this.showMessage('password-message', 'Password changed successfully', 'success');
                }
                else {
                    throw new Error(result.message || 'Failed to change password');
                }
            }
            catch (error) {
                console.error('Error changing password:', error);
                this.showMessage('password-message', error instanceof Error ? error.message : 'Error changing password', 'error');
            }
        });
    }
    static toggleEditMode() {
        const viewMode = document.querySelector('.view-mode');
        const editForm = document.getElementById('profile-edit-form');
        if (viewMode && editForm) {
            const isEditing = editForm.classList.contains('hidden');
            viewMode.classList.toggle('hidden');
            editForm.classList.toggle('hidden');
            if (!isEditing) {
                document.getElementById('profile-message').textContent = '';
            }
        }
    }
    static showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `message ${type}`;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    ProfileHandler.initialize();
});

interface User {
    id: string;
    username: string;
    email: string;
}

interface UpdateUserRequest {
    username: string;
    email: string;
}


interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}

export default class ProfileHandler {
    private static userId: string;

    static initialize(): void {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!storedUser || !storedUser.id) {
            console.error('No valid user found in localStorage');
            window.location.href = '/login';
            return;
        }

        this.userId = storedUser.id;
        void this.loadProfile(this.userId);
        this.setupEventListeners();
    }

    private static setupEventListeners(): void {
        this.setupBackButton();
        this.setupProfileForm();
        this.setupPasswordForm();
        this.setupPopStateEvent();
    }

    private static setupBackButton(): void {
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.removeEventListener('click', this.handleBackClick);
            backButton.addEventListener('click', this.handleBackClick);
        }
    }

    private static handleBackClick = (e: Event) => {
        e.preventDefault();
        const userId = this.userId;
        if (userId) {
            window.location.href = `/home/${userId}`;
        } else {
            console.error('No user ID found');
        }
    };

    static async loadProfile(userId: string | number): Promise<void> {
        try {
            this.userId = userId.toString();
            
            const response = await fetch(`/api/v1/users/${this.userId}`);
            if (!response.ok) {
                throw new Error('Failed to load profile');
            }

            const result = await response.json();
            if (!result.isSuccess || !result.data) {
                throw new Error('Invalid response format');
            }

            this.updateProfileView(result.data);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showMessage('profile-message', 
                error instanceof Error ? error.message : 'Error loading profile', 
                'error'
            );
        }
    }

    private static updateProfileView(user: any): void {
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLInputElement;

        if (usernameInput) usernameInput.value = user.username;
        if (emailInput) emailInput.value = user.email;
    }

    private static setupProfileForm(): void {
        const profileForm = document.getElementById('profile-edit-form') as HTMLFormElement;
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => void this.handleProfileUpdate(e));
        }
    }

    private static setupPasswordForm(): void {
        const passwordForm = document.getElementById('password-form') as HTMLFormElement;
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => void this.handlePasswordChange(e));
        }
    }

    private static async handleProfileUpdate(e: Event): Promise<void> {
        e.preventDefault();
        
        const formData = new FormData(e.target as HTMLFormElement);
        const userData: UpdateUserRequest = {
            username: formData.get('username') as string,
            email: formData.get('email') as string
        };

        try {
            const response = await fetch(`/api/v1/users/profile/${this.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok && result.isSuccess) {
                this.showMessage('profile-message', 'Profile updated successfully', 'success');
                this.updateProfileView(result.data);
                this.toggleEditMode();

                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...storedUser,
                    username: userData.username,
                    email: userData.email
                }));
            } else {
                throw new Error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showMessage('profile-message', error instanceof Error ? error.message : 'Error updating profile', 'error');
        }
    }

    private static async handlePasswordChange(e: Event): Promise<void> {
        e.preventDefault();
        
        const currentPassword = (document.getElementById('currentPassword') as HTMLInputElement).value;
        const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

        if (newPassword !== confirmPassword) {
            this.showMessage('password-message', 'New passwords do not match', 'error');
            return;
        }

        const passwordData: ChangePasswordDTO = {
            currentPassword,
            newPassword
        };

        try {
            const response = await fetch(`/api/v1/users/change-password/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });

            const result = await response.json();

            if (response.ok && result.isSuccess) {
                (e.target as HTMLFormElement).reset();
                this.showMessage('password-message', 'Password changed successfully', 'success');
            } else {
                throw new Error(result.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            this.showMessage(
                'password-message', 
                error instanceof Error ? error.message : 'Error changing password', 
                'error'
            );
        }
    }

    private static toggleEditMode(): void {
        const viewMode = document.querySelector('.view-mode');
        const editForm = document.getElementById('profile-edit-form');
        
        if (viewMode && editForm) {
            const isEditing = editForm.classList.contains('hidden');
            viewMode.classList.toggle('hidden');
            editForm.classList.toggle('hidden');
            
            if (!isEditing) {
                document.getElementById('profile-message')!.textContent = '';
            }
        }
    }

    private static showMessage(elementId: string, message: string, type: 'error' | 'success'): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `message ${type}`;
        }
    }

    private static setupPopStateEvent(): void {
        window.addEventListener('popstate', () => {
            const path = window.location.pathname;
            if (path.startsWith('/profile/')) {
                const userId = path.split('/').pop();
                if (userId) {
                    void this.loadProfile(userId);
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => ProfileHandler.initialize());

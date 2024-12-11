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
        this.setupEventListeners();
        void this.loadProfile();
    }

    private static async loadProfile(): Promise<void> {
        try {
            const profileResponse = await fetch(`/api/v1/users/${this.userId}`);
            const profileResult = await profileResponse.json();
            
            if (profileResult.isSuccess) {
                this.updateProfileView(profileResult.data);
            } else {
                this.showMessage('profile-message', 'Error loading profile', 'error');
            }

            const statsResponse = await fetch(`/api/v1/tasks/stats/${this.userId}`);
            const statsResult = await statsResponse.json();
            
            if (statsResult.isSuccess) {
                this.updateStatsView(statsResult.data);
            }
        } catch (error) {
            this.showMessage('profile-message', 'Error loading profile data', 'error');
        }
    }

    private static setupEventListeners(): void {
        const editButton = document.getElementById('edit-profile-button');
        const profileForm = document.getElementById('profile-edit-form');
        const passwordForm = document.getElementById('password-form');
        const backButton = document.getElementById('back-button');

        editButton?.addEventListener('click', () => this.toggleEditMode());
        
        profileForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleProfileUpdate(e);
        });

        passwordForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handlePasswordUpdate(e);
        });

        backButton?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `/home/${this.userId}`;
        });
    }

    private static toggleEditMode(): void {
        const viewMode = document.querySelector('.view-mode');
        const editForm = document.getElementById('profile-edit-form');
        const editButton = document.getElementById('edit-profile-button');
        
        if (!viewMode || !editForm || !editButton) {
            console.error('Required elements not found');
            return;
        }

        const isEditing = viewMode.classList.contains('hidden');
        
        if (isEditing) {
            viewMode.classList.remove('hidden');
            editForm.classList.add('hidden');
            editButton.textContent = 'Edit Profile';
        } else {
            viewMode.classList.add('hidden');
            editForm.classList.remove('hidden');
            editButton.textContent = 'Cancel';
        }
    }

    private static async handleProfileUpdate(e: Event): Promise<void> {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`/api/v1/users/profile/${this.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email')
                })
            });

            const result = await response.json();
            
            if (result.isSuccess) {
                this.showMessage('profile-message', 'Profile updated successfully', 'success');
                this.updateProfileView(result.data);
                this.toggleEditMode();
            } else {
                this.showMessage('profile-message', result.message, 'error');
            }
        } catch (error) {
            this.showMessage('profile-message', 'Error updating profile', 'error');
        }
    }

    private static async handlePasswordUpdate(e: Event): Promise<void> {
        const form = e.target as HTMLFormElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalButtonText = submitButton.textContent || 'Update Password';
        
        const formData = new FormData(form);
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            this.showMessage('password-message', '❌ New passwords do not match', 'error');
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Updating...';
            this.showMessage('password-message', 'Changing password...', 'info');

            const response = await fetch(`/api/v1/users/${this.userId}/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const result = await response.json();
            
            if (result.isSuccess) {
                this.showMessage('password-message', '✓ Password changed successfully! Please use your new password next time you log in.', 'success');
                form.reset();
            } else {
                this.showMessage('password-message', `❌ ${result.message || 'Current password is incorrect'}`, 'error');
            }
        } catch (error) {
            this.showMessage('password-message', '❌ Error updating password. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }

    private static updateProfileView(user: any): void {
        const usernameSpan = document.querySelector('.view-mode .username');
        const emailSpan = document.querySelector('.view-mode .email');
        
        if (usernameSpan) usernameSpan.textContent = user.username;
        if (emailSpan) emailSpan.textContent = user.email;
        
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLInputElement;
        
        if (usernameInput) usernameInput.value = user.username;
        if (emailInput) emailInput.value = user.email;
    }

    private static updateStatsView(stats: any): void {
        const totalTasks = document.getElementById('total-tasks');
        const completedTasks = document.getElementById('completed-tasks');
        const pendingTasks = document.getElementById('pending-tasks');
        
        if (totalTasks) totalTasks.textContent = stats.total.toString();
        if (completedTasks) completedTasks.textContent = stats.completed.toString();
        if (pendingTasks) pendingTasks.textContent = stats.pending.toString();
    }

    private static showMessage(elementId: string, message: string, type: 'error' | 'success' | 'info' | 'warning'): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `message ${type}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => ProfileHandler.initialize());

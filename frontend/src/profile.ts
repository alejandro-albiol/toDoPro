interface User {
  id: string;
  username: string;
  email: string;
}

interface Profile {
  username: string;
  email: string;
}

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
}

export default class ProfileHandler {
  private static userId: string;

  static initialize(): void {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}') as User;

    if (!storedUser || !storedUser.id) {
      console.error('No valid user found in localStorage');
      window.location.href = '/login';
      return;
    }

    this.userId = storedUser.id;
    this.setupEventListeners();
    void this.loadProfile();
    void this.loadStats();
  }

  private static async loadProfile(): Promise<void> {
    try {
      const response = await fetch(`/api/v1/users/${this.userId}`);
      const result = (await response.json()) as ApiResponse<Profile>;

      if (result.isSuccess && result.data) {
        this.updateProfileView(result.data);
      }
    } catch (error: unknown) {
      console.error('Error loading profile:', error);
    }
  }

  private static async loadStats(): Promise<void> {
    try {
      const response = await fetch(`/api/v1/tasks/stats/${this.userId}`);
      const result = (await response.json()) as ApiResponse<TaskStats>;

      if (result.isSuccess && result.data) {
        this.updateStatsView(result.data);
      } else {
        console.error('Failed to load stats:', result.message);
      }
    } catch (error: unknown) {
      console.error('Error loading stats:', error);
    }
  }

  private static setupEventListeners(): void {
    const editButton = document.getElementById('edit-profile-button');
    const profileForm = document.getElementById('profile-edit-form');
    const passwordForm = document.getElementById('password-form');
    const backButton = document.getElementById('back-button');

    editButton?.addEventListener('click', () => this.toggleEditMode());

    profileForm?.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      void this.handleProfileUpdate(e);
    });

    passwordForm?.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      void this.handlePasswordUpdate(e);
    });

    backButton?.addEventListener('click', () => {
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
          email: formData.get('email'),
        }),
      });

      const result = (await response.json()) as ApiResponse<Profile>;

      if (result.isSuccess && result.data) {
        this.showMessage(
          'profile-message',
          'Profile updated successfully',
          'success',
        );
        this.updateProfileView(result.data);
        this.toggleEditMode();
      } else {
        this.showMessage(
          'profile-message',
          result.message || 'Update failed',
          'error',
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating profile:', error.message);
      }
      this.showMessage('profile-message', 'Error updating profile', 'error');
    }
  }

  private static async handlePasswordUpdate(e: Event): Promise<void> {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        `/api/v1/auth/${this.userId}/change-password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
          }),
        },
      );

      const result = (await response.json()) as ApiResponse<void>;

      if (result.isSuccess) {
        this.showMessage(
          'password-message',
          'Password updated successfully',
          'success',
        );
        form.reset();
      } else {
        this.showMessage(
          'password-message',
          result.message || 'Update failed',
          'error',
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating password:', error.message);
      }
      this.showMessage('password-message', 'Error updating password', 'error');
    }
  }

  private static updateProfileView(profile: Profile): void {
    const usernameSpan = document.querySelector('.view-mode .username');
    const emailSpan = document.querySelector('.view-mode .email');

    if (usernameSpan) usernameSpan.textContent = profile.username;
    if (emailSpan) emailSpan.textContent = profile.email;

    const usernameInput = document.getElementById(
      'username',
    ) as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;

    if (usernameInput) usernameInput.value = profile.username;
    if (emailInput) emailInput.value = profile.email;
  }

  private static updateStatsView(stats: TaskStats): void {
    const totalTasks = document.getElementById('total-tasks');
    const completedTasks = document.getElementById('completed-tasks');
    const pendingTasks = document.getElementById('pending-tasks');

    if (totalTasks) totalTasks.textContent = stats.total.toString();
    if (completedTasks) completedTasks.textContent = stats.completed.toString();
    if (pendingTasks) pendingTasks.textContent = stats.pending.toString();
  }

  private static showMessage(
    elementId: string,
    message: string,
    type: 'error' | 'success' | 'info' | 'warning',
  ): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.className = `message ${type}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () =>
  ProfileHandler.initialize(),
);

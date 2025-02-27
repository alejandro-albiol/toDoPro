class TaskDetail {
  static task: any = null;
  static token: string | null = localStorage.getItem('token');

  static async init() {
    try {
      if (!this.token) throw new Error('No token found');

      const user = this.decodeToken(this.token);
      if (!user || !user.userId) throw new Error('Invalid token');

      const taskId = this.getTaskId();
      if (!taskId) throw new Error('No task ID found');

      await this.loadTask(taskId);
      this.setupEventListeners();
    } catch (error) {
      console.error('Initialization error:', error);
      window.location.href = '/login';
    }
  }

  static decodeToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) throw new Error('Token expired');
      return { userId: payload.userId, username: payload.username };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  static getTaskId(): string | null {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  }

  static async loadTask(taskId: string) {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!response.ok) throw new Error('Task not found');

      const result = await response.json();
      if (!result.data) throw new Error(result.message || 'Task not found');

      this.task = result.data;
      this.populateForm();
    } catch (error) {
      console.error('Error loading task:', error);
      this.showMessage('Error loading task. Please try again.', 'error');
    }
  }

  static populateForm() {
    const titleInput = document.getElementById('title') as HTMLInputElement | null;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement | null;
    const completedInput = document.getElementById('completed') as HTMLInputElement | null;
    const creationDateSpan = document.getElementById('creationDate');

    if (!this.task) {
      console.error('No task data available');
      this.showMessage('No task data available.', 'error');
      return;
    }

    if (titleInput) titleInput.value = this.task.title || '';
    if (descriptionInput) descriptionInput.value = this.task.description || '';
    if (completedInput) completedInput.checked = this.task.completed || false;
    if (creationDateSpan && this.task.creation_date) {
      creationDateSpan.textContent = new Date(this.task.creation_date).toLocaleDateString();
    }
  }

  static setupEventListeners() {
    document.getElementById('taskForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    document.getElementById('backBtn')?.addEventListener('click', () => window.history.back());

    document.querySelector('.delete-btn')?.addEventListener('click', () => this.handleDelete());
  }

  static async handleSubmit() {
    const user = this.decodeToken(this.token!)
    try {
      const titleInput = document.getElementById('title') as HTMLInputElement | null;
      const descriptionInput = document.getElementById('description') as HTMLTextAreaElement | null;
      const completedInput = document.getElementById('completed') as HTMLInputElement | null;
  
      if (!titleInput || !descriptionInput || !completedInput) {
        throw new Error('Form elements not found');
      }
  
      const updatedTask = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
      };
  
      const response = await fetch(`/api/v1/tasks/${this.task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (!response.ok) throw new Error('Failed to update task details');
  
      this.showMessage('Task updated successfully!', 'success');
  
      if (completedInput.checked !== this.task.completed) {
        await this.toggleTaskCompletion(completedInput.checked);
      }
      await this.loadTask(this.task.id);
      setTimeout(() => {
        window.location.href = `/home/${user?.userId}`;
      }, 1000);
  
  
    } catch (error) {
      console.error('Error updating task:', error);
      this.showMessage('Failed to update task. Please try again.', 'error');
    }
  }
  

  static async handleDelete() {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/v1/tasks/${this.task.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (!response.ok) throw new Error('Failed to delete task');

      this.showMessage('Task deleted successfully!', 'success');
      setTimeout(() => (window.location.href = `/home`), 1000);
    } catch (error) {
      console.error('Error deleting task:', error);
      this.showMessage('Failed to delete task. Please try again.', 'error');
    }
  }

  static showMessage(message: string, type: 'success' | 'error') {
    const messageElement = document.getElementById('form-message');
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
  }

  static async toggleTaskCompletion(isCompleted: boolean) {
    try {
      const response = await fetch(`/api/v1/tasks/${this.task.id}/completed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ completed: isCompleted }),
      });
  
      if (!response.ok) throw new Error('Failed to update task status');
  
      console.log(`Task completion updated to: ${isCompleted}`);
    } catch (error) {
      console.error('Error updating task completion:', error);
      this.showMessage('Failed to update completion status.', 'error');
    }
  }

}

document.addEventListener('DOMContentLoaded', () => TaskDetail.init());

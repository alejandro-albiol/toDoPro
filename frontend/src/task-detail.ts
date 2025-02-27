class TaskDetail {
  static task: any = null;

  static async init() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const user = TaskDetail.decodeToken(token);
      if (!user || !user.userId) throw new Error('Invalid token');

      const pathParts = window.location.pathname.split('/');
      const taskId = pathParts[pathParts.length - 1];

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

  static async loadTask(taskId: string) {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}`);
      if (!response.ok) throw new Error('Task not found');

      const result = await response.json();
      if (!result.data) throw new Error(result.message || 'Task not found');

      this.task = result.data;
      this.populateForm();
    } catch (error) {
      console.error('Error loading task:', error);
    }
  }

  static populateForm() {
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const completedInput = document.getElementById('completed') as HTMLInputElement;
    const creationDateSpan = document.getElementById('creationDate');

    if (!this.task) {
      console.error('No task data available');
      return;
    }

    titleInput.value = this.task.title || '';
    descriptionInput.value = this.task.description || '';
    completedInput.checked = this.task.completed || false;
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
    try {
      const titleInput = document.getElementById('title') as HTMLInputElement;
      const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
      const completedInput = document.getElementById('completed') as HTMLInputElement;

      const updatedTask = {
        ...this.task,
        title: titleInput.value || '',
        description: descriptionInput.value || '',
        completed: completedInput.checked || false,
      };

      const response = await fetch(`/api/v1/tasks/${this.task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');

      window.location.href = `/home`;
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  }

  static async handleDelete() {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/v1/tasks/${this.task.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');

      window.location.href = `/home`;
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => TaskDetail.init());

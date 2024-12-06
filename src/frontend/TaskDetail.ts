interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    creation_date: string;
    completed_at?: string;
    user_id: number;
}

class TaskDetail {
    private static task: Task;

    static async init() {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('No user found');
            }

            const pathParts = window.location.pathname.split('/');
            const taskId = pathParts[pathParts.length - 1];
            
            if (!taskId) {
                throw new Error('No task ID found');
            }

            console.log('Loading task with ID:', taskId);
            await this.loadTask(taskId);
            this.setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        }
    }

    private static async loadTask(taskId: string) {
        try {
            const response = await fetch(`/api/v1/tasks/detail/${taskId}`);
            console.log('API Response status:', response.status);

            if (!response.ok) {
                throw new Error('Task not found');
            }

            const result = await response.json();
            console.log('API Response data:', result);

            if (!result.isSuccess || !result.data) {
                throw new Error(result.message || 'Task not found');
            }

            this.task = result.data;
            this.populateForm();
        } catch (error) {
            console.error('Error loading task:', error);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        }
    }

    private static populateForm() {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
        const completedInput = document.getElementById('completed') as HTMLInputElement;
        const creationDateSpan = document.getElementById('creationDate');

        if (!this.task) {
            console.error('No task data available');
            return;
        }

        console.log('Populating form with:', this.task);

        if (titleInput) titleInput.value = this.task.title || '';
        if (descriptionInput) descriptionInput.value = this.task.description || '';
        if (completedInput) completedInput.checked = this.task.completed || false;
        if (creationDateSpan && this.task.creation_date) {
            creationDateSpan.textContent = new Date(this.task.creation_date).toLocaleDateString();
        }
    }

    private static setupEventListeners() {
        const form = document.getElementById('taskForm');
        const backBtn = document.getElementById('backBtn');
        const deleteBtn = document.querySelector('.delete-btn');

        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => window.history.back());
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', this.handleDelete.bind(this));
        }
    }

    private static async handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        
        try {
            const updatedTask = {
                ...this.task,
                title: (form.querySelector('input[name="title"]') as HTMLInputElement).value,
                description: (form.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value,
                completed: (form.querySelector('input[name="completed"]:checked') as HTMLInputElement) !== null,
            };

            const response = await fetch(`/api/v1/tasks/${this.task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) throw new Error('Failed to update task');

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    }

    private static async handleDelete() {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`/api/v1/tasks/${this.task.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task');

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => TaskDetail.init());

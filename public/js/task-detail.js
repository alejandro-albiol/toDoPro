"use strict";
class TaskDetail {
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
            await this.loadTask(taskId);
            this.setupEventListeners();
        }
        catch {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        }
    }
    static async loadTask(taskId) {
        try {
            const response = await fetch(`/api/v1/tasks/detail/${taskId}`);
            if (!response.ok) {
                throw new Error('Task not found');
            }
            const result = (await response.json());
            if (!result.isSuccess || !result.data) {
                throw new Error(result.message || 'Task not found');
            }
            this.task = result.data;
            this.populateForm();
        }
        catch (error) {
            console.error('Error loading task:', error);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        }
    }
    static populateForm() {
        const titleInput = document.getElementById('title');
        const descriptionInput = document.getElementById('description');
        const completedInput = document.getElementById('completed');
        const creationDateSpan = document.getElementById('creationDate');
        if (!this.task) {
            console.error('No task data available');
            return;
        }
        if (titleInput)
            titleInput.value = this.task.title || '';
        if (descriptionInput)
            descriptionInput.value = this.task.description || '';
        if (completedInput)
            completedInput.checked = this.task.completed || false;
        if (creationDateSpan && this.task.creation_date) {
            const date = new Date(this.task.creation_date).toLocaleDateString();
            creationDateSpan.textContent = date;
        }
    }
    static setupEventListeners() {
        const form = document.getElementById('taskForm');
        const backBtn = document.getElementById('backBtn');
        const deleteBtn = document.querySelector('.delete-btn');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                void TaskDetail.handleSubmit(e);
            });
        }
        if (backBtn) {
            backBtn.addEventListener('click', () => window.history.back());
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function () {
                void TaskDetail.handleDelete();
            });
        }
    }
    static async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        try {
            const updatedTask = {
                ...this.task,
                title: form.querySelector('input[name="title"]')
                    .value,
                description: form.querySelector('textarea[name="description"]').value,
                completed: form.querySelector('input[name="completed"]:checked') !== null,
            };
            const response = await fetch(`/api/v1/tasks/${this.task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });
            if (!response.ok)
                throw new Error('Failed to update task');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        }
        catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    }
    static async handleDelete() {
        if (!confirm('Are you sure you want to delete this task?'))
            return;
        try {
            const response = await fetch(`/api/v1/tasks/${this.task.id}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete task');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            window.location.href = `/home/${user.id}`;
        }
        catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    void TaskDetail.init();
});

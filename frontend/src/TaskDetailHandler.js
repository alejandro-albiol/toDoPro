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
class TaskDetail {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.loadTask(taskId);
                this.setupEventListeners();
            }
            catch (error) {
                console.error('Initialization error:', error);
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                window.location.href = `/home/${user.id}`;
            }
        });
    }
    static loadTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`/api/v1/tasks/detail/${taskId}`);
                console.log('API Response status:', response.status);
                if (!response.ok) {
                    throw new Error('Task not found');
                }
                const result = yield response.json();
                console.log('API Response data:', result);
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
        });
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
        console.log('Populating form with:', this.task);
        if (titleInput)
            titleInput.value = this.task.title || '';
        if (descriptionInput)
            descriptionInput.value = this.task.description || '';
        if (completedInput)
            completedInput.checked = this.task.completed || false;
    }
    static setupEventListeners() {
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
    static handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const form = event.target;
            try {
                const updatedTask = Object.assign(Object.assign({}, this.task), { title: form.querySelector('input[name="title"]').value, description: form.querySelector('textarea[name="description"]').value, completed: form.querySelector('input[name="completed"]:checked') !== null });
                const response = yield fetch(`/api/v1/tasks/${this.task.id}`, {
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
        });
    }
    static handleDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm('Are you sure you want to delete this task?'))
                return;
            try {
                const response = yield fetch(`/api/v1/tasks/${this.task.id}`, {
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
        });
    }
}
document.addEventListener('DOMContentLoaded', () => TaskDetail.init());

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
class TaskLoader {
    static loadTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    window.location.href = '/login';
                    return;
                }
                const user = JSON.parse(userStr);
                if (!(user === null || user === void 0 ? void 0 : user.id)) {
                    window.location.href = '/login';
                    return;
                }
                const response = yield fetch(`/api/v1/tasks/${user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const result = yield response.json();
                if (!(result === null || result === void 0 ? void 0 : result.data)) {
                    throw new Error('Invalid response format');
                }
                const tasks = JSON.parse(result.data);
                const container = document.getElementById('taskContainer');
                if (!container) {
                    throw new Error('Task container not found');
                    return;
                }
                container.innerHTML = '';
                if (tasks.length === 0) {
                    container.innerHTML = '<p class="no-tasks">No tasks found</p>';
                    return;
                }
                tasks.forEach((task) => {
                    const card = document.createElement('div');
                    card.className = `task-card ${task.completed ? 'completed' : ''}`;
                    card.innerHTML = this.createTaskCardHTML(task);
                    container.appendChild(card);
                });
            }
            catch (error) {
                const container = document.getElementById('taskContainer');
                if (container) {
                    container.innerHTML =
                        '<p class="error-message">Error loading tasks. Please try again later.</p>';
                }
            }
        });
    }
    static createTaskCardHTML(task) {
        const creationDate = new Date(task.creation_date).toLocaleDateString();
        const completionDate = task.completed_at
            ? new Date(task.completed_at).toLocaleDateString()
            : '';
        return `
            <h3>${this.escapeHtml(task.title)}</h3>
            <p>${this.escapeHtml(task.description)}</p>
            <p>Created: ${creationDate}</p>
            <div class="task-actions">
                <button class="complete-btn" data-task-id="${task.id}">
                    ${task.completed ? 'Completed' : 'Complete'}
                </button>
                <button class="delete-btn" data-task-id="${task.id}">Delete</button>
            </div>
            ${task.completed ? `<p class="completion-date">Completed on: ${completionDate}</p>` : ''}
        `;
    }
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
window.addEventListener('load', () => {
    void TaskLoader.loadTasks();
});

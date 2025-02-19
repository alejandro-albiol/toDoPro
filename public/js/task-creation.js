"use strict";
class TaskCreationHandler {
    static initialize() {
        this.setupEventListeners();
        this.setupCharacterCounter();
    }
    static getToken() {
        return localStorage.getItem('token');
    }
    static getUserFromToken() {
        const token = this.getToken();
        if (!token) {
            window.location.href = '/login';
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload?.userId) {
                throw new Error('Invalid token payload');
            }
            return payload;
        }
        catch (error) {
            console.error('Error decoding token:', error);
            window.location.href = '/login';
            return null;
        }
    }
    static setupEventListeners() {
        const form = document.getElementById('createTaskForm');
        const cancelButton = document.getElementById('cancel-button');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                void TaskCreationHandler.handleSubmit(e);
            });
        }
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                const user = this.getUserFromToken();
                if (user) {
                    window.location.href = `/home/${user.userId}`;
                }
            });
        }
    }
    static getFormData(form) {
        const formData = new FormData(form);
        const user = this.getUserFromToken();
        if (!user)
            return null;
        return {
            title: formData.get('title'),
            description: formData.get('description'),
            completed: false,
            user_id: user.userId,
            creation_date: new Date().toISOString(),
        };
    }
    static async handleSubmit(e) {
        try {
            const form = e.target;
            const taskData = this.getFormData(form);
            if (!taskData)
                return;
            const token = this.getToken();
            if (!token)
                return;
            const response = await fetch(`http://localhost:3000/api/v1/tasks/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            const result = (await response.json());
            if (!result) {
                throw new Error('Failed to create task');
            }
            window.location.href = `/home/${taskData.user_id}`;
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    }
    static setupCharacterCounter() {
        const inputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');
        inputs.forEach((input) => {
            const counter = document.querySelector(`.char-count[data-for="${input.id}"]`);
            if (!counter)
                return;
            const updateCount = () => {
                counter.textContent = `${input.value.length}/${input.maxLength}`;
            };
            input.addEventListener('input', updateCount);
            updateCount();
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    TaskCreationHandler.initialize();
});

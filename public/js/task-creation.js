"use strict";
class TaskCreationHandler {
    static setupCharacterCounter() {
        const inputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');
        inputs.forEach((input) => {
            const counter = document.querySelector(`.char-count[data-for="${input.id}"]`);
            if (!counter)
                return;
            const updateCount = () => {
                const maxLength = input.maxLength;
                const currentLength = input.value.length;
                counter.textContent = `${currentLength}/${maxLength}`;
            };
            input.addEventListener('input', updateCount);
            updateCount();
        });
    }
    static initialize() {
        this.setupEventListeners();
        this.setupCharacterCounter();
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
                const user = this.getUserFromStorage();
                window.location.href = `/home/${user.id}`;
            });
        }
    }
    static getUserFromStorage() {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            throw new Error('No user found');
        }
        const user = JSON.parse(userStr);
        if (!user.id) {
            throw new Error('Invalid user data');
        }
        return user;
    }
    static getFormData(form) {
        const formData = new FormData(form);
        const user = this.getUserFromStorage();
        return {
            title: formData.get('title'),
            description: formData.get('description'),
            completed: false,
            user_id: Number(user.id),
            creation_date: new Date().toISOString(),
        };
    }
    static async handleSubmit(e) {
        try {
            const form = e.target;
            const taskData = this.getFormData(form);
            const user = this.getUserFromStorage();
            const response = await fetch(`http://localhost:3000/api/v1/tasks/${user.id}/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            const result = (await response.json());
            if (!result.isSuccess) {
                throw new Error(result.message || 'Failed to create task');
            }
            window.location.href = `/home/${user.id}`;
        }
        catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
            else {
                alert('An unexpected error occurred');
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    TaskCreationHandler.initialize();
});

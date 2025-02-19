"use strict";
class HomeHandler {
    static async loadTasks() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
            let user;
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                user = payload;
            }
            catch (error) {
                console.error("Invalid token format:", error);
                window.location.href = '/login';
                return;
            }
            if (!user?.userId) {
                window.location.href = '/login';
                return;
            }
            const response = await fetch(`/api/v1/tasks/user/${user.userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching tasks: ${response.status} ${response.statusText}`);
            }
            const result = (await response.json());
            const container = document.getElementById('taskContainer');
            if (!container) {
                throw new Error('Task container not found');
            }
            container.innerHTML = '';
            if (!result.success) {
                container.innerHTML = `<p class="error-message">${this.escapeHtml(result.message || '')}</p>`;
                return;
            }
            if (!Array.isArray(result.data) || result.data.length === 0) {
                container.innerHTML = '<p class="no-tasks">No tasks yet. Create your first task!</p>';
                this.updateRecommendation("You have no tasks yet. Try adding one to stay productive!");
                return;
            }
            let completedCount = 0;
            let pendingCount = 0;
            let latestTaskTitle = "";
            result.data.forEach((task) => {
                const card = document.createElement('div');
                card.className = `task-card ${task.completed ? 'completed' : ''}`;
                card.setAttribute('data-task-id', task.id.toString());
                card.innerHTML = this.createTaskCardHTML(task);
                if (task.completed) {
                    completedCount++;
                }
                else {
                    pendingCount++;
                    latestTaskTitle = task.title;
                }
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.task-actions')) {
                        window.location.href = `/tasks/${task.id}`;
                    }
                });
                container.appendChild(card);
            });
            let recommendation = "Keep up the great work!";
            if (pendingCount > completedCount) {
                recommendation = `You have ${pendingCount} pending tasks. Try completing "${latestTaskTitle}" today!`;
            }
            else if (completedCount > 0) {
                recommendation = `Awesome! You've completed ${completedCount} tasks. Consider creating a new goal!`;
            }
            this.updateRecommendation(recommendation);
        }
        catch (error) {
            console.error('Error loading tasks:', error);
            const container = document.getElementById('taskContainer');
            if (container) {
                container.innerHTML = '<p class="error-message">Error loading tasks. Please try again later.</p>';
            }
        }
    }
    static updateRecommendation(text) {
        const recommendationText = document.querySelector('.recommendation-text');
        if (recommendationText) {
            recommendationText.textContent = text;
        }
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
        ${task.completed && completionDate ? `<p class="completion-date">Completed on: ${completionDate}</p>` : ''}
    `;
    }
    static async completeTask(taskId) {
        try {
            const token = this.getToken();
            const response = await fetch(`/api/v1/tasks/${taskId}/toggle-completion`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = (await response.json());
            if (result.success && result.data) {
                const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
                if (!taskCard)
                    return;
                const existingDate = taskCard.querySelector('.completion-date');
                if (existingDate) {
                    existingDate.remove();
                }
                if (result.data.completed) {
                    taskCard.classList.add('completed');
                    const completeBtn = taskCard.querySelector('.complete-btn');
                    if (completeBtn) {
                        completeBtn.textContent = 'Completed';
                    }
                    if (result.data.completed_at) {
                        const completionDate = new Date(result.data.completed_at).toLocaleDateString();
                        const dateElement = document.createElement('p');
                        dateElement.className = 'completion-date';
                        dateElement.textContent = `Completed on: ${completionDate}`;
                        taskCard.appendChild(dateElement);
                    }
                }
                else {
                    taskCard.classList.remove('completed');
                    const completeBtn = taskCard.querySelector('.complete-btn');
                    if (completeBtn) {
                        completeBtn.textContent = 'Complete';
                    }
                }
            }
        }
        catch (error) {
            console.error('Error completing task:', error);
        }
    }
    static async deleteTask(taskId) {
        try {
            const token = this.getToken();
            const response = await fetch(`/api/v1/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response) {
                await this.loadTasks();
            }
        }
        catch (error) {
            console.log("Error deleting task:", error);
        }
    }
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    static setupEventListeners() {
        this.setupProfileButton();
        this.setupTaskLoadingEvent();
        this.setupTaskCompletionEvent();
        this.setupTaskDeletionEvent();
        this.setupAddTaskButton();
        this.setupLogoutButton();
        this.setupPopStateEvent();
        this.setupSearchInput();
    }
    static setupAddTaskButton() {
        const addTaskButton = document.getElementById('addTaskButton');
        if (addTaskButton) {
            addTaskButton.addEventListener('click', () => {
                window.location.href = '/tasks/new';
            });
        }
    }
    static setupProfileButton() {
        const profileButton = document.getElementById('profile-button');
        if (profileButton) {
            profileButton.removeEventListener('click', this.handleProfileClick);
            profileButton.addEventListener('click', this.handleProfileClick);
        }
    }
    static setupTaskLoadingEvent() {
        window.addEventListener('load', () => {
            void this.loadTasks();
        });
    }
    static setupTaskCompletionEvent() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('complete-btn')) {
                const taskId = target.getAttribute('data-task-id');
                if (taskId) {
                    void this.completeTask(parseInt(taskId));
                }
                else {
                    console.error('Task ID not found');
                }
            }
        });
    }
    static setupTaskDeletionEvent() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('delete-btn')) {
                const taskId = target.getAttribute('data-task-id');
                if (window.confirm('Are you sure you want to delete this task?')) {
                    if (taskId) {
                        void this.deleteTask(parseInt(taskId));
                    }
                }
            }
        });
    }
    static setupLogoutButton() {
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = '/login';
            });
        }
    }
    static setupPopStateEvent() {
        window.addEventListener('popstate', () => {
            const path = window.location.pathname;
            if (path.startsWith('/home/')) {
                const userId = path.split('/').pop();
                if (userId) {
                    void this.loadTasks();
                }
            }
        });
    }
    static setupSearchInput() {
        const searchInput = document.getElementById('searchTasks');
        if (searchInput) {
            let debounceTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    const searchTerm = searchInput.value.toLowerCase().trim();
                    void this.filterTasks(searchTerm);
                }, 300);
            });
        }
    }
    static filterTasks(searchTerm) {
        const taskCards = document.querySelectorAll('.task-card');
        const container = document.getElementById('taskContainer');
        const existingNoResults = container?.querySelectorAll('.no-tasks');
        existingNoResults?.forEach((element) => element.remove());
        let hasVisibleCards = false;
        taskCards.forEach((card) => {
            const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent?.toLowerCase() || '';
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                hasVisibleCards = true;
            }
            else {
                card.style.display = 'none';
            }
        });
        if (container && !hasVisibleCards && searchTerm !== '') {
            const noResults = document.createElement('p');
            noResults.className = 'no-tasks';
            noResults.textContent = `No tasks found matching "${searchTerm}"`;
            container.appendChild(noResults);
        }
    }
    static getToken() {
        return localStorage.getItem('token');
    }
}
HomeHandler.handleProfileClick = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
        window.location.href = `/profile/${user.id}`;
    }
};
document.addEventListener('DOMContentLoaded', () => {
    HomeHandler.setupEventListeners();
});

interface TaskUser {
  id: number;
  username: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  creation_date: string;
  completed_at?: string;
  user_id: number;
}

class HomeHandler {
  static async loadTasks() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }


      const userStr = atob(token.split('.')[1]);
      const user = JSON.parse(userStr);
      if (!user?.userId) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`/api/v1/tasks/user/${user.userId}`);
      const result = (await response.json()) as ApiResponse<Task[]>;
      const container = document.getElementById('taskContainer');
      if (!container) {
        throw new Error('Task container not found');
      }

      container.innerHTML = '';

      if (
        result.isSuccess &&
        Array.isArray(result.data) &&
        result.data.length === 0
      ) {
        container.innerHTML =
          '<p class="no-tasks">No tasks yet. Create your first task!</p>';
        return;
      }

      if (!result.isSuccess) {
        container.innerHTML = `<p class="error-message">${result.message}</p>`;
        return;
      }

      if (result.isSuccess && result.data) {
        result.data.forEach((task: Task) => {
          const card = document.createElement('div');
          card.className = `task-card ${task.completed ? 'completed' : ''}`;
          card.setAttribute('data-task-id', task.id.toString());
          card.innerHTML = this.createTaskCardHTML(task);

          card.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest('.task-actions')) {
              window.location.href = `/tasks/${task.id}`;
            }
          });

          container.appendChild(card);
        });
      }

      await this.loadRecommendation();
    } catch (error) {
      const container = document.getElementById('taskContainer');
      if (container) {
        container.innerHTML =
          '<p class="error-message">Error loading tasks. Please try again later.</p>';
      }
      console.error('Error loading tasks:', error);
    }
  }

  private static createTaskCardHTML(task: Task): string {
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

  static async completeTask(taskId: number): Promise<void> {
    try {
      const response = await fetch(
        `/api/v1/tasks/${taskId}/toggle-completion`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = (await response.json()) as ApiResponse<Task>;

      if (result.isSuccess && result.data) {
        const taskCard = document.querySelector(
          `.task-card[data-task-id="${taskId}"]`,
        );
        if (!taskCard) return;

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
            const completionDate = new Date(
              result.data.completed_at,
            ).toLocaleDateString();
            const dateElement = document.createElement('p');
            dateElement.className = 'completion-date';
            dateElement.textContent = `Completed on: ${completionDate}`;
            taskCard.appendChild(dateElement);
          }
        } else {
          taskCard.classList.remove('completed');
          const completeBtn = taskCard.querySelector('.complete-btn');
          if (completeBtn) {
            completeBtn.textContent = 'Complete';
          }
        }
      }
    } catch (error: unknown) {
      console.error('Error completing task:', error);
    }
  }

  static async deleteTask(taskId: number): Promise<void> {
    const response = await fetch(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await this.loadTasks();
    } else {
      console.error('Error deleting task:', response.statusText);
    }
  }

  private static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static setupEventListeners(): void {
    this.setupProfileButton();
    this.setupTaskLoadingEvent();
    this.setupTaskCompletionEvent();
    this.setupTaskDeletionEvent();
    this.setupAddTaskButton();
    this.setupLogoutButton();
    this.setupPopStateEvent();
    this.setupSearchInput();
    void this.loadRecommendation();
  }

  private static setupAddTaskButton(): void {
    const addTaskButton = document.getElementById('addTaskButton');
    if (addTaskButton) {
      addTaskButton.addEventListener('click', () => {
        window.location.href = '/tasks/new';
      });
    }
  }

  private static setupProfileButton(): void {
    const profileButton = document.getElementById('profile-button');
    if (profileButton) {
      profileButton.removeEventListener('click', this.handleProfileClick);
      profileButton.addEventListener('click', this.handleProfileClick);
    }
  }

  private static handleProfileClick = (): void => {
    const user = JSON.parse(localStorage.getItem('user') || '{}') as TaskUser;
    if (user?.id) {
      window.location.href = `/profile/${user.id}`;
    }
  };

  private static setupTaskLoadingEvent(): void {
    window.addEventListener('load', () => {
      void this.loadTasks();
    });
  }

  private static setupTaskCompletionEvent(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('complete-btn')) {
        const taskId = target.getAttribute('data-task-id');
        if (taskId) {
          void this.completeTask(parseInt(taskId));
        } else {
          console.error('Task ID not found');
        }
      }
    });
  }

  private static setupTaskDeletionEvent(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
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

  private static setupLogoutButton(): void {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login';
      });
    }
  }

  private static setupPopStateEvent(): void {
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

  private static setupSearchInput(): void {
    const searchInput = document.getElementById(
      'searchTasks',
    ) as HTMLInputElement;
    if (searchInput) {
      let debounceTimeout: NodeJS.Timeout;

      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const searchTerm = searchInput.value.toLowerCase().trim();
          void this.filterTasks(searchTerm);
        }, 300);
      });
    }
  }

  private static filterTasks(searchTerm: string): void {
    const taskCards = document.querySelectorAll('.task-card');
    const container = document.getElementById('taskContainer');

    const existingNoResults = container?.querySelectorAll('.no-tasks');
    existingNoResults?.forEach((element) => element.remove());

    let hasVisibleCards = false;

    taskCards.forEach((card) => {
      const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
      const description =
        card.querySelector('p')?.textContent?.toLowerCase() || '';

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        (card as HTMLElement).style.display = 'block';
        hasVisibleCards = true;
      } else {
        (card as HTMLElement).style.display = 'none';
      }
    });

    if (container && !hasVisibleCards && searchTerm !== '') {
      const noResults = document.createElement('p');
      noResults.className = 'no-tasks';
      noResults.textContent = `No tasks found matching "${searchTerm}"`;
      container.appendChild(noResults);
    }
  }

  private static async loadRecommendation(): Promise<void> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}') as TaskUser;
      if (!user?.id) return;

      const response = await fetch(`/api/v1/ai/recommendation/${user.id}`);
      const result = (await response.json()) as ApiResponse<string>;

      if (result.isSuccess && result.data) {
        const recommendationText = document.querySelector(
          '.recommendation-text',
        );
        if (recommendationText) {
          recommendationText.textContent = result.data;
        }
      }
    } catch (error: unknown) {
      console.error('Error loading recommendation:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  HomeHandler.setupEventListeners();
});

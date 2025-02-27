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

  private static getUserFromToken(): { userId: number } | null {
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
    } catch (error) {
      console.error('Error decoding token:', error);
      window.location.href = '/login';
      return null;
    }
  } 

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
        } catch (error) {
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

        const result = (await response.json()) as ApiResponse<Task[]>;

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

        result.data.forEach((task: Task) => {
            const card = document.createElement('div');
            card.className = `task-card ${task.completed ? 'completed' : ''}`;
            card.setAttribute('data-task-id', task.id.toString());
            card.innerHTML = this.createTaskCardHTML(task);

            if (task.completed) {
                completedCount++;
            } else {
                pendingCount++;
                latestTaskTitle = task.title;
            }

            card.addEventListener('click', (e) => {
                if (!(e.target as HTMLElement).closest('.task-actions')) {
                    window.location.href = `/tasks/${task.id}`;
                }
            });

            container.appendChild(card);
        });

        let recommendation = "Keep up the great work!";
        if (pendingCount > completedCount) {
            recommendation = `You have ${pendingCount} pending tasks. Try completing "${latestTaskTitle}" today!`;
        } else if (completedCount > 0) {
            recommendation = `Awesome! You've completed ${completedCount} tasks. Consider creating a new goal!`;
        }

        await this.fetchAiRecommendation(result.data);

    } catch (error) {
        console.error('Error loading tasks:', error);
        const container = document.getElementById('taskContainer');
        if (container) {
            container.innerHTML = '<p class="error-message">Error loading tasks. Please try again later.</p>';
        }
    }
}

private static updateRecommendation(text: string): void {
    const recommendationText = document.querySelector('.recommendation-text');
    if (recommendationText) {
        recommendationText.textContent = text;
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

      const token = this.getToken();
      const response = await fetch(
        `/api/v1/tasks/${taskId}/completed`,
        {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',},
        },
      );

      const result = (await response.json()) as ApiResponse<Task>;

      if (result.success && result.data) {
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
      }if (response) {
        await this.loadTasks();
        }
     }catch(error: unknown){
      console.log("Error deleting task:", error)
     }
  }

  static async deleteTask(taskId: number): Promise<void> {
    try{
      const token = this.getToken()
      const response = await fetch(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE',          
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',}
      });

    if (response.status!= 400 && response.status!= 500) {
      await this.loadTasks();
      }
   }catch(error: unknown){
    console.log("Error deleting task:", error)
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
      try {
        const user = this.getUserFromToken()
      if (user?.userId) {
        window.location.href = `/profile/${user.userId}`;
      }
    }catch(error:unknown){
      console.log("Error getting token:", error)
    }
  }

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

  private static getToken(): string | null {
    return localStorage.getItem('token');
  }

  private static async fetchAiRecommendation(tasks: Task[]): Promise<void> {
    try {
        const token = this.getToken();

        const response = await fetch('/recommendation/recommend', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tasks)
        });

        if (!response.ok) {
            throw new Error(`Error fetching AI recommendation: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.recommendation) {
            this.updateRecommendation(data.recommendation);
        }
    } catch (error) {
        console.error('Error fetching AI recommendation:', error);
    }
}

}

document.addEventListener('DOMContentLoaded', () => {
  HomeHandler.setupEventListeners();
});

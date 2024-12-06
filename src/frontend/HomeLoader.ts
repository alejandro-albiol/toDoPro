interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  creation_date: string;
  completed_at?: string;
  user_id: number;
}

class TaskLoader {
  static async loadTasks() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(userStr);
      if (!user?.id) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`/api/v1/tasks/user/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const result = await response.json();
      const container = document.getElementById('taskContainer');
      if (!container) {
        throw new Error('Task container not found');
      }

      container.innerHTML = '';

      if (result.isSuccess && Array.isArray(result.data) && result.data.length === 0) {
        container.innerHTML = '<p class="no-tasks">No tasks yet. Create your first task!</p>';
        return;
      }

      if (!result.isSuccess) {
        container.innerHTML = `<p class="error-message">${result.message}</p>`;
        return;
      }

      result.data.forEach((task: Task) => {
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'completed' : ''}`;
        card.innerHTML = this.createTaskCardHTML(task);
        
        card.addEventListener('click', (e) => {
          if (!(e.target as HTMLElement).closest('.task-actions')) {
            window.location.href = `/tasks/${task.id}`;
          }
        });
        
        container.appendChild(card);
      });

      const profileBtn = document.getElementById('profileBtn');
      if (profileBtn) {
        profileBtn.addEventListener('click', () => {
          window.location.href = `/profile/${user.id}`;
        });
      }
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
            ${task.completed ? `<p class="completion-date">Completed on: ${completionDate}</p>` : ''}
        `;
  }

  private static escapeHtml(unsafe: string): string {
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

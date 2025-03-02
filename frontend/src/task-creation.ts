interface TaskCreationDTO {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  creation_date: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class TaskCreationHandler {
  static initialize(): void {
    this.setupEventListeners();
    this.setupCharacterCounter();
  }

  private static getToken(): string | null {
    return localStorage.getItem('token');
  }

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

  static setupEventListeners(): void {
    const form = document.getElementById('createTaskForm') as HTMLFormElement;
    const cancelButton = document.getElementById('cancel-button');

    if (form) {
      form.addEventListener('submit', (e: Event) => {
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

  private static getFormData(form: HTMLFormElement): Omit<TaskCreationDTO, 'id'> {
    const formData = new FormData(form);
    const user = this.getUserFromToken();
    if (!user) return null!;

    return {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      completed: false,
      user_id: user.userId,
      creation_date: new Date().toISOString(),
    };
  }

  private static async handleSubmit(e: Event): Promise<void> {
    try {
      const form = e.target as HTMLFormElement;
      const taskData = this.getFormData(form);
      if (!taskData) return;

      const token = this.getToken();
      if (!token) return;

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

      const result = (await response.json()) as ApiResponse<TaskCreationDTO>;

      if (!result) {
        throw new Error('Failed to create task');
      }

      window.location.href = `/home/${taskData.user_id}`;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }

  static setupCharacterCounter(): void {
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[maxlength], textarea[maxlength]');

    inputs.forEach((input) => {
      const counter = document.querySelector<HTMLElement>(`.char-count[data-for="${input.id}"]`);
      if (!counter) return;

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

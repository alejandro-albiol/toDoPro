interface TaskCreationDTO {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  creation_date: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
}

class TaskCreationHandler {
  static setupCharacterCounter(): void {
    const inputs = document.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >('input[maxlength], textarea[maxlength]');

    inputs.forEach((input) => {
      const counter = document.querySelector<HTMLElement>(
        `.char-count[data-for="${input.id}"]`,
      );
      if (!counter) return;

      const updateCount = () => {
        const maxLength = input.maxLength;
        const currentLength = input.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
      };

      input.addEventListener('input', updateCount);
      updateCount();
    });
  }

  static initialize(): void {
    this.setupEventListeners();
    this.setupCharacterCounter();
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
        const user = this.getUserFromStorage();
        window.location.href = `/home/${user.id}`;
      });
    }
  }

  private static getUserFromStorage(): User {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('No user found');
    }
    const user = JSON.parse(userStr) as User;
    if (!user.id) {
      throw new Error('Invalid user data');
    }
    return user;
  }

  private static getFormData(
    form: HTMLFormElement,
  ): Omit<TaskCreationDTO, 'id'> {
    const formData = new FormData(form);
    const user = this.getUserFromStorage();

    return {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      completed: false,
      user_id: Number(user.id),
      creation_date: new Date().toISOString(),
    };
  }

  private static async handleSubmit(e: Event): Promise<void> {
    try {
      const form = e.target as HTMLFormElement;
      const taskData = this.getFormData(form);
      const user = this.getUserFromStorage();

      const response = await fetch(
        `http://localhost:3000/api/v1/tasks/${user.id}/new`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const result = (await response.json()) as ApiResponse<TaskCreationDTO>;

      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to create task');
      }

      window.location.href = `/home/${user.id}`;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TaskCreationHandler.initialize();
});

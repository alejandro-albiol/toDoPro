interface CreateTaskDTO {
    title: string;
    description: string;
    user_id: number;
}

class TaskCreationHandler {
    private static validateInputs(taskData: CreateTaskDTO): string | null {
        if (!taskData.title?.trim() || !taskData.description?.trim()) {
            return 'Please fill in all required fields';
        }
        if (taskData.title.length > 100) {
            return 'Title must be less than 100 characters';
        }
        if (taskData.description.length > 500) {
            return 'Description must be less than 500 characters';
        }
        return null;
    }

    private static getFormData(form: HTMLFormElement): CreateTaskDTO | null {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.id) {
                window.location.href = '/login';
                return null;
            }

            const formData = new FormData(form);
            return {
                title: (formData.get('title') as string).trim(),
                description: (formData.get('description') as string).trim(),
                user_id: user.id
            };
        } catch (error) {
            console.error('Error getting form data:', error);
            return null;
        }
    }

    static setupEventListeners(): void {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const backButton = document.getElementById('cancel-button');
        const createTaskForm = document.getElementById('createTaskForm');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.location.href = `/home/${user.id}`;
            });
        }
        if (createTaskForm) {
            createTaskForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const taskData = this.getFormData(form);

                if (!taskData) {
                    alert('Error getting form data');
                    return;
                }

                const validationError = this.validateInputs(taskData);
                if (validationError) {
                    alert(validationError);
                    return;
                }

                try {
                    const response = await fetch(`/api/v1/tasks/${user.id}/new`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(taskData),
                    });

                    const result = await response.json();
                    
                    if (response.ok && result.isSuccess) {
                        window.location.href = `/home/${user.id}`;
                        return;
                    }

                    alert(result.message || 'Error creating task');
                } catch (error) {
                    console.error('Error creating task:', error);
                    alert('Error creating task. Please try again.');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    TaskCreationHandler.setupEventListeners();
}); 
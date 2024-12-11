interface CreateTaskDTO {
    title: string;
    description: string;
    user_id: number;
}

class TaskCreationHandler {
    private static readonly MAX_TITLE_LENGTH = 100;
    private static readonly MAX_DESCRIPTION_LENGTH = 500;

    static init(): void {
        this.setupEventListeners();
    }

    private static setupEventListeners(): void {
        this.setupFormSubmit();
        this.setupInputValidations();
        this.setupCharacterCounters();
        this.setupCancelButton();
    }

    private static setupFormSubmit(): void {
        const form = document.getElementById('createTaskForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (this.validateForm()) {
                    await this.handleSubmit(e);
                }
            });
        }
    }

    private static setupInputValidations(): void {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;

        if (titleInput) {
            titleInput.addEventListener('input', () => {
                this.validateField(titleInput, this.MAX_TITLE_LENGTH);
            });
        }

        if (descriptionInput) {
            descriptionInput.addEventListener('input', () => {
                this.validateField(descriptionInput, this.MAX_DESCRIPTION_LENGTH);
            });
        }
    }

    private static setupCharacterCounters(): void {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
        const titleCount = document.querySelector('.char-count[data-for="title"]');
        const descriptionCount = document.querySelector('.char-count[data-for="description"]');

        if (titleInput && titleCount) {
            this.updateCharCount(titleInput, titleCount, this.MAX_TITLE_LENGTH);
            titleInput.addEventListener('input', () => {
                this.updateCharCount(titleInput, titleCount, this.MAX_TITLE_LENGTH);
            });
        }

        if (descriptionInput && descriptionCount) {
            this.updateCharCount(descriptionInput, descriptionCount, this.MAX_DESCRIPTION_LENGTH);
            descriptionInput.addEventListener('input', () => {
                this.updateCharCount(descriptionInput, descriptionCount, this.MAX_DESCRIPTION_LENGTH);
            });
        }
    }

    private static setupCancelButton(): void {
        const cancelButton = document.getElementById('cancel-button');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                window.location.href = `/home/${user.id}`;
            });
        }
    }

    // Métodos de validación
    private static validateField(input: HTMLInputElement | HTMLTextAreaElement, maxLength: number): boolean {
        const value = input.value.trim();
        const isValid = value.length > 0 && value.length <= maxLength;

        if (!isValid) {
            input.classList.add('invalid');
            this.showError(input, value.length === 0 ? 'This field is required' : `Maximum length is ${maxLength} characters`);
        } else {
            input.classList.remove('invalid');
            this.clearError(input);
        }

        return isValid;
    }

    private static validateForm(): boolean {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;

        const isTitleValid = this.validateField(titleInput, this.MAX_TITLE_LENGTH);
        const isDescriptionValid = this.validateField(descriptionInput, this.MAX_DESCRIPTION_LENGTH);

        return isTitleValid && isDescriptionValid;
    }

    // Métodos de UI
    private static updateCharCount(input: HTMLInputElement | HTMLTextAreaElement, counter: Element, maxLength: number): void {
        const remaining = maxLength - input.value.length;
        counter.textContent = `${input.value.length}/${maxLength}`;
        
        if (remaining <= 20) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    private static showError(input: HTMLElement, message: string): void {
        let errorDiv = input.nextElementSibling?.classList.contains('error-message') 
            ? input.nextElementSibling 
            : document.createElement('div');
        
        if (!errorDiv.classList.contains('error-message')) {
            errorDiv.className = 'error-message';
            input.parentNode?.insertBefore(errorDiv, input.nextSibling);
        }
        
        errorDiv.textContent = message;
    }

    private static clearError(input: HTMLElement): void {
        const errorDiv = input.nextElementSibling;
        if (errorDiv?.classList.contains('error-message')) {
            errorDiv.remove();
        }
    }

    // Métodos de datos y envío
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

    private static async handleSubmit(e: Event): Promise<void> {
        const form = e.target as HTMLFormElement;
        const taskData = this.getFormData(form);
        if (!taskData) {
            alert('Error getting form data');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
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
    }
}

document.addEventListener('DOMContentLoaded', () => TaskCreationHandler.init()); 
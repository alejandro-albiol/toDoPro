interface RegisterDTO {
    username: string;
    email: string;
    password: string;
}

class RegisterHandler {
    private static validateInputs(registerData: RegisterDTO): string | null {
        if (!registerData.username || !registerData.email || !registerData.password) {
            return 'Please fill in all fields';
        }
        
        if (registerData.password.length < 8 || registerData.password.length > 20) {
            return 'Password must be at least 8 characters long and less than 20 characters';
        }
        
        return null;
    }

    private static getFormData(form: HTMLFormElement): RegisterDTO {
        const formData = new FormData(form);
        return {
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };
    }

    private static handleRegistrationError(message: string): void {
        switch (message) {
            case 'Username is already taken':
                alert('Username already exists');
                break;
            case 'Email is already registered':
                alert('Email already exists');
                break;
            default:
                alert('Error during registration. Please try again.');
        }
    }

    private static saveUserData(data: any): void {
        const userData = {
            id: data.id,
            username: data.username,
            email: data.email,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = `/home/${userData.id}`;
    }

    static setupEventListeners(): void {
        const signInForm = document.getElementById('signInForm');
        if (signInForm) {
            signInForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const registerData = this.getFormData(form);
                
                const validationError = this.validateInputs(registerData);
                if (validationError) {
                    alert(validationError);
                    return;
                }

                try {
                    const response = await fetch('/api/v1/users/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(registerData),
                    });

                    const result = await response.json();
                    console.log('Registration response:', result);
                    
                    if (response.ok && result.isSuccess) {
                        this.saveUserData(result.data);
                        return;
                    }

                    this.handleRegistrationError(result.message);
                } catch (error) {
                    console.error('Error during registration:', error);
                    alert('Error during registration. Please try again.');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    RegisterHandler.setupEventListeners();
});


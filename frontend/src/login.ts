interface LoginDTO {
  username: string;
  password: string;
}

interface UserData {
  id: string;
  username: string;
  email: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
}

class LoginHandler {
  private static validateInputs(loginData: LoginDTO): string | null {
    if (!loginData.username || !loginData.password) {
      return 'Please fill in all fields';
    }
    return null;
  }

  private static getFormData(form: HTMLFormElement): LoginDTO {
    const formData = new FormData(form);
    return {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };
  }

  private static handleLoginError(message: string): void {
    switch (message) {
      case 'User not found':
        alert('Username does not exist');
        break;
      case 'Invalid password':
        alert('Incorrect password');
        break;
      default:
        alert('Error during login. Please try again.');
    }
  }

  private static saveUserData(data: ApiResponse<UserData>): void {
    const userData = {
      id: data.data?.id,
      username: data.data?.username,
      email: data.data?.email,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.href = `/home/${userData.id}`;
  }

  static async handleLogin(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const loginData = this.getFormData(form);

    const validationError = this.validateInputs(loginData);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = (await response.json()) as ApiResponse<UserData>;

      if (result.isSuccess) {
        this.saveUserData(result);
        return;
      }

      this.handleLoginError(result.message || 'An unknown error occurred');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login. Please try again.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener(
      'submit',
      (e) => void LoginHandler.handleLogin(e),
    );
  }
});

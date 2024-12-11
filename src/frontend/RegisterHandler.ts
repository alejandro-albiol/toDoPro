interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  id: string;
  username: string;
  email: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
}

class RegisterHandler {
  private static validateInputs(registerData: RegisterDTO): string | null {
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
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

  private static saveUserData(data: RegisterResponse): void {
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.href = `/home/${userData.id}`;
  }

  private static async handleGoogleSignIn(response: { credential: string }) {
    try {
      const result = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const apiResponse =
        (await result.json()) as ApiResponse<RegisterResponse>;

      if (apiResponse.isSuccess && apiResponse.data) {
        const userData = apiResponse.data;
        const id = userData.id;
        const username = userData.username;
        const email = userData.email;

        localStorage.setItem('user', JSON.stringify({ id, username, email }));
        window.location.href = `/home/${id}`;
      } else {
        throw new Error(apiResponse.message || 'Registration failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred');
      }
    }
  }

  static setupEventListeners(): void {
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
      signInForm.addEventListener('submit', function (e: Event) {
        e.preventDefault();
        void RegisterHandler.handleSubmit(e);
      });
    }
  }

  private static async handleSubmit(e: Event): Promise<void> {
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

      const result = (await response.json()) as ApiResponse<RegisterResponse>;

      if (response.ok && result.isSuccess && result.data) {
        this.saveUserData(result.data);
        return;
      }

      this.handleRegistrationError(result.message || 'Registration failed');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Please try again.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  RegisterHandler.setupEventListeners();
});

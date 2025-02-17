class RegisterHandler {
  static validateInputs(loginData: { username: string; email:string; password: string }) {
      if (!loginData.username || !loginData.password || !loginData.email) {
          return 'Please fill in all fields';
      }
      return null;
  }

  static getFormData(form: HTMLFormElement) {
      const formData = new FormData(form);
      return {
          username: formData.get('username') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
      };
  }

  static async handleLogin(event: Event) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const loginData = this.getFormData(form);
      const validationError = this.validateInputs(loginData);
      if (validationError) {
          alert(validationError);
          return;
      }
      try {
          const response = await fetch('/api/v1/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(loginData),
          });
          const result = await response.json();
          if (result.success) {
              return;
          } else {
              console.error(result.error.code || 'An unknown error occurred');
              alert(result.error.message || 'An unknown error occurred');
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('Error during login. Please try again.');
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('regusterForm') as HTMLFormElement;
  if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          RegisterHandler.handleLogin(e);
      });
  }
});
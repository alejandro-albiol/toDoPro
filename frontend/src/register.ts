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

  static async handleRegister(event: Event) {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const registerData = this.getFormData(form);
      const validationError = this.validateInputs(registerData);
      if (validationError) {
          alert(validationError);
          return;
      }
      try {
          const response = await fetch('/api/v1/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(registerData),
          });
          const result = await response.json();
          if (result.success) {
              return;
          }   
          console.error(result.errors.code || 'An unknown error occurred');
          alert(result.errors.message || 'An unknown error occurred');
        } catch (errors) {
          console.error(errors);
          alert(errors);
        }
      }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('registerForm') as HTMLFormElement;
  if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          RegisterHandler.handleRegister(e);
      });
  }
});
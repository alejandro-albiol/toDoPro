class LoginHandler {
    static validateInputs(loginData: { username: string; password: string }) {
      if (!loginData.username || !loginData.password) {
        return 'Please fill in all fields';
      }
      return null;
    }
  
    static getFormData(form: HTMLFormElement) {
      const formData = new FormData(form);
      return {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      };
    }
  
    static decodeToken(token: string) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload;
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    }
  
    static saveToken(token: string) {
      localStorage.setItem('token', token);
  
      const decodedToken = this.decodeToken(token);
      const userID = decodedToken?.userId;
  
      if (!userID) {
        console.error('User ID not found in token');
        alert('Login failed: Invalid token');
        return;
      }
  
      window.location.href = `/home/${userID}`;
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
  
        if (result.success && result.data) {
          this.saveToken(result.data.token);
          return;
        }
  
        console.error(result.error.code || 'An unknown error occurred');
        alert(result.error.message || 'An unknown error occurred');
      } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => void LoginHandler.handleLogin(e));
    }
  });
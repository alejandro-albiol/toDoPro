interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data?: User;
}

class LoginHandler {
  static async handleLogin(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const loginData = {
      username: formData.get('username'),
      password: formData.get('password'),
    };
    try {
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const data = await response.json();
        const userData = {
          id: data.data.id,
          username: data.data.username,
          email: data.data.email,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = `/home/${userData.id}`;
      } else {
        alert('Invalid username or password');
      }
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

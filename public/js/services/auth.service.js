class AuthService {
    static TOKEN_KEY = 'auth_token';
    static USER_KEY = 'user_data';
    static API_BASE_URL = '/api/v1';

    static async login(username, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error.message);
            }

            // Store token and user data
            this.setToken(data.data.token);
            return data.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error.message);
            }

            return data.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.location.href = '/login';  // Static route for login page
    }

    static setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static getAuthHeaders() {
        const token = this.getToken();
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        } : {
            'Content-Type': 'application/json',
        };
    }

    // Utility method to make authenticated requests
    static async fetchAuthenticated(url, options = {}) {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated');
        }

        // Add API base URL if the URL doesn't start with http(s)
        const fullUrl = url.startsWith('http') ? url : `${this.API_BASE_URL}${url}`;

        try {
            const response = await fetch(fullUrl, {
                ...options,
                headers: {
                    ...options.headers,
                    ...this.getAuthHeaders(),
                },
            });

            const data = await response.json();
            
            // Handle token expiration
            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!data.success) {
                throw new Error(data.error.message);
            }

            return data.data;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }
} 
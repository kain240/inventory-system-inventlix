import { API_BASE_URL } from './config';

// Helper function to make API calls
export const apiClient = {
    // Generic method for making requests
    async request(url, options = {}) {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add authorization header if token exists
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(fullUrl, config);

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${data?.detail || data || 'Unknown error'}`);
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    },

    // Convenience methods
    get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    },

    post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    patch(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    },
};
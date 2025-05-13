import { apiClient } from './client';
import { FULL_API_URLS } from './config';

export const authService = {
    // Login and get tokens
    async login(username, password) {
        try {
            const response = await apiClient.post(FULL_API_URLS.auth.login, {
                username,
                password,
            });

            // Save tokens to localStorage
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    // Logout and blacklist token
    async logout() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await apiClient.post(FULL_API_URLS.auth.logout, {
                    refresh: refreshToken,
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear tokens from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    },

    // Refresh access token
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await apiClient.post(FULL_API_URLS.auth.refresh, {
                refresh: refreshToken,
            });

            localStorage.setItem('access_token', response.access);
            return response;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, user needs to login again
            this.logout();
            throw error;
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },

    // Get current user token
    getToken() {
        return localStorage.getItem('access_token');
    },
};
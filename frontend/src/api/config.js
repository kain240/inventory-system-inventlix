// API configuration file
export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
    // Authentication endpoints
    auth: {
        login: '/api/token/',
        refresh: '/api/token/refresh/',
        verify: '/api/token/verify/',
        logout: '/api/inventory/logout/blacklist/',
    },
    // Inventory endpoints
    inventory: {
        list: '/api/inventory/',
        create: '/api/inventory/',
        detail: (id) => `/api/inventory/product/${id}/`,
        update: (id) => `/api/inventory/product/${id}/`,
        delete: (id) => `/api/inventory/product/${id}/`,
    },
};

// Full URLs for convenience
export const FULL_API_URLS = {
    auth: {
        login: `${API_BASE_URL}${API_ENDPOINTS.auth.login}`,
        refresh: `${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`,
        verify: `${API_BASE_URL}${API_ENDPOINTS.auth.verify}`,
        logout: `${API_BASE_URL}${API_ENDPOINTS.auth.logout}`,
    },
    inventory: {
        list: `${API_BASE_URL}${API_ENDPOINTS.inventory.list}`,
        create: `${API_BASE_URL}${API_ENDPOINTS.inventory.create}`,
        detail: (id) => `${API_BASE_URL}${API_ENDPOINTS.inventory.detail(id)}`,
        update: (id) => `${API_BASE_URL}${API_ENDPOINTS.inventory.update(id)}`,
        delete: (id) => `${API_BASE_URL}${API_ENDPOINTS.inventory.delete(id)}`,
    },
};
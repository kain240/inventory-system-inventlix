import { apiClient } from './client';
import { FULL_API_URLS } from './config';

export const inventoryService = {
    // Get all products
    async getProducts() {
        try {
            const response = await apiClient.get(FULL_API_URLS.inventory.list);
            return response;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    },

    // Get a specific product
    async getProduct(id) {
        try {
            const response = await apiClient.get(FULL_API_URLS.inventory.detail(id));
            return response;
        } catch (error) {
            console.error(`Failed to fetch product ${id}:`, error);
            throw error;
        }
    },

    // Create a new product
    async createProduct(productData) {
        try {
            const response = await apiClient.post(FULL_API_URLS.inventory.create, productData);
            return response;
        } catch (error) {
            console.error('Failed to create product:', error);
            throw error;
        }
    },

    // Update a product
    async updateProduct(id, productData) {
        try {
            const response = await apiClient.put(FULL_API_URLS.inventory.update(id), productData);
            return response;
        } catch (error) {
            console.error(`Failed to update product ${id}:`, error);
            throw error;
        }
    },

    // Partially update a product
    async patchProduct(id, productData) {
        try {
            const response = await apiClient.patch(FULL_API_URLS.inventory.update(id), productData);
            return response;
        } catch (error) {
            console.error(`Failed to patch product ${id}:`, error);
            throw error;
        }
    },

    // Delete a product
    async deleteProduct(id) {
        try {
            const response = await apiClient.delete(FULL_API_URLS.inventory.delete(id));
            return response;
        } catch (error) {
            console.error(`Failed to delete product ${id}:`, error);
            throw error;
        }
    },
};
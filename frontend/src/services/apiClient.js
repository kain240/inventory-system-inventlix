// apiClient.js - Updated to fix connection issues

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

// Ensure baseURL ends with a slash if it doesn't already
let baseURL = import.meta.env.VITE_REACT_BASE_URL || 'http://127.0.0.1:8000/';
if (!baseURL.endsWith('/')) {
  baseURL += '/';
}

console.log('API base URL:', baseURL); // Debug logging

// Create axios instance for login/authentication
export const axiosLog = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Create main axios instance with authentication
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Enhanced error logging for axiosLog
axiosLog.interceptors.request.use(
    request => {
      console.log('Starting Auth Request:', request.url);
      return request;
    },
    error => {
      console.error('Auth Request Error:', error);
      return Promise.reject(error);
    }
);

axiosLog.interceptors.response.use(
    response => {
      console.log('Auth Response:', response.status);
      return response;
    },
    error => {
      console.error('Auth Response Error:', error);
      if (error.response) {
        console.log('Error Status:', error.response.status);
        console.log('Error Data:', error.response.data);
      } else if (error.request) {
        console.log('No response received:', error.request);
      }
      return Promise.reject(error);
    }
);

// Initialize token headers if tokens exist
const initTokens = () => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    axiosLog.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  }
};

// Call initialization
initTokens();

// Request interceptor for handling token refresh
axiosInstance.interceptors.request.use(async (req) => {
  // Get current access token (it might have changed since module initialization)
  const accessToken = localStorage.getItem('access_token') || null;

  if (!accessToken) {
    // No token available
    console.log('No access token available');
    delete req.headers.Authorization;
    return req;
  }

  try {
    // Decode token to check expiration
    const user = jwtDecode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    console.log('Token expired?', isExpired);

    if (!isExpired) {
      // Token still valid, update header and continue
      req.headers.Authorization = `Bearer ${accessToken}`;
      return req;
    }

    // Token expired, try to refresh
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.log('No refresh token available');
      delete req.headers.Authorization;
      return req;
    }

    console.log('Refreshing token...');
    const response = await axios.post(`${baseURL}token/refresh/`, {
      refresh: refreshToken,
    });

    console.log(`Old token: ${accessToken.substring(0, 15)}...`);
    console.log(`New token: ${response.data.access.substring(0, 15)}...`);

    // Store new tokens
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    // Update request header with new token
    req.headers.Authorization = `Bearer ${response.data.access}`;

  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens if refresh failed
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete req.headers.Authorization;
    }
  }

  return req;
});

export default axiosInstance;
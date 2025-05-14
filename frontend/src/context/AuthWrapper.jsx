// AuthWrapper.jsx - Updated to work with improved apiClient

import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { axiosLog } from '../services/apiClient';
import { useSnackbar } from 'notistack';

export const AuthContext = createContext();

export const AuthWrapper = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  const [authTokens, setAuthTokens] = useState(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
      try {
        return { access: accessToken, refresh: refreshToken };
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }
    }
    return null;
  });

  // Initialize user state from token
  const [user, setUser] = useState(() => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      try {
        return jwtDecode(accessToken);
      } catch (error) {
        console.error('Error decoding token for user:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
      }
    }
    return null;
  });

  // Login function
  const loginUser = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // Form validation
    if (!username || !password) {
      enqueueSnackbar('Please enter username and password!', {
        variant: 'error',
        autoHideDuration: 4000,
      });
      return;
    }

    try {
      console.log('Attempting login to:', axiosLog.defaults.baseURL + 'api/token/');

      // Make login request - Changed from 'token/' to 'api/token/'
      const res = await axiosLog.post('api/token/', {
        username: username,
        password: password,
      });

      console.log('Login successful:', res.data);

      // Store tokens
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      // Update axios instance headers
      axiosLog.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;

      // Update state
      setUser(jwtDecode(res.data.access));
      setAuthTokens(res.data);

      // Navigate to home
      navigate('/');

      // Show success message
      enqueueSnackbar('Login successful!', {
        variant: 'success',
        autoHideDuration: 2000,
      });

    } catch (error) {
      console.error('Login error:', error);

      // Clear form fields
      e.target.username.value = '';
      e.target.password.value = '';

      // Network errors (like ERR_FAILED)
      if (!error.response) {
        if (error.code === 'ERR_NETWORK') {
          enqueueSnackbar('Network error. Is the backend server running?', {
            variant: 'error',
            autoHideDuration: 4000,
          });
        } else {
          enqueueSnackbar(`Connection error: ${error.message || 'Unknown error'}`, {
            variant: 'error',
            autoHideDuration: 4000,
          });
        }
        return;
      }

      // Handle different error types
      if (error.response) {
        // Request made and server responded with error status
        if (error.response.status === 401) {
          enqueueSnackbar('Incorrect username or password!', {
            variant: 'error',
            autoHideDuration: 4000,
          });
        } else if (error.response.status === 400) {
          // Bad request - field validation errors
          const errorMsg = error.response.data?.detail ||
              'Invalid login request. Please check your credentials.';
          enqueueSnackbar(errorMsg, {
            variant: 'error',
            autoHideDuration: 4000,
          });
        } else if (error.response.status === 404) {
          // Not found - API endpoint not found
          enqueueSnackbar('Login service unavailable (404). Please check your API configuration.', {
            variant: 'error',
            autoHideDuration: 4000,
          });
          console.error('API endpoint not found. Check your backend configuration.');
        } else {
          // Other server errors
          enqueueSnackbar(`Server error (${error.response.status}). Please try again later.`, {
            variant: 'error',
            autoHideDuration: 4000,
          });
        }
      } else if (error.request) {
        // Request made but no response received
        enqueueSnackbar('No response from server. Please check your connection.', {
          variant: 'error',
          autoHideDuration: 4000,
        });
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        enqueueSnackbar('Login failed. Please try again.', {
          variant: 'error',
          autoHideDuration: 4000,
        });
        console.error('Error setting up request:', error.message);
      }
    }
  };

  // Logout function
  const logoutUser = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await axiosInstance.post('inventory/logout/blacklist/', {
          refresh_token: refreshToken,
        });
        console.log('Logout successful - token blacklisted');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Continue with logout regardless of blacklist success
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setAuthTokens(null);

      // Remove auth headers
      delete axiosInstance.defaults.headers['Authorization'];
      delete axiosLog.defaults.headers['Authorization'];

      // Navigate to login
      navigate('/login');

      // Show success message
      enqueueSnackbar('You have been logged out.', {
        variant: 'info',
        autoHideDuration: 2000,
      });
    }
  };

  // Context data to be provided
  const contextData = {
    user: user,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
      <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthWrapper;
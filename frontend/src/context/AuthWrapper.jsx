import React, { useState, useEffect } from 'react';
import { authService } from '../api/auth';

export const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          setIsAuthenticated(true);
          // Optionally, verify the token with the server
          // await authService.verifyToken();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(username, password);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
      <div>
        {children}
        <button onClick={logout}>Logout</button>
      </div>
  );
};

// Simple login form component
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin(username, password);
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <h2>Login to Inventlix</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div>
          <label htmlFor="username">Username:</label>
          <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
  );
};
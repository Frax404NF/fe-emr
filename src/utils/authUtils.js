// Auth utility functions and constants
import { createContext } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// Auth utility functions
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = userData => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const removeStoredUser = () => {
  localStorage.removeItem('user');
};

// Check if token is expired (basic JWT exp check)
export const isTokenExpired = token => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

// Get token expiry time
export const getTokenExpiryTime = token => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiry:', error);
    return null;
  }
};

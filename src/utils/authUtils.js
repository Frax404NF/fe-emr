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

// Check if token will expire soon (within 5 minutes)
export const isTokenExpiringSoon = token => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60; // 5 minutes buffer

    return payload.exp < currentTime + bufferTime;
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

// Validate user session
export const validateSession = user => {
  if (!user || !user.access_token) {
    return false;
  }

  return !isTokenExpired(user.access_token);
};

// Supabase-specific JWT helpers
export const getTokenExpiryWarning = token => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    if (timeUntilExpiry <= 0) {
      return { expired: true, message: 'Token has expired' };
    } else if (timeUntilExpiry < 300) { // 5 minutes
      return { 
        warning: true, 
        message: `Token expires in ${Math.floor(timeUntilExpiry / 60)} minutes`,
        minutesLeft: Math.floor(timeUntilExpiry / 60)
      };
    }
    
    return { valid: true, minutesLeft: Math.floor(timeUntilExpiry / 60) };
  } catch (error) {
    console.error('Error parsing token:', error);
    return { error: true, message: 'Invalid token format' };
  }
};

// Check if we should validate token (avoid unnecessary API calls)
export const shouldValidateToken = (token, lastValidated = null) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Validate if:
    // 1. Token expired
    // 2. Token expires within 5 minutes
    // 3. Haven't validated in the last 30 minutes
    if (timeUntilExpiry <= 0 || timeUntilExpiry < 300) {
      return true;
    }
    
    if (lastValidated) {
      const timeSinceValidation = currentTime - lastValidated;
      return timeSinceValidation > 1800; // 30 minutes
    }
    
    return false;
  } catch (error) {
    return true; // If we can't parse, validate it
  }
};

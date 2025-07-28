import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import {
  AuthContext,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  validateSession,
} from '../utils/authUtils';

/**
 * AuthProvider Component
 *
 * Provider component yang menyediakan authentication context untuk seluruh aplikasi.
 * Mengelola state user login, loading, dan menyediakan functions untuk auth operations.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components yang akan wrapped dengan AuthProvider
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle session expiry
  const handleSessionExpiry = useCallback((reason = 'Session expired') => {
    console.warn('Session expired:', reason);
    setCurrentUser(null);
    removeStoredUser();
    
    // Don't dispatch another sessionExpired event to avoid infinite loop
    // Components can listen to user state changes instead
  }, []);

  // Validate user session
  const validateUserSession = useCallback((user) => {
    if (!user || !user.access_token) {
      return false;
    }

    // Check if token is expired
    if (!validateSession(user)) {
      handleSessionExpiry('Token has expired');
      return false;
    }

    return true;
  }, [handleSessionExpiry]);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = getStoredUser();
        if (user && validateUserSession(user)) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeStoredUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [validateUserSession]);

  // Listen for session expiry events from axios interceptor
  useEffect(() => {
    const handleSessionExpiredEvent = (event) => {
      const { reason } = event.detail || {};
      handleSessionExpiry(reason || 'Session expired');
    };

    window.addEventListener('sessionExpired', handleSessionExpiredEvent);
    
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpiredEvent);
    };
  }, [handleSessionExpiry]);

  // Token validation on window focus (when user returns to tab)
  // Only needed for long-lived sessions, not frequent checks
  useEffect(() => {
    if (!currentUser) return;

    const handleVisibilityChange = () => {
      // Only check when tab becomes visible and user has been away for a while
      if (!document.hidden && currentUser) {
        // Check if token is close to expiry (within 5 minutes)
        // This avoids unnecessary API calls for recently validated tokens
        const token = currentUser.access_token;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            const timeUntilExpiry = payload.exp - currentTime;
            
            // Only validate if token expires within 5 minutes or already expired
            if (timeUntilExpiry < 300) { // 5 minutes = 300 seconds
              validateUserSession(currentUser);
            }
          } catch (error) {
            // If we can't parse token, validate it
            validateUserSession(currentUser);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, validateUserSession]);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setCurrentUser(userData);
    setStoredUser(userData);
    return userData;
  };

  const signup = async staffData => {
    const user = await authService.signup(staffData);
    return user;
  };

  const logout = async () => {
    try {
      if (currentUser) {
        await authService.logout(currentUser.access_token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      removeStoredUser();
      
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }
  };

  const value = {
    currentUser,
    loading,
    token: currentUser?.access_token, // Add token for easy access
    login,
    signup,
    logout,
    validateUserSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

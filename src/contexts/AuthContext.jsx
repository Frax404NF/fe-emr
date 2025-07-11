import { useState, useEffect } from 'react';
import authService from '../services/authService';
import {
  AuthContext,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
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

  useEffect(() => {
    // Cek apakah ada user di localStorage
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

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
      setCurrentUser(null);
      removeStoredUser();
      // Note: Navigation should be handled by the component calling logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

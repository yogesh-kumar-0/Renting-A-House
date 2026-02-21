import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flash, setFlash] = useState({ success: '', error: '' });

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.data.user);
      setFlash({ success: `Successfully logged in ${response.data.user.username}`, error: '' });
      return true;
    } catch (error) {
      setFlash({ success: '', error: error.response?.data?.message || 'Login failed' });
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      console.log('🚀 AuthContext: Starting signup with data:', userData);
      const response = await authAPI.signup(userData);
      console.log('✅ Signup response:', response.data);
      
      if (response.data.success) {
        setUser(response.data.user);
        setFlash({ success: response.data.message || 'Successfully signed up', error: '' });
        return true;
      } else {
        const errorMsg = response.data.message || response.data.error || 'Signup failed';
        console.log('❌ Response indicates failure:', errorMsg);
        setFlash({ success: '', error: errorMsg });
        return false;
      }
    } catch (error) {
      console.log('❌ Signup request failed!');
      console.log('Error response:', error.response?.data);
      console.log('Error message:', error.message);
      
      let errorMsg = 'Signup failed';
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
        if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMsg = error.response.data.errors.join(', ');
        }
      }
      
      console.log('Final error message:', errorMsg);
      setFlash({ success: '', error: errorMsg });
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setFlash({ success: 'Successfully logged out', error: '' });
      return true;
    } catch (error) {
      setFlash({ success: '', error: 'Logout failed' });
      return false;
    }
  };

  const clearFlash = () => {
    setFlash({ success: '', error: '' });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, flash, login, signup, logout, clearFlash }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

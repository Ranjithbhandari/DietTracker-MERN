import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { dispatchDataUpdate, dispatchUserUpdate } from '../utils/events';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Try to parse saved user first
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Verify token is still valid by fetching fresh user data
          const response = await api.get('/user/profile');
          if (response.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          // Clear invalid token/user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.name}! 🎉`);
      
      // Dispatch user update event
      dispatchUserUpdate();
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      toast.success(`Welcome to DietTracker, ${userData.name}! 🎉`);
      
      // Dispatch user update event
      dispatchUserUpdate();
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('fastingSession'); // Clear fasting data
    setUser(null);
    toast.success('Logged out successfully! 👋');
  };

  const updateUser = (userData) => {
    // Direct update of user state (used when we already have the updated user data)
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Dispatch events for real-time updates
    dispatchUserUpdate();
    dispatchDataUpdate();
    
    return { success: true, user: userData };
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatchUserUpdate();
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
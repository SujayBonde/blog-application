import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('token'));
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  useEffect(() => {
    // Validate session on load
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const { token: jwtToken, user: newUser } = res.data;
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(jwtToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

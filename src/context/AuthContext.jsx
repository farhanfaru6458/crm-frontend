import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("crm_user") ||
      sessionStorage.getItem("crm_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      if (response.data && response.data.token) {

        setUser(response.data.user);

        if (rememberMe) {
          localStorage.setItem("crm_user", JSON.stringify(response.data.user));
          localStorage.setItem("crm_token", response.data.token);
        } else {
          sessionStorage.setItem("crm_user", JSON.stringify(response.data.user));
          sessionStorage.setItem("crm_token", response.data.token);
        }

        return { success: true, user: response.data.user };
      }

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Invalid email or password"
      };
    }
  };

  const register = async (userData) => {
    try {
      const payload = {
        ...userData,
        companyName: userData.company
      };

      const response = await axios.post(`${API_URL}/register`, payload);

      return {
        success: true,
        userId: response.data.userId,
        message: response.data.message
      };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed"
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_token');
  };

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem('crm_token');
      const response = await axios.put(`${API_URL}/profile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('crm_user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Update user failed", error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

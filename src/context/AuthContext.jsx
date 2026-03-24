import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

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
      const response = await axiosInstance.post(`/auth/login`, { email, password });

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
      const data = error.response?.data;
      // If unverified, pass devOtp so OTP page can show it
      if (data?.devOtp) {
        return {
          success: false,
          error: data.message,
          devOtp: data.devOtp
        };
      }
      return {
        success: false,
        error: data?.message || "Invalid email or password"
      };
    }
  };

  const register = async (userData) => {
    try {
      const payload = {
        ...userData,
        companyName: userData.company
      };

      const response = await axiosInstance.post(`/auth/register`, payload);

      return {
        success: true,
        userId: response.data.userId,
        message: response.data.message,
        devOtp: response.data.devOtp // fallback when email fails
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
      const response = await axiosInstance.put(`/auth/profile`, updatedData);
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

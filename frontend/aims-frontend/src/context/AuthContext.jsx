import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import { useCart } from './CartContext';
import { jwtDecode } from 'jwt-decode'; // Import thư viện giải mã

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const { fetchCart, clearCart } = useCart();

  // Giữ nguyên logic useEffect của bạn để lấy user từ localStorage
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  // Hàm Đăng nhập được cập nhật
  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });

      // Giữ nguyên hoàn toàn logic lưu trữ của bạn
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);

      await fetchCart();

      // **CHỈ THÊM PHẦN NÀY**
      // Giải mã token để lấy vai trò và trả về cho LoginPage
      const decodedToken = jwtDecode(token);
      const roles = decodedToken.roles || [];

      return { success: true, roles: roles };

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return { success: false, message: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng." };
    }
  };

  // Giữ nguyên hàm register
  const register = async (username, password) => {
    try {
      await apiClient.post('/auth/register', { username, password, roles: ["USER"] });
      return { success: true };
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return { success: false, message: error.response?.data || "Tên đăng nhập đã tồn tại." };
    }
  };

  // Giữ nguyên hàm logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    clearCart();
  };

  const value = { user, token, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

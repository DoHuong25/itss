import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import { useCart } from './CartContext'; // Import useCart để tải lại giỏ hàng

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token')); // Lấy token từ localStorage khi tải
  const { fetchCart, clearCart } = useCart(); // Lấy thêm hàm clearCart

  // Tự động lấy thông tin user nếu có token
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Trong ứng dụng thực tế, bạn nên có một API /me để xác thực token và lấy lại thông tin user
    }
  }, [token]);

  // Hàm Đăng nhập
  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);

      await fetchCart(); // Tải lại giỏ hàng của người dùng vừa đăng nhập
      return { success: true };
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return { success: false, message: error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng." };
    }
  };

  // Hàm Đăng ký
  const register = async (username, password) => {
    try {
        await apiClient.post('/auth/register', { username, password, roles: ["USER"] });
        return { success: true };
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        return { success: false, message: error.response?.data || "Tên đăng nhập đã tồn tại." };
    }
  };

  // Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    clearCart(); // Xóa giỏ hàng khi đăng xuất
  };

  const value = { user, token, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Tạo custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};
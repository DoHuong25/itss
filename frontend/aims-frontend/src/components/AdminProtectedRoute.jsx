// src/components/AdminProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const userRoles = decodedToken.roles || [];

            // Kiểm tra xem token đã hết hạn chưa
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();

            // Nếu token chưa hết hạn VÀ người dùng có vai trò 'ROLE_ADMIN'
            if (!isTokenExpired && userRoles.includes('ROLE_ADMIN')) {
                return { isAuthenticated: true, isAdmin: true };
            }
        } catch (error) {
            console.error("Token không hợp lệ:", error);
            // Xóa token hỏng để tránh lỗi lặp lại
            localStorage.removeItem('token');
            return { isAuthenticated: false, isAdmin: false };
        }
    }
    // Không có token
    return { isAuthenticated: false, isAdmin: false };
};

const AdminProtectedRoute = () => {
    const { isAdmin } = useAuth();

    // Nếu không phải là admin, điều hướng về trang đăng nhập chung
    // Người dùng thường sẽ tự bị chặn và có thể đăng nhập lại
    return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminProtectedRoute;
// src/pages/admin/AdminLayout.jsx

import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const styles = {
    layout: { display: 'flex', minHeight: '100vh' },
    sidebar: {
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
    },
    sidebarHeader: { fontSize: '24px', textAlign: 'center', marginBottom: '30px' },
    navList: { listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 },
    navItem: { marginBottom: '10px' },
    navLink: { color: 'white', textDecoration: 'none', display: 'block', padding: '10px 15px', borderRadius: '4px' },
    logoutButton: {
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px'
    },
    mainContent: { flexGrow: 1, padding: '20px', backgroundColor: '#ecf0f1' }
};


const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login'); // Quay về trang đăng nhập chung
    };

    return (
        <div style={styles.layout}>
            <div style={styles.sidebar}>
                <h1 style={styles.sidebarHeader}>Admin Panel</h1>
                <ul style={styles.navList}>
                    <li style={styles.navItem}><Link to="/admin/dashboard/products" style={styles.navLink}>Quản lý Sản phẩm</Link></li>
                    <li style={styles.navItem}><Link to="/admin/dashboard/users" style={styles.navLink}>Quản lý Người dùng</Link></li>
                </ul>
                <button onClick={handleLogout} style={styles.logoutButton}>Đăng xuất</button>
            </div>
            <main style={styles.mainContent}>
                {/* Các trang quản lý sẽ được hiển thị ở đây */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
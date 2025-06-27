import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif'
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px 15px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
    },
    sidebarHeader: {
        fontSize: '22px',
        textAlign: 'center',
        marginBottom: '30px',
        fontWeight: 'bold'
    },
    navList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flexGrow: 1
    },
    navItem: { marginBottom: '10px' },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        padding: '10px 12px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    navLinkHover: {
        backgroundColor: '#34495e'
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: 'auto'
    },
    mainContent: {
        flexGrow: 1,
        backgroundColor: '#ecf0f1',
        padding: '30px',
        overflowY: 'auto'
    }
};

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={styles.layout}>
            <div style={styles.sidebar}>
                <h1 style={styles.sidebarHeader}>Admin Panel</h1>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/admin/dashboard/products" style={styles.navLink}>Quản lý Sản phẩm</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/admin/dashboard/users" style={styles.navLink}>Quản lý Người dùng</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/admin/dashboard/orders" style={styles.navLink}>Quản lý Đơn hàng</Link>
                    </li>
                </ul>
                <button onClick={handleLogout} style={styles.logoutButton}>Đăng xuất</button>
            </div>
            <main style={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

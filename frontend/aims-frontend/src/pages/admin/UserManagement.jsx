import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Tái sử dụng styles tương tự trang quản lý sản phẩm
const styles = {
    container: { fontFamily: 'Arial, sans-serif', margin: '20px' },
    header: { fontSize: '24px', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' },
    td: { border: '1px solid #ddd', padding: '8px' },
    roleBadge: {
        padding: '3px 8px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px'
    },
    adminBadge: { backgroundColor: '#28a745' },
    userBadge: { backgroundColor: '#6c757d' }
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) {
                setError('Bạn cần đăng nhập với quyền admin để xem trang này.');
                setLoading(false);
                return;
            }

            try {
                // Giả định backend có API /api/users để lấy toàn bộ người dùng
                const response = await axios.get('http://localhost:8080/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (err) {
                setError('Không thể tải danh sách người dùng. API có thể chưa tồn tại hoặc bạn không có quyền truy cập.');
                console.error('Lỗi khi fetch users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    if (loading) {
        return <div style={styles.container}>Đang tải danh sách người dùng...</div>;
    }

    if (error) {
        return <div style={{ ...styles.container, color: 'red' }}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Quản lý Người dùng</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Tên đăng nhập (Username)</th>
                        <th style={styles.th}>Vai trò (Roles)</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={styles.td}>{user.id}</td>
                            <td style={styles.td}>{user.username}</td>
                            <td style={styles.td}>
                                {user.roles.map(role => (
                                    <span
                                        key={role}
                                        style={{
                                            ...styles.roleBadge,
                                            ...(role === 'ROLE_ADMIN' ? styles.adminBadge : styles.userBadge)
                                        }}
                                    >
                                        {role.replace('ROLE_', '')}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
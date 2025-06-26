import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

// --- CSS Styles (đã được điều chỉnh cho giao diện mới) ---
const styles = {
    container: { fontFamily: 'Arial, sans-serif', margin: '20px' },
    header: { fontSize: '24px', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' },
    td: { border: '1px solid #ddd', padding: '12px', verticalAlign: 'middle' },
    statusBadge: {
        padding: '5px 10px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
        textAlign: 'center'
    },
    activeStatus: { backgroundColor: '#28a745' }, // Green for Active
    disabledStatus: { backgroundColor: '#dc3545' }, // Red for Disabled
    roleBadge: {
        padding: '4px 10px', borderRadius: '12px', color: 'white',
        fontWeight: 'bold', fontSize: '12px', marginRight: '5px'
    },
    adminBadge: { backgroundColor: '#17a2b8' }, // Info blue for Admin
    userBadge: { backgroundColor: '#6c757d' }, // Gray for User
    actions: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    button: {
        padding: '6px 12px', border: 'none', borderRadius: '4px',
        cursor: 'pointer', fontWeight: 'bold'
    },
    // Modal styles
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modalContent: {
        background: 'white', padding: '25px', borderRadius: '8px',
        width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
    },
    modalHeader: { fontSize: '20px', marginBottom: '20px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }
};

// --- Component RolesModal ---
const RolesModal = ({ user, onSave, onCancel }) => {
    // Chỉ lấy tên vai trò, bỏ "ROLE_"
    const [selectedRoles, setSelectedRoles] = useState(
        user.roles.map(r => r.replace('ROLE_', ''))
    );

    const handleRoleChange = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleSubmit = () => {
        onSave(user.id, selectedRoles);
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2 style={styles.modalHeader}>Cập nhật vai trò cho {user.username}</h2>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Chọn vai trò:</label>
                    {['USER', 'ADMIN'].map(role => (
                        <label key={role} style={{ marginRight: '20px', fontWeight: 'normal' }}>
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(role)}
                                onChange={() => handleRoleChange(role)}
                                style={{ marginRight: '5px' }}
                            />
                            {role}
                        </label>
                    ))}
                </div>
                <div style={styles.modalActions}>
                    <button onClick={onCancel} style={{ ...styles.button, backgroundColor: '#6c757d', color: 'white' }}>Hủy</button>
                    <button onClick={handleSubmit} style={{ ...styles.button, backgroundColor: '#007bff', color: 'white' }}>Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};


// --- Component chính: UserManagement ---
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // User để cập nhật vai trò

    // Hàm gọi API để lấy danh sách người dùng
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/admin/users');
            // Backend trả về UserDto, ta giả định nó có trường 'enabled'
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách người dùng. Bạn có thể không có quyền truy cập.');
            console.error('Lỗi khi fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Xử lý bật/tắt tài khoản
    const handleToggleUserStatus = async (user) => {
        const action = user.enabled ? 'vô hiệu hóa' : 'kích hoạt';
        if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản "${user.username}" không?`)) {
            try {
                const endpoint = user.enabled ? `/admin/users/${user.id}/disable` : `/admin/users/${user.id}/enable`;
                await apiClient.put(endpoint);
                fetchUsers(); // Tải lại danh sách để cập nhật trạng thái
            } catch (err) {
                alert(`Lỗi khi ${action} người dùng!`);
                console.error(err);
            }
        }
    };

    // Xử lý reset mật khẩu
    const handleResetPassword = async (userId, username) => {
        if (window.confirm(`Bạn có chắc chắn muốn đặt lại mật khẩu cho "${username}" không?`)) {
            try {
                await apiClient.put(`/admin/users/${userId}/reset-password`);
                alert(`Mật khẩu cho "${username}" đã được đặt lại về mặc định.`);
                fetchUsers();
            } catch (err) {
                alert('Lỗi khi đặt lại mật khẩu!');
                console.error(err);
            }
        }
    };

    // Mở modal để cập nhật vai trò
    const handleOpenRolesModal = (user) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    // Xử lý lưu vai trò mới
    const handleUpdateRoles = async (userId, roles) => {
        try {
            await apiClient.put(`/admin/users/${userId}/roles`, roles);
            setIsModalOpen(false);
            fetchUsers(); // Tải lại danh sách
        } catch (err) {
            alert('Lỗi khi cập nhật vai trò!');
            console.error(err);
        }
    };


    if (loading) return <div style={styles.container}>Đang tải...</div>;
    if (error) return <div style={{ ...styles.container, color: 'red' }}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Quản lý Người dùng</h1>

            {isModalOpen && (
                <RolesModal
                    user={currentUser}
                    onSave={handleUpdateRoles}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Tên đăng nhập</th>
                        <th style={styles.th}>Vai trò</th>
                        <th style={styles.th}>Trạng thái</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={styles.td}>{user.id}</td>
                            <td style={styles.td}>{user.username}</td>
                            <td style={styles.td}>
                                {user.roles?.map(role => (
                                    <span key={role} style={{
                                        ...styles.roleBadge,
                                        ...(role.includes('ADMIN') ? styles.adminBadge : styles.userBadge)
                                    }}>
                                        {role.replace('ROLE_', '')}
                                    </span>
                                ))}
                            </td>
                            <td style={styles.td}>
                                <span style={{
                                    ...styles.statusBadge,
                                    ...(user.enabled ? styles.activeStatus : styles.disabledStatus)
                                }}>
                                    {user.enabled ? 'Kích hoạt' : 'Vô hiệu hóa'}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <div style={styles.actions}>
                                    <button
                                        onClick={() => handleToggleUserStatus(user)}
                                        style={{ ...styles.button, backgroundColor: user.enabled ? '#ffc107' : '#28a745', color: user.enabled ? 'black' : 'white' }}
                                    >
                                        {user.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                    </button>
                                    <button
                                        onClick={() => handleOpenRolesModal(user)}
                                        style={{ ...styles.button, backgroundColor: '#17a2b8', color: 'white' }}
                                    >
                                        Sửa vai trò
                                    </button>
                                    <button
                                        onClick={() => handleResetPassword(user.id, user.username)}
                                        style={{ ...styles.button, backgroundColor: '#6c757d', color: 'white' }}
                                    >
                                        Reset mật khẩu
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
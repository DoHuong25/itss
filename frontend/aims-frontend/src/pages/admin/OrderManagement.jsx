// frontend/aims-frontend/src/pages/admin/OrderManagement.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

// --- CSS Styles ---
const styles = {
    container: { fontFamily: 'Arial, sans-serif', margin: '20px' },
    header: { fontSize: '24px', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' },
    td: { border: '1px solid #ddd', padding: '12px', verticalAlign: 'middle' },
    select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    button: {
        padding: '8px 12px', border: 'none', borderRadius: '4px',
        cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#007bff', color: 'white'
    },
    statusBadge: {
        padding: '5px 12px', borderRadius: '15px', color: 'white',
        fontWeight: 'bold', fontSize: '12px', textTransform: 'capitalize'
    },
};

// Hàm để lấy màu sắc dựa trên trạng thái
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return '#ffc107'; // Vàng
        case 'success': // Coi SUCCESS giống như PROCESSING
        case 'processing': return '#17a2b8'; // Xanh dương
        case 'shipped': return '#007bff'; // Xanh dương đậm
        case 'delivered': return '#28a745'; // Xanh lá
        case 'cancelled': return '#dc3545'; // Đỏ
        default: return '#6c757d'; // Xám
    }
};

// Hàm để hiển thị tên trạng thái thân thiện hơn
const getDisplayStatus = (status) => {
    if (status?.toLowerCase() === 'success') {
        return 'PROCESSING'; // Hiển thị SUCCESS thành PROCESSING
    }
    return status;
}

// --- Component chính: OrderManagement ---
const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusChanges, setStatusChanges] = useState({});

    const orderStatuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/orders');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách đơn hàng. Bạn có thể không có quyền.');
            console.error('Lỗi khi fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        setStatusChanges(prev => ({
            ...prev,
            [orderId]: newStatus
        }));
    };

    const handleUpdateStatus = async (orderId) => {
        const newStatus = statusChanges[orderId];
        if (!newStatus) {
            alert("Vui lòng chọn một trạng thái mới.");
            return;
        }

        if (window.confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng #${orderId} thành ${newStatus}?`)) {
            try {
                await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
                alert("Cập nhật trạng thái thành công!");
                fetchOrders();
                setStatusChanges(prev => {
                    const newChanges = { ...prev };
                    delete newChanges[orderId];
                    return newChanges;
                });
            } catch (err) {
                alert("Cập nhật trạng thái thất bại!");
                console.error("Lỗi khi cập nhật status:", err);
            }
        }
    };

    if (loading) return <div style={styles.container}>Đang tải danh sách đơn hàng...</div>;
    if (error) return <div style={{ ...styles.container, color: 'red' }}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Quản lý Đơn hàng</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID Đơn hàng</th>
                        <th style={styles.th}>ID Khách hàng</th>
                        <th style={styles.th}>Ngày đặt</th>
                        <th style={styles.th}>Tổng tiền</th>
                        <th style={styles.th}>Trạng thái hiện tại</th>
                        <th style={styles.th}>Cập nhật trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td style={styles.td}>#{order.id}</td>
                            <td style={styles.td}>{order.userId}</td>
                            <td style={styles.td}>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                            {/* --- ĐÂY LÀ DÒNG ĐÃ SỬA LỖI --- */}
                            <td style={styles.td}>{(order.totalPrice || 0).toLocaleString('vi-VN')} VNĐ</td>
                            <td style={styles.td}>
                                <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(order.status) }}>
                                    {getDisplayStatus(order.status)}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        style={styles.select}
                                        value={statusChanges[order.id] || ''}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="" disabled>Chọn trạng thái</option>
                                        {orderStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <button
                                        style={styles.button}
                                        onClick={() => handleUpdateStatus(order.id)}
                                        disabled={!statusChanges[order.id]}
                                    >
                                        Cập nhật
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

export default OrderManagement;
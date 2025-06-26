import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductDetailModal from '../components/ProductDetailModal'; 

// Import ảnh
import nhaGiaKimImg from '../assets/images/nha-gia-kim.jpg';
import dacNhanTamImg from '../assets/images/dac-nhan-tam.jpg';
import abbaGoldImg from '../assets/images/abba-gold.png';
import notFoundImg from '../assets/images/image-not-found.jpg';

const productImages = {
  "nha-gia-kim.jpg": nhaGiaKimImg,
  "dac-nhan-tam.jpg": dacNhanTamImg,
  "abba-gold.png": abbaGoldImg
};

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    // --- STATE MỚI ĐỂ QUẢN LÝ MODAL CHI TIẾT SẢN PHẨM ---
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailModalLoading, setIsDetailModalLoading] = useState(false);
    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await apiClient.get('/orders');
            setOrders(response.data);
        } catch (err) {
            setError('Không thể tải lịch sử đơn hàng.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    // --- HÀM MỚI ĐỂ XỬ LÝ TRẢ HÀNG ---
    const handleReturnRequest = async (orderId, itemId) => {
        if (!window.confirm("Bạn có chắc chắn muốn yêu cầu trả lại sản phẩm này?")) {
            return;
        }
        try {
            const response = await apiClient.post(`/orders/${orderId}/items/${itemId}/return`);
            alert(response.data); // Hiển thị thông báo thành công từ backend
            fetchOrders(); // Tải lại danh sách đơn hàng để cập nhật trạng thái
        } catch (err) {
            console.error("Lỗi khi yêu cầu trả hàng:", err);
            alert(err.response?.data || "Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };
const handleViewDetails = async (productId) => {
        setIsDetailModalLoading(true);
        try {
            const response = await apiClient.get(`/products/${productId}`);
            setSelectedProduct(response.data);
        } catch (error) {
            console.error("Không thể tải chi tiết sản phẩm:", error);
            alert("Lỗi, không thể xem chi tiết sản phẩm.");
        } finally {
            setIsDetailModalLoading(false);
        }
    };

    const handleCloseDetailModal = () => {
        setSelectedProduct(null);
    }

    if (loading) return <p>Đang tải lịch sử mua hàng...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (orders.length === 0) return <h2>Bạn chưa có đơn hàng nào.</h2>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Lịch sử mua hàng</h2>
            {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                        <div>
                            <strong>Mã đơn hàng:</strong> #{order.id}
                        </div>
                        <div>
                            <strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div>
                            <strong>Trạng thái:</strong> <span style={{ color: order.status === 'SUCCESS' ? 'green' : 'red' }}>{order.status}</span>
                        </div>
                        <div>
                            <strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString('vi-VN')} VND
                        </div>
                    </div>
                    <div>
                        {order.items.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
                                <img src={productImages[item.imageUrl] || notFoundImg} alt={item.productTitle} style={{ width: '60px', height: '60px', marginRight: '15px', borderRadius: '4px' }}/>
                                <div style={{ flexGrow: 1 }}>
                                    <span 
                                        onClick={() => handleViewDetails(item.productId)}
                                        style={{ cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
                                    >
                                        {item.productTitle}
                                    </span>
                                  <br/>
                                    <small>Trạng thái: {item.status}</small>
                                </div>
                                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                                    {item.price.toLocaleString('vi-VN')} VND
                                </div>
                                <div style={{ minWidth: '80px', textAlign: 'center' }}>
                                    x {item.quantity}
                                </div>
                                <div style={{ minWidth: '120px', textAlign: 'right' }}>
                                    {/* --- NÚT TRẢ HÀNG --- */}
                                    {order.status === 'SUCCESS' && item.status === 'DELIVERED' && (
                                        <button 
                                            onClick={() => handleReturnRequest(order.id, item.id)}
                                            style={{fontSize: '0.8em', padding: '4px 8px'}}
                                        >
                                            Trả hàng
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrderHistoryPage;


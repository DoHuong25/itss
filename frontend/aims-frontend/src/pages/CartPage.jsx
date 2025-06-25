import React, { useState } from 'react'; // Thêm useState
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';
import ProductDetailModal from '../components/ProductDetailModal'; // Import Modal

function CartPage() {
  const { cart, loading, updateItemQuantity, removeItemFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- PHẦN MỚI: State để quản lý Modal ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  if (!user) {
    return <p>Vui lòng <a href="/login">đăng nhập</a> để xem giỏ hàng.</p>;
  }
  if (loading) {
    return <p>Đang tải giỏ hàng...</p>;
  }
  if (!cart || cart.items.length === 0) {
    return <h2>Giỏ hàng của bạn đang trống.</h2>;
  }

  // --- HÀM MỚI: Xử lý khi click xem chi tiết ---
  const handleViewDetails = async (productId) => {
    setIsModalLoading(true);
    try {
      // Gọi API để lấy thông tin chi tiết của sản phẩm
      const response = await apiClient.get(`/products/${productId}`);
      setSelectedProduct(response.data);
    } catch (error) {
      console.error("Không thể tải chi tiết sản phẩm:", error);
      alert("Lỗi, không thể xem chi tiết sản phẩm.");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = async () => {
    try {
        const response = await apiClient.post('/payment/create-payment');
        window.location.href = response.data.paymentUrl;
    } catch (error) {
        console.error("Lỗi khi tạo thanh toán:", error);
        alert("Có lỗi xảy ra khi tiến hành thanh toán.");
    }
  };

  return (
    <div>
      <h2>Giỏ hàng của bạn</h2>
      {cart.items.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
          <div>
            {/* Làm cho tiêu đề có thể click được */}
            <h4 
              onClick={() => handleViewDetails(item.productId)} 
              style={{ cursor: 'pointer', color: '#007bff' }}
            >
              {item.productTitle}
            </h4>
            <p>{item.productPrice.toLocaleString('vi-VN')} VND</p>
          </div>
          <div>
            <span>Số lượng: </span>
            <input 
              type="number" 
              value={item.quantity} 
              onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10))}
              min="1"
              style={{ width: '50px', marginRight: '1rem' }}
            />
            <button onClick={() => removeItemFromCart(item.id)} style={{ color: 'red' }}>Xóa</button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <h3>Tổng cộng: {cart.totalPrice.toLocaleString('vi-VN')} VND</h3>
        <button onClick={handleCheckout} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Tiến hành Thanh toán
        </button>
      </div>

      {/* --- PHẦN MỚI: Hiển thị Modal --- */}
      {isModalLoading && <p>Đang tải chi tiết...</p>}
      <ProductDetailModal 
        product={selectedProduct} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default CartPage;
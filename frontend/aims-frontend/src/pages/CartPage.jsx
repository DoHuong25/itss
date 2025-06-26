import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import ProductDetailModal from '../components/ProductDetailModal';

// --- Import ảnh ---
import nhaGiaKimImg from '../assets/images/nha-gia-kim.jpg';
import dacNhanTamImg from '../assets/images/dac-nhan-tam.jpg';
import abbaGoldImg from '../assets/images/abba-gold.png';
import notFoundImg from '../assets/images/image-not-found.jpg';

const productImages = {
  "nha-gia-kim.jpg": nhaGiaKimImg,
  "dac-nhan-tam.jpg": dacNhanTamImg,
  "abba-gold.png": abbaGoldImg
};

// --- Modal nhập thông tin ---
const ShippingInfoModal = ({ isOpen, onClose, onSubmit }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('VNBANK');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!customerName || !customerPhone || !shippingAddress) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng.');
            return;
        }
        onSubmit({ customerName, customerPhone, shippingAddress, paymentMethod });
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>Thông tin nhận hàng</h3>
                <form onSubmit={handleSubmit}>
                    <div style={formGroupStyle}>
                        <label>Họ và tên:</label>
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={formGroupStyle}>
                        <label>Số điện thoại:</label>
                        <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={formGroupStyle}>
                        <label>Địa chỉ nhận hàng:</label>
                        <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={formGroupStyle}>
                        <label>Phương thức thanh toán:</label>
                        <div>
                            <input type="radio" id="vnbank" name="paymentMethod" value="VNBANK" checked={paymentMethod === 'VNBANK'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <label htmlFor="vnbank" style={{ marginLeft: '5px' }}>Thẻ ATM/Tài khoản nội địa</label>
                        </div>
                        <div>
                            <input type="radio" id="intcard" name="paymentMethod" value="INTCARD" checked={paymentMethod === 'INTCARD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <label htmlFor="intcard" style={{ marginLeft: '5px' }}>Thẻ quốc tế (Visa, Master, JCB)</label>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <button type="button" onClick={onClose} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>Hủy</button>
                        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Xác nhận và Thanh toán</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Component CartPage chính ---
function CartPage() {
    const { cart, loading, updateItemQuantity, removeItemFromCart } = useCart();
    const { user } = useAuth();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectItem = (itemId) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(itemId)
                ? prevSelected.filter(id => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const selectedTotalPrice = useMemo(() => {
        if (!cart || !cart.items) return 0;
        return cart.items
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + item.productPrice * item.quantity, 0);
    }, [cart, selectedItems]);

    const handleOpenShippingModal = () => {
        if (selectedItems.length === 0) {
            alert("Bạn vui lòng chọn ít nhất một sản phẩm để thanh toán.");
            return;
        }
        setIsShippingModalOpen(true);
    };

    const handleProcessPayment = async (shippingData) => {
        setIsShippingModalOpen(false);
        try {
            const response = await apiClient.post('/payment/create-payment', {
                ...shippingData,
                cartItemIds: selectedItems 
            });

            const paymentUrl = response.data.paymentUrl || response.data;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                alert("Không nhận được URL thanh toán từ máy chủ.");
            }
        } catch (error) {
            console.error("Lỗi chi tiết khi tạo thanh toán:", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tiến hành thanh toán.";
            alert(errorMessage);
        }
    };

    if (!user) return <p>Vui lòng <a href="/login">đăng nhập</a> để xem giỏ hàng.</p>;
    if (loading) return <p>Đang tải giỏ hàng...</p>;
    if (!cart || !cart.items || cart.items.length === 0) return <h2>Giỏ hàng của bạn đang trống.</h2>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Giỏ hàng của bạn</h2>
            {cart.items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        style={{ marginRight: '15px', transform: 'scale(1.5)' }}
                    />
                    <img src={productImages[item.imageUrl] || notFoundImg} alt={item.productTitle} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px', borderRadius: '8px' }} />
                    <div style={{ flexGrow: 1 }}>
                        <h4 onClick={() => { /* Bạn có thể thêm lại logic mở modal chi tiết ở đây nếu muốn */ }} style={{ cursor: 'pointer', color: '#007bff', margin: 0, marginBottom: '5px' }}>{item.productTitle}</h4>
                        <p style={{ margin: 0 }}>{item.productPrice.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Số lượng: </span>
                        <input type="number" value={item.quantity} onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10))} min="1" style={{ width: '60px', margin: '0 1rem', textAlign: 'center' }} />
                        <button onClick={() => removeItemFromCart(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                    </div>
                </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <h3>Tổng cộng đã chọn: {selectedTotalPrice.toLocaleString('vi-VN')} VND</h3>
                <button
                    onClick={handleOpenShippingModal}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    disabled={selectedItems.length === 0}
                >
                    Thanh toán ({selectedItems.length} mục)
                </button>
            </div>

            <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            <ShippingInfoModal isOpen={isShippingModalOpen} onClose={() => setIsShippingModalOpen(false)} onSubmit={handleProcessPayment} />
        </div>
    );
}

export default CartPage;

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '20px 30px', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' };
const formGroupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

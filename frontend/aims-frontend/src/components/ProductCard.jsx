import React from 'react';
import { useCart } from '../context/CartContext'; // Import useCart hook

// CSS Styles
const cardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  margin: '0.5rem', // Giảm margin để các card gần nhau hơn
  width: '250px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  cursor: 'pointer' // Thêm con trỏ để người dùng biết có thể click
};

const buttonStyles = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem'
};

// Component nhận vào product, imageSrc (ảnh đã import), và onCardClick (hàm mở modal)
function ProductCard({ product, imageSrc, onCardClick }) {
  // Lấy hàm addToCart từ CartContext
  const { addToCart } = useCart();

  // Hàm xử lý khi click nút "Thêm vào giỏ"
  const handleAddToCart = (e) => {
    // Ngăn sự kiện click này lan ra thẻ div cha, tránh việc mở modal
    e.stopPropagation(); 
    
    // Gọi hàm addToCart từ context, mặc định thêm 1 sản phẩm
    addToCart(product.id, 1); 
  };

  return (
    // Thẻ div cha vẫn giữ sự kiện onClick để mở modal
    <div style={cardStyles} onClick={() => onCardClick(product)}>
      <img src={imageSrc} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>{product.title}</h3>
      <p style={{ margin: '0 0 0.5rem 0', color: '#555' }}>{product.category}</p>
      <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price.toLocaleString('vi-VN')} VND</p>
      
      {/* Nút "Thêm vào giỏ" có sự kiện onClick riêng */}
      <button style={buttonStyles} onClick={handleAddToCart}>
        Thêm vào giỏ
      </button>
    </div>
  );
}

export default ProductCard;
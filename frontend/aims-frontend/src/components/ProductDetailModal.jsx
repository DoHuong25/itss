import React from 'react';
import { useCart } from '../context/CartContext';

// --- CSS Styles Đã Được Cập Nhật ---
const modalOverlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles = {
  position: 'relative',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  maxWidth: '800px',
  width: '90%',
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-start', // Căn các item từ trên xuống
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '30px',
  height: '30px',
  fontSize: '1rem',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: '#f1f1f1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const imageContainerStyles = {
  flex: '1 1 300px',
  maxWidth: '300px'
};

const imageStyles = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
};

const infoContainerStyles = {
    flex: '2 1 400px',
    display: 'flex',
    flexDirection: 'column',
};

const buttonStyles = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
    fontSize: '1rem',
    alignSelf: 'flex-start' // Nút không chiếm hết chiều rộng
};

// --- Component hiển thị thông tin chi tiết riêng của sách ---
const BookDetails = ({ product }) => (
  <>
    <p><strong>Tác giả:</strong> {product.authors || 'Chưa có thông tin'}</p>
    <p><strong>Nhà xuất bản:</strong> {product.publisher || 'Chưa có thông tin'}</p>
    <p><strong>Ngày xuất bản:</strong> {product.publicationDate || 'Chưa có thông tin'}</p>
    <p><strong>Số trang:</strong> {product.numberOfPages || 'Chưa có thông tin'}</p>
  </>
);

// --- Component hiển thị thông tin chi tiết riêng của CD ---
const CdDetails = ({ product }) => (
  <>
    <p><strong>Nghệ sĩ:</strong> {product.artist || 'Chưa có thông tin'}</p>
    <p><strong>Hãng đĩa:</strong> {product.recordLabel || 'Chưa có thông tin'}</p>
    <p><strong>Ngày phát hành:</strong> {product.releaseDate || 'Chưa có thông tin'}</p>
  </>
);


function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  if (!product) return null;
  const imageSrc = product.imageUrl ? `/src/assets/images/${product.imageUrl}` : 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg';

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    onClose();
  };

  const renderSpecificDetails = () => {
    switch (product.category) {
      case "Sách":
      case "Tiểu thuyết":
      case "Sách kỹ năng":
        return <BookDetails product={product} />;
      case "Âm nhạc":
        return <CdDetails product={product} />;
      default:
        return null;
    }
  }

  return (
    <div style={modalOverlayStyles} onClick={onClose}>
      <div style={modalContentStyles} onClick={e => e.stopPropagation()}>
        <button style={closeButtonStyles} onClick={onClose}>X</button>
        
        <div style={imageContainerStyles}>
          <img src={imageSrc} alt={product.title} style={imageStyles} />
        </div>
        
        <div style={infoContainerStyles}>
          <h1>{product.title}</h1>
          <p style={{color: '#777', fontStyle: 'italic'}}>{product.category}</p>
          <hr style={{margin: '1rem 0'}} />
          
          {renderSpecificDetails()}

          <p><strong>Mô tả:</strong> {product.description || 'Chưa có thông tin.'}</p>
          <p><strong>Số lượng còn lại:</strong> {product.quantity}</p>
          
          <h2 style={{color: '#c92121', marginTop: 'auto'}}>{product.price.toLocaleString('vi-VN')} VND</h2>
          
          <button style={buttonStyles} onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
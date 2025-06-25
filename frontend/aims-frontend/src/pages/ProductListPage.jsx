import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

// Import ảnh (giữ nguyên)
import nhaGiaKimImg from '../assets/images/nha-gia-kim.jpg';
import dacNhanTamImg from '../assets/images/dac-nhan-tam.jpg';
import abbaGoldImg from '../assets/images/abba-gold.png';
import notFoundImg from '../assets/images/image-not-found.jpg';

const productImages = {
  "nha-gia-kim.jpg": nhaGiaKimImg,
  "dac-nhan-tam.jpg": dacNhanTamImg,
  "abba-gold.png": abbaGoldImg
};

// --- SỬA LẠI CSS Ở ĐÂY ---
const productGridStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start', // Đổi từ 'center' thành 'flex-start'
  gap: '1rem'
};

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- SỬA LẠI LOGIC GỌI API Ở ĐÂY ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Dùng Promise.all để gọi nhiều API cùng lúc
        const [booksResponse, cdsResponse] = await Promise.all([
          apiClient.get('/books'),
          apiClient.get('/cds')
          // Thêm các lời gọi API cho DVD, LP ở đây trong tương lai
        ]);
        
        // Gộp kết quả từ các API lại thành một danh sách duy nhất
        const allProducts = [...booksResponse.data, ...cdsResponse.data];
        setProducts(allProducts);

      } catch (err) {
        setError("Không thể tải dữ liệu từ máy chủ.");
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Mảng rỗng đảm bảo chỉ gọi 1 lần

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  return (
    <div>
      <h2>Tất cả Sản phẩm</h2>
      {products.length > 0 ? (
        <div style={productGridStyles}>
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              imageSrc={productImages[product.imageUrl] || notFoundImg}
              onCardClick={handleOpenModal} 
            />
          ))}
        </div>
      ) : (
        <p>Không có sản phẩm nào để hiển thị.</p>
      )}

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default ProductListPage;
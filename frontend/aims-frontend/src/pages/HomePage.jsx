import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import ProductCard from '../components/ProductCard';
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

const productGridStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  gap: '1rem'
};

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        // Gọi đến API mới để lấy 4 sản phẩm bán chạy nhất
        const response = await apiClient.get('/products/bestsellers');
        setProducts(response.data);
      } catch (err) {
        setError("Không thể tải sản phẩm nổi bật.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sản phẩm Bán chạy nhất</h2>
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
        <p>Chưa có sản phẩm nào bán chạy.</p>
      )}

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default HomePage;
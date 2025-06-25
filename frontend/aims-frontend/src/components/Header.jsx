import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`);
    }
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <nav>
        <Link to="/" style={{ marginRight: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>AIMS</Link>
        <Link to="/products" style={{ marginRight: '1rem' }}>Sản phẩm</Link>
      </nav>

      <form onSubmit={handleSearch} style={{ display: 'flex' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..." 
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Tìm</button>
      </form>

      <nav>
        <Link to="/cart" style={{ marginRight: '1rem' }}>
          Giỏ hàng ({cartItemCount})
        </Link>
        
        {/* === THAY ĐỔI Ở ĐÂY === */}
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Chào, {user.username}</span>
            <button onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Đăng Nhập</Link>
            <Link to="/register">Đăng Ký</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
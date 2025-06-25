import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('token');

  const fetchCart = async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await apiClient.get('/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(response.data);
      } catch (error) {
        console.error("Không thể tải giỏ hàng:", error);
        setCart(null); 
      } finally {
        setLoading(false);
      }
    } else {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    const token = getToken();
    if (!token) {
        alert("Vui lòng đăng nhập để thêm sản phẩm!");
        return;
    }
    try {
        const response = await apiClient.post('/cart/items', 
            { productId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(response.data);
        alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra, không thể thêm sản phẩm.");
    }
  };

  // --- HÀM MỚI ---
  const updateItemQuantity = async (cartItemId, quantity) => {
    const token = getToken();
    if (!token) return;
    try {
        const response = await apiClient.put(`/cart/items/${cartItemId}?quantity=${quantity}`, 
            {}, // Body rỗng cho PUT request
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart(response.data);
    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  // --- HÀM MỚI ---
  const removeItemFromCart = async (cartItemId) => {
    const token = getToken();
    if (!token) return;
    try {
        const response = await apiClient.delete(`/cart/items/${cartItemId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCart(response.data);
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const clearCart = () => {
    setCart(null);
  }

  const value = { cart, loading, addToCart, fetchCart, clearCart, updateItemQuantity, removeItemFromCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
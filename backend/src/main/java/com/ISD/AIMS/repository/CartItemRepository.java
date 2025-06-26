package com.ISD.AIMS.repository;

import com.ISD.AIMS.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // <-- Thêm import này

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // --- THÊM DÒNG NÀY VÀO ---
    // Khai báo phương thức để Spring Data JPA tự động tạo câu lệnh
    // tìm một CartItem dựa trên cartId VÀ productId.
    // Sử dụng Optional để xử lý trường hợp không tìm thấy một cách an toàn.
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
}
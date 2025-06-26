package com.ISD.AIMS.repository;

import com.ISD.AIMS.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByVnpTxnRef(String vnpTxnRef);

    // --- THÊM PHƯƠNG THỨC NÀY VÀO ---
    // Tìm tất cả các đơn hàng của một user, sắp xếp theo ngày đặt hàng mới nhất
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}
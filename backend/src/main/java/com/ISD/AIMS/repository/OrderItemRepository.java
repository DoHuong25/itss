package com.ISD.AIMS.repository;

import com.ISD.AIMS.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * [MỚI] Xóa tất cả các order_item liên quan đến một productId.
     * @param productId ID của sản phẩm cần xóa khỏi tất cả đơn hàng.
     */
    @Modifying
    @Query("DELETE FROM OrderItem oi WHERE oi.product.id = ?1")
    void deleteByProductId(Long productId);
}

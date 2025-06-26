package com.ISD.AIMS.repository;

import com.ISD.AIMS.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    /**
     * [MỚI] Xóa tất cả các cart_item liên quan đến một productId.
     * @param productId ID của sản phẩm cần xóa khỏi tất cả giỏ hàng.
     */
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.product.id = ?1")
    void deleteByProductId(Long productId);
}

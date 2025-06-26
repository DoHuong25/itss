package com.ISD.AIMS.controller;

import com.ISD.AIMS.model.Product;
import com.ISD.AIMS.repository.CartItemRepository;
import com.ISD.AIMS.repository.OrderItemRepository;
import com.ISD.AIMS.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // API mới để lấy sản phẩm bán chạy
    @GetMapping("/bestsellers")
    public List<Product> getBestSellers() {
        return productRepository.findTop4ByOrderBySalesCountDesc();
    }

    // [THÊM MỚI] Inject các repository cần thiết cho việc xóa
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * [SỬA LỖI] Cập nhật lại logic xóa sản phẩm.
     * @param id ID của sản phẩm cần xóa.
     * @return Phản hồi HTTP.
     */
    @DeleteMapping("/{id}")
    @Transactional // Đảm bảo tất cả các thao tác xóa đều thành công hoặc thất bại cùng nhau
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        // Bước 1: Xóa các tham chiếu trong order_items
        orderItemRepository.deleteByProductId(id);

        // Bước 2: Xóa các tham chiếu trong cart_items
        cartItemRepository.deleteByProductId(id);

        // Bước 3: Bây giờ mới xóa sản phẩm chính
        productRepository.deleteById(id);
        
        return ResponseEntity.noContent().build();
    }
}

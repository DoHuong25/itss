package com.ISD.AIMS.controller;

import com.ISD.AIMS.model.Product;
import com.ISD.AIMS.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
}

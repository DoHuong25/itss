package com.ISD.AIMS.repository;

import com.ISD.AIMS.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm 4 sản phẩm có salesCount cao nhất, sắp xếp giảm dần
    List<Product> findTop4ByOrderBySalesCountDesc();
}
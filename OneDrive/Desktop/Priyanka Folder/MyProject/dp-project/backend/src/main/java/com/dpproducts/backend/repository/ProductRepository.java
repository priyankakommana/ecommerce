package com.dpproducts.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dpproducts.backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Filter out rows by specific Category Tab ID clicks
    List<Product> findByCategoryId(Long categoryId);
    
    // Core search query engine for matching search keyword typing strings
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}

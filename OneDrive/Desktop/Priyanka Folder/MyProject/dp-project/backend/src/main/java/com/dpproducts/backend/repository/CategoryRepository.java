package com.dpproducts.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dpproducts.backend.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}


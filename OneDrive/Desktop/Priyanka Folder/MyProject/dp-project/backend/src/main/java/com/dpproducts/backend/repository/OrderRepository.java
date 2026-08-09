package com.dpproducts.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dpproducts.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Added: Pull complete past historical records sorted by latest timestamp dates
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}

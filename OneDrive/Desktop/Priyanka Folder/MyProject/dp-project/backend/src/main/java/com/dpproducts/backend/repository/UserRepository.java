package com.dpproducts.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dpproducts.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom finder query to look up a user by email profile
    Optional<User> findByEmail(String email);
}

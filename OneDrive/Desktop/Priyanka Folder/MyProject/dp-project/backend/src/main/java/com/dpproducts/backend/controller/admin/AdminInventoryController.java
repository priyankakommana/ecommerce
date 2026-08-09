package com.dpproducts.backend.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dpproducts.backend.model.Product;
import com.dpproducts.backend.service.admin.AdminInventoryService;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminInventoryController {

    @Autowired
    private AdminInventoryService adminService;

    // 1. POST: Create a brand new item entry inside the products table catalog
    @PostMapping("/products")
    public ResponseEntity<Product> createItem(@RequestBody Product product) {
        return ResponseEntity.ok(adminService.saveNewProduct(product));
    }

    // 2. PUT: Update pricing details or description strings for an existing row
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> modifyItem(@PathVariable Long id, @RequestBody Product details) {
        return ResponseEntity.ok(adminService.updateExistingProduct(id, details));
    }

    // 3. DELETE: Drop a product record from the MySQL workspace completely
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        adminService.removeProductFromInventory(id);
        return ResponseEntity.noContent().build();
    }
}

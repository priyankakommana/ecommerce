package com.dpproducts.backend.service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dpproducts.backend.model.Product;
import com.dpproducts.backend.repository.ProductRepository;

@Service
public class AdminInventoryService {

    @Autowired
    private ProductRepository productRepository;

    // CREATE: Insert a brand new item into your database catalog
    public Product saveNewProduct(Product product) {
        return productRepository.save(product);
    }

    // UPDATE: Modify pricing or description columns on an existing row
    public Product updateExistingProduct(Long id, Product details) {
        Product target = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Target product not found for ID: " + id));
        
        target.setName(details.getName());
        target.setDescription(details.getDescription());
        target.setPrice(details.getPrice());
        target.setImageUrl(details.getImageUrl());
        target.setStockQuantity(details.getStockQuantity());
        target.setCategoryId(details.getCategoryId());
        
        return productRepository.save(target);
    }

    // DELETE: Delete a product row from the database completely
    public void removeProductFromInventory(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Product ID does not exist: " + id);
        }
        productRepository.deleteById(id);
    }
}

package com.dpproducts.backend.service.client;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dpproducts.backend.model.Category;
import com.dpproducts.backend.model.Order;
import com.dpproducts.backend.model.Product;
import com.dpproducts.backend.model.User;
import com.dpproducts.backend.repository.CategoryRepository;
import com.dpproducts.backend.repository.OrderRepository;
import com.dpproducts.backend.repository.ProductRepository;
import com.dpproducts.backend.repository.UserRepository;

@Service
public class ClientStoreService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Add these methods inside src/main/java/com/dpproducts/backend/service/client/ClientStoreService.java

    @Autowired
    private UserRepository userRepository;

// Authentication Engine: validates user email and credentials matching records
    public User authenticateProfile(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid authentication credentials provided."));
    }

    // Creation Engine: logs new registration entries inside the MySQL tables
    public User registerProfile(User freshUser) {
        if(userRepository.findByEmail(freshUser.getEmail()).isPresent()) {
            throw new RuntimeException("Account email mapping already exists.");
        }
        return userRepository.save(freshUser);
    }

    // Profile Modification Engine: updates address column settings securely
    public User updateProfileDetails(Long id, User dynamicUpdates) {
        User currentRecord = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User container profile not found."));
        
        currentRecord.setName(dynamicUpdates.getName());
        currentRecord.setPhone(dynamicUpdates.getPhone());
        currentRecord.setAddress(dynamicUpdates.getAddress()); // 👈 Locks updated address into DB
        
        return userRepository.save(currentRecord);
    }



    // Fetch the horizontal ribbon headers
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Filter items by category or process top search bar keywords
    public List<Product> searchCatalog(Long categoryId, String searchKeyword) {
        if (searchKeyword != null && !searchKeyword.trim().isEmpty()) {
            return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchKeyword, searchKeyword);
        }
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        }
        return productRepository.findAll();
    }

    // Load transactional purchase histories for profiles
    public List<Order> getUserOrderHistory(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Process secure checkouts and compute threshold rules
    public Order checkOutCart(Order orderRequest) {
        BigDecimal itemSubtotal = orderRequest.getTotalAmount();
        BigDecimal qualificationLimit = new BigDecimal("5000.00");
        BigDecimal rewardRebate = new BigDecimal("1000.00");

        // Rule calculation: Orders > ₹5000 unlock flat ₹1000 off automatically
        if (itemSubtotal.compareTo(qualificationLimit) > 0) {
            orderRequest.setDiscountApplied(rewardRebate);
            orderRequest.setTotalAmount(itemSubtotal.subtract(rewardRebate));
        } else {
            orderRequest.setDiscountApplied(BigDecimal.ZERO);
        }

        orderRequest.setPaymentStatus("SUCCESSFUL");
        orderRequest.setTrackingStatus("ORDERED"); // Default entrance tracking point

        return orderRepository.save(orderRequest);
    }

        // ADD THIS INSIDE ClientStoreService.java TO ALLOW DYNAMIC EMAIL LOOKUPS AT CHECKOUT
    public String getCustomerEmailById(Long userId) {
        if (userId == null) {
            return "sai@dp.com"; // Fallback safe mock email for testing cycles
        }
        
        // Looks up the specific user row in MySQL and pulls their exact email address dynamically
        return userRepository.findById(userId)
                .map(user -> user.getEmail())
                .orElse("sai@dp.com");
    }

}

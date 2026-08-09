package com.dpproducts.backend.controller.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dpproducts.backend.model.Category;
import com.dpproducts.backend.model.Order;
import com.dpproducts.backend.model.Product;
import com.dpproducts.backend.model.User;
import com.dpproducts.backend.service.client.ClientStoreService;
import com.dpproducts.backend.service.client.EmailNotificationService;

@RestController
@RequestMapping("/api/v1/client")
@CrossOrigin(origins = "*") // Allows your Next.js application to connect securely without CORS blockage
public class ClientStoreController {

    @Autowired
    private ClientStoreService clientService;

    // 1. GET: Fetch all horizontal ribbon headers
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(clientService.getAllCategories());
    }

    // 2. GET: Search items by query word typing or filter by category tab click
    @GetMapping("/products")
    public ResponseEntity<List<Product>> browseMarketplace(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(clientService.searchCatalog(categoryId, search));
    }

    // 3. GET: Pull past purchase transaction logs for user profiles
    @GetMapping("/orders/history/{userId}")
    public ResponseEntity<List<Order>> getHistoryLogs(@PathVariable Long userId) {
        return ResponseEntity.ok(clientService.getUserOrderHistory(userId));
    }

    // // 4. POST: Execute a fresh cart checkout (calculates automatic ₹1,000 threshold rules)
    // @PostMapping("/orders/checkout")
    // public ResponseEntity<Order> handleOrderCheckout(@RequestBody Order orderRequest) {
    //     return ResponseEntity.ok(clientService.checkOutCart(orderRequest));
    // }

    // Add these mappings inside src/main/java/com/dpproducts/backend/controller/client/ClientStoreController.java

// 1. POST: Gateway endpoint matching sign-in text fields
    @PostMapping("/auth/signin")
    public ResponseEntity<?> performSignIn(@RequestParam String email, @RequestParam String password) {
        try {
            User loggedInUser = clientService.authenticateProfile(email, password);
            return ResponseEntity.ok(loggedInUser);
        } catch (Exception err) {
            return ResponseEntity.status(401).body(err.getMessage());
        }
    }

    // 2. POST: Gateway endpoint matching sign-up form columns
    @PostMapping("/auth/signup")
    public ResponseEntity<User> registerUser(@RequestBody User registrationPayload) {
        return ResponseEntity.ok(clientService.registerProfile(registrationPayload));
    }

    // 3. PUT: Endpoint tracking profile parameter edits and address adjustments
    @PutMapping("/users/profile/{id}")
    public ResponseEntity<User> handleProfileUpdates(@PathVariable Long id, @RequestBody User profilePayload) {
        return ResponseEntity.ok(clientService.updateProfileDetails(id, profilePayload));
    }

    // Add these class dependencies and route variables inside ClientStoreController.java

@Autowired
private EmailNotificationService emailService;

// Node A: Requests a fresh OTP dispatch code for a new account entry
@PostMapping("/auth/request-otp")
public ResponseEntity<String> dispatchRegistrationOtp(@RequestParam String email) {
    emailService.sendVerificationOtp(email);
    return ResponseEntity.ok("Verification OTP dispatched successfully to input destination mailbox.");
}

// Node B: Complete account creation after user inputs matching code
@PostMapping("/auth/signup-verified")
public ResponseEntity<?> commitVerifiedRegistration(@RequestBody com.dpproducts.backend.model.User userPayload, @RequestParam String otp) {
    boolean isValid = emailService.verifyOtpToken(userPayload.getEmail(), otp);
    if (!isValid) {
        return ResponseEntity.status(400).body("Invalid or expired OTP token confirmation credentials rejected.");
    }
    // Accesses your core client service pipeline to insert the safe database entry row
    com.dpproducts.backend.model.User createdRecord = clientService.registerProfile(userPayload);
    return ResponseEntity.ok(createdRecord);
}

// Node C: Augmented Checkout path that dispatches the billing text dynamically post-payment confirmation
// @PostMapping("/orders/checkout")
// public ResponseEntity<com.dpproducts.backend.model.Order> handleOrderCheckout(@RequestBody com.dpproducts.backend.model.Order orderRequest) {
//     com.dpproducts.backend.model.Order processedReceipt = clientService.checkOutCart(orderRequest);
    
//     // Fetch the client account email mapping using the associated User ID criteria
//     String customerEmail = clientService.getCustomerEmailById(processedReceipt.getUserId());
    
//     // Automated trigger fires the payment confirmation receipt message
//     emailService.sendPaymentSuccessInvoice(
//         customerEmail, 
//         "DP-ORD-" + processedReceipt.getId(), 
//         "₹" + processedReceipt.getTotalAmount().toString(), 
//         processedReceipt.getShippingAddress()
//     );
    
//     return ResponseEntity.ok(processedReceipt);
// }
    // @PostMapping("/orders/checkout")
    // public ResponseEntity<com.dpproducts.backend.model.Order> handleOrderCheckout(@RequestBody com.dpproducts.backend.model.Order orderRequest) {
    //     com.dpproducts.backend.model.Order processedReceipt = clientService.checkOutCart(orderRequest);
        
    //     // Fetches the dynamic destination email address of the buyer
    //     String customerEmail = clientService.getCustomerEmailById(processedReceipt.getUserId());
        
    //     // Triggers the invoice sender with details
    //     emailService.sendPaymentSuccessInvoice(
    //         customerEmail, 
    //         "DP-ORD-" + processedReceipt.getId(), 
    //         "₹" + processedReceipt.getTotalAmount().toString(), 
    //         processedReceipt.getShippingAddress()
    //     );
        
    //     return ResponseEntity.ok(processedReceipt);
    // }
        // Node C: Complete Checkout Path - Explicitly captures the user email parameter from the network call
    @PostMapping("/orders/checkout")
    public ResponseEntity<com.dpproducts.backend.model.Order> handleOrderCheckout(
            @RequestBody com.dpproducts.backend.model.Order orderRequest,
            @RequestParam(required = false) String userEmail) { // 👈 ADDED: Explicit query parameter mapping
        
        com.dpproducts.backend.model.Order processedReceipt = clientService.checkOutCart(orderRequest);
        
        // 1. Establish the target destination email address dynamically
        String destinationEmail = "priyankakommana05@gmail.com"; // Default system backup fallback
        
        if (userEmail != null && !userEmail.trim().isEmpty()) {
            destinationEmail = userEmail; // Uses the active logged-in email passed from the UI form
        } else {
            // Internal database lookup fallback mechanism if parameter is missing
            String lookedUpEmail = clientService.getCustomerEmailById(processedReceipt.getUserId());
            if (lookedUpEmail != null && !lookedUpEmail.equals("sai@dp.com")) {
                destinationEmail = lookedUpEmail;
            }
        }
        
        // 2. Clear Console Debugging: Trace exactly what email Spring Boot is targetting
        System.out.println("====== [DP PRODUCTS API EVENT] ======");
        System.out.println("Processing Checkout Invoice Distribution System...");
        System.out.println("Target Destination Mailbox: " + destinationEmail);
        System.out.println("======================================");
        
        // 3. Automated trigger fires the payment confirmation receipt message
        emailService.sendPaymentSuccessInvoice(
            destinationEmail, 
            "DP-ORD-" + processedReceipt.getId(), 
            "₹" + processedReceipt.getTotalAmount().toString(), 
            processedReceipt.getShippingAddress()
        );
        
        return ResponseEntity.ok(processedReceipt);
    }




}

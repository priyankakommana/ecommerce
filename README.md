# E-Commerce Platform - Spring Boot + Next.js

Full-stack e-commerce application with Spring Boot backend and Next.js frontend.

## Features
- User Registration with OTP Email Verification (Gmail SMTP + Spring Mail)
- Login with JWT Authentication
- Product Listing, Cart, Wishlist, Checkout
- Order History and Invoice Email after Payment
- Admin Dashboard for Product Management
- Dynamic Discount Logic based on Cart Total

## Tech Stack
- Backend: Java, Spring Boot, Spring Data JPA, MySQL, Spring Security, JavaMailSender
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Tools: Maven, Git, Postman

## Project Structure
- backend - Spring Boot REST APIs (8080)
    - controller/client & admin
    - service/client & admin
    - model, repository, config
- frontend - Next.js App (3000)

## How to Run
1. Create MySQL DB: dp_products
2. Backend: 
   cd backend
   // update application.properties with your gmail app password and db password
   mvn spring-boot:run
3. Frontend:
   cd frontend
   npm install
   npm run dev

Open http://localhost:3000

## Author
Priyanka Kommana

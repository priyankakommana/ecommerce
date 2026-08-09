import { OrderHistoryItem, ProductItem } from '../types';

export const CATEGORIES = [
  { id: 1, name: 'For You', icon_name: '✨', current_offer: 'Extra 10% Cash Back at checkout!' },
  { id: 2, name: 'Clothing', icon_name: '👕', current_offer: 'Buy 1 Get 1 Free on Select Apparel!' },
  { id: 3, name: 'Electronics', icon_name: '⚡', current_offer: 'Flat 15% Instant Off on Cards!' },
  { id: 4, name: 'Furniture', icon_name: '🛋️', current_offer: 'No Cost EMI available up to 12 months!' },
  { id: 5, name: 'Veggies', icon_name: '🥦', current_offer: 'Fresh morning harvest: 20% bundle discount!' },
  { id: 6, name: 'Food', icon_name: '🍔', current_offer: 'Free delivery on meals above ₹399!' },
  { id: 7, name: 'Mobiles', icon_name: '📱', current_offer: 'Exchange bonus values bumped by ₹5,000!' },
  { id: 8, name: 'Books', icon_name: '📚', current_offer: 'Reader Hub: Buy 2 Get 1 Free on trending paperbacks!' },
  { id: 9, name: 'Beauty Products', icon_name: '💄', current_offer: 'Glam Up: Flat 20% Off on top brands!' }
];

export const PRODUCTS: ProductItem[] = [
  { id: 1, category_id: 2, name: 'Classic Blue Denim Jacket', description: 'Vintage washed regular fit rugged outerwear', price: 2499.00, image_url: '/img/denim.jpg' },
  { id: 2, category_id: 2, name: 'Premium Fleece Hoodie', description: 'Ultra-soft relaxed fit winter casual wear', price: 1899.00, image_url: '/img/hoodie.jpg' },
  { id: 3, category_id: 3, name: 'Quantum Wireless Headphones', description: 'Active noise cancelling premium headset', price: 6499.00, image_url: '/img/headphones.jpg' },
  { id: 4, category_id: 3, name: 'Mechanical RGB Keyboard', description: 'Tactile clicky switches with backlighting', price: 4200.00, image_url: '/img/keyboard.jpg' },
  { id: 5, category_id: 5, name: 'Hydroponic Cherry Tomatoes (500g)', description: 'Sweet farm-fresh vine-ripened tomatoes', price: 140.00, image_url: '/img/tomatoes.jpg' },
  { id: 6, category_id: 7, name: 'Flagship X200 Smartphone', description: '128GB storage, Pro-grade camera array, 120Hz display', price: 54999.00, image_url: '/img/mobile1.jpg' }
];

// ADDED: Mock history database tracking records for profile testing
export const MOCK_ORDERS_HISTORY: OrderHistoryItem[] = [
  {
    orderId: "DP-88321",
    date: "June 20, 2026",
    totalAmount: 1899.00,
    paymentMethod: "UPI Apps",
    trackingStatus: "DELIVERED",
    items: [{ name: "Premium Fleece Hoodie", price: 1899.00 }]
  },
  {
    orderId: "DP-99410",
    date: "June 25, 2026",
    totalAmount: 4340.00,
    paymentMethod: "Credit Card Gateway",
    trackingStatus: "SHIPPED", // Current live shipment status testing tracker
    items: [
      { name: "Mechanical RGB Keyboard", price: 4200.00 },
      { name: "Hydroponic Cherry Tomatoes (500g)", price: 140.00 }
    ]
  }
];

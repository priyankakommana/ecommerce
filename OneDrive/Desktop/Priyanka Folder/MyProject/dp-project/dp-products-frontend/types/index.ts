export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ProductItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export type ActiveView = 'BROWSE' | 'CART' | 'PAYMENT' | 'SUCCESS' | 'TRACKING' | 'HELP';

export interface OrderHistoryItem {
  orderId: string;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  trackingStatus: 'ORDERED' | 'SHIPPED' | 'DELIVERED';
  items: { name: string; price: number }[];
}
export interface CartItem {
  product: ProductItem;
  quantity: number;
}
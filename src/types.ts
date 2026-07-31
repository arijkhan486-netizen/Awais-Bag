export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  isFeatured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'whatsapp' | 'jazzcash' | 'easypaisa';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  currencySymbol: string;
  whatsappNumber: string;
  shippingFee: number;
  freeShippingThreshold: number;
  adminPasswordHash?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

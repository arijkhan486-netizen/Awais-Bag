import { Order, OrderStatus, PaymentMethod, Product, StoreSettings } from '../types';

// Helper API calls
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch products', err);
    return [];
  }
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to add product');
  }
  return json.data;
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to update product');
  }
  return json.data;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to delete product');
  }
}

export async function placeOrder(orderPayload: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethod;
  items: { productId: string; productName: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  notes?: string;
}): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to place order');
  }
  return json.data;
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch orders', err);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to update order status');
  }
  return json.data;
}

export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`/api/orders/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to delete order');
  }
}

export async function loginAdmin(password: string): Promise<string> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Invalid password');
  }
  return json.data.token;
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to change password');
  }
}

export async function fetchStoreInfo(): Promise<Partial<StoreSettings>> {
  try {
    const res = await fetch('/api/store/info');
    const json = await res.json();
    if (json.success) {
      return json.data;
    }
    return {};
  } catch (err) {
    console.error('Failed to fetch store info', err);
    return {};
  }
}

export async function updateStoreInfo(settings: Partial<StoreSettings>): Promise<Partial<StoreSettings>> {
  const res = await fetch('/api/store/info', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to update store info');
  }
  return json.data;
}

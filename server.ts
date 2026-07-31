import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/data/initialProducts';
import { Order, Product, StoreSettings } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Path definitions for persistent file data storage
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default store settings
const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Express Market',
  currencySymbol: 'Rs.',
  whatsappNumber: '+923001234567',
  shippingFee: 199,
  freeShippingThreshold: 5000,
  adminPasswordHash: 'admin123' // default admin password
};

// Helper methods to read/write JSON files safely
function readJSON<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Seed Initial Data if missing
function initializeData() {
  const products = readJSON<Product[]>(PRODUCTS_FILE, []);
  if (!products || products.length === 0) {
    writeJSON<Product[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  }

  const settings = readJSON<StoreSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  if (!settings.adminPasswordHash) {
    writeJSON<StoreSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  }

  const orders = readJSON<Order[]>(ORDERS_FILE, []);
  if (!orders || orders.length === 0) {
    const sampleOrder: Order = {
      id: 'ORD-1001',
      customerName: 'Muhammad Ali',
      customerPhone: '03001234567',
      customerEmail: 'ali@example.com',
      address: 'House #45, Block C, Gulberg III',
      city: 'Lahore',
      paymentMethod: 'cod',
      items: [
        {
          productId: 'prod-1',
          productName: 'Wireless ANC Pro Earbuds',
          price: 3499,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
        }
      ],
      subtotal: 3499,
      shippingFee: 199,
      discount: 0,
      total: 3698,
      status: 'pending',
      notes: 'Please call before delivery',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    };
    writeJSON<Order[]>(ORDERS_FILE, [sampleOrder]);
  }
}

initializeData();

// --- API ROUTES ---

// Store Info API
app.get('/api/store/info', (req, res) => {
  const settings = readJSON<StoreSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  const { adminPasswordHash, ...publicSettings } = settings;
  res.json({ success: true, data: publicSettings });
});

app.put('/api/store/info', (req, res) => {
  const settings = readJSON<StoreSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  const updated = { ...settings, ...req.body };
  writeJSON<StoreSettings>(SETTINGS_FILE, updated);
  const { adminPasswordHash, ...publicSettings } = updated;
  res.json({ success: true, data: publicSettings });
});

// Admin Auth API
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const settings = readJSON<StoreSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  const correctPassword = settings.adminPasswordHash || 'admin123';

  if (password === correctPassword) {
    // Return simple session token
    res.json({
      success: true,
      data: {
        token: 'token-' + Buffer.from(password + '-secret-key').toString('base64'),
        message: 'Admin authentication successful'
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Ghalat Password! (Incorrect password)' });
  }
});

app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const settings = readJSON<StoreSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
  const correctPassword = settings.adminPasswordHash || 'admin123';

  if (currentPassword !== correctPassword) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect' });
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, error: 'New password must be at least 4 characters long' });
  }

  settings.adminPasswordHash = newPassword.trim();
  writeJSON<StoreSettings>(SETTINGS_FILE, settings);
  res.json({ success: true, message: 'Password updated successfully' });
});

// Products API
app.get('/api/products', (req, res) => {
  const products = readJSON<Product[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  res.json({ success: true, data: products });
});

app.post('/api/products', (req, res) => {
  const products = readJSON<Product[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const newProduct: Product = {
    id: 'prod-' + Date.now(),
    name: req.body.name || 'Untitled Product',
    description: req.body.description || '',
    price: Number(req.body.price) || 0,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
    image: req.body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    category: req.body.category || 'General',
    stock: Number(req.body.stock) || 10,
    isFeatured: Boolean(req.body.isFeatured),
    rating: req.body.rating ? Number(req.body.rating) : 5.0,
    reviewsCount: req.body.reviewsCount ? Number(req.body.reviewsCount) : 1,
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  writeJSON<Product[]>(PRODUCTS_FILE, products);
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const products = readJSON<Product[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const updatedProduct: Product = {
    ...products[index],
    name: req.body.name ?? products[index].name,
    description: req.body.description ?? products[index].description,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
    originalPrice: req.body.originalPrice !== undefined ? (req.body.originalPrice ? Number(req.body.originalPrice) : undefined) : products[index].originalPrice,
    image: req.body.image ?? products[index].image,
    category: req.body.category ?? products[index].category,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock,
    isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : products[index].isFeatured,
  };

  products[index] = updatedProduct;
  writeJSON<Product[]>(PRODUCTS_FILE, products);
  res.json({ success: true, data: updatedProduct });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  let products = readJSON<Product[]>(PRODUCTS_FILE, INITIAL_PRODUCTS);
  const initialLength = products.length;
  products = products.filter((p) => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  writeJSON<Product[]>(PRODUCTS_FILE, products);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Orders API
app.get('/api/orders', (req, res) => {
  const orders = readJSON<Order[]>(ORDERS_FILE, []);
  res.json({ success: true, data: orders });
});

app.post('/api/orders', (req, res) => {
  const orders = readJSON<Order[]>(ORDERS_FILE, []);
  const { customerName, customerPhone, customerEmail, address, city, paymentMethod, items, subtotal, shippingFee, discount, total, notes } = req.body;

  if (!customerName || !customerPhone || !address || !city || !items || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Please provide all required order details' });
  }

  const newOrder: Order = {
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    customerName,
    customerPhone,
    customerEmail: customerEmail || '',
    address,
    city,
    paymentMethod: paymentMethod || 'cod',
    items,
    subtotal: Number(subtotal) || 0,
    shippingFee: Number(shippingFee) || 0,
    discount: Number(discount) || 0,
    total: Number(total) || 0,
    status: 'pending',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJSON<Order[]>(ORDERS_FILE, orders);

  // Also update product stock quantities
  const products = readJSON<Product[]>(PRODUCTS_FILE, []);
  let stockUpdated = false;
  items.forEach((item: { productId: string; quantity: number }) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
      stockUpdated = true;
    }
  });
  if (stockUpdated) {
    writeJSON<Product[]>(PRODUCTS_FILE, products);
  }

  res.status(201).json({ success: true, data: newOrder });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = readJSON<Order[]>(ORDERS_FILE, []);
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  orders[index].status = status;
  writeJSON<Order[]>(ORDERS_FILE, orders);
  res.json({ success: true, data: orders[index] });
});

app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  let orders = readJSON<Order[]>(ORDERS_FILE, []);
  orders = orders.filter((o) => o.id !== id);
  writeJSON<Order[]>(ORDERS_FILE, orders);
  res.json({ success: true, message: 'Order deleted' });
});

// START SERVER & VITE MIDDLEWARE
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import React, { useState, useEffect } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  placeOrder,
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
  loginAdmin,
  changeAdminPassword,
  fetchStoreInfo,
  updateStoreInfo
} from './lib/api';
import { CartItem, Order, OrderStatus, Product, StoreSettings } from './types';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { ShoppingBag, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeSettings, setStoreSettings] = useState<Partial<StoreSettings>>({
    storeName: 'Bazaar Express',
    currencySymbol: 'Rs.',
    whatsappNumber: '+923001234567',
    shippingFee: 199,
    freeShippingThreshold: 5000
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'store' | 'admin'>('store');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bazaar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Admin state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('admin_session_token'));
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prods, ords, info] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchStoreInfo()
        ]);
        if (prods && prods.length > 0) setProducts(prods);
        if (ords) setOrders(ords);
        if (info && info.storeName) setStoreSettings(info);
      } catch (err) {
        console.error('Error loading store data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bazaar_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Categories extraction
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    showToast(`Added ${quantity}x "${product.name}" to cart!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // Admin Login / Logout
  const handleAdminLogin = async (password: string) => {
    const token = await loginAdmin(password);
    localStorage.setItem('admin_session_token', token);
    setIsAdminAuthenticated(true);
    setActiveTab('admin');
    showToast('Admin Login Successful!');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session_token');
    setIsAdminAuthenticated(false);
    setActiveTab('store');
    showToast('Logged out from Admin Panel');
  };

  // Product CRUD Handlers (Admin)
  const handleAddProduct = async (productData: Partial<Product>) => {
    const newProd = await createProduct(productData);
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" added!`);
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    const updated = await updateProduct(id, productData);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast('Product updated successfully!');
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from store catalog.');
  };

  // Order Handlers
  const handlePlaceOrderSubmit = async (formData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
    city: string;
    paymentMethod: any;
    notes?: string;
  }) => {
    const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const shipping = subtotal >= (storeSettings.freeShippingThreshold || 5000) ? 0 : (storeSettings.shippingFee || 199);
    const total = subtotal + shipping;

    const orderPayload = {
      ...formData,
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image
      })),
      subtotal,
      shippingFee: shipping,
      discount: 0,
      total
    };

    const createdOrder = await placeOrder(orderPayload);
    setOrders((prev) => [createdOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setPlacedOrder(createdOrder);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    showToast(`Order status changed to ${status.toUpperCase()}`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Order record removed.');
  };

  const handleChangePassword = async (currentPass: string, newPass: string) => {
    await changeAdminPassword(currentPass, newPass);
  };

  const handleUpdateStoreSettings = async (settings: Partial<StoreSettings>) => {
    const updated = await updateStoreInfo(settings);
    setStoreSettings(updated);
  };

  // Filtered Products for Store view
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter((p) => p.isFeatured);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Navbar Header */}
      <Navbar
        cartCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        isAdmin={isAdminAuthenticated}
        onOpenAdmin={() => {
          if (isAdminAuthenticated) {
            setActiveTab('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onLogoutAdmin={handleAdminLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storeName={storeSettings.storeName || 'Bazaar Express'}
      />

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-stone-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* VIEW SWITCH: ADMIN vs CUSTOMER STORE */}
      {activeTab === 'admin' ? (
        isAdminAuthenticated ? (
          <AdminDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onChangePassword={handleChangePassword}
            storeSettings={storeSettings}
            onUpdateStoreSettings={handleUpdateStoreSettings}
            currencySymbol={storeSettings.currencySymbol}
            categories={categories}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white p-8 rounded-3xl border border-stone-200 max-w-md w-full text-center space-y-4 shadow-lg">
              <h2 className="text-xl font-extrabold text-stone-900">Admin Authentication Required</h2>
              <p className="text-xs text-stone-500">
                Please enter the store owner password to access the products edit & orders management panel.
              </p>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="w-full bg-stone-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Enter Admin Password
              </button>
            </div>
          </div>
        )
      ) : (
        /* CUSTOMER SHOP VIEW */
        <main className="flex-1">
          
          {/* Hero Banner (Only when no search query and category is All) */}
          {searchQuery === '' && selectedCategory === 'All' && (
            <section className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Quality Products Guaranteed
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    Shop Premium Electronics & Lifestyle Essentials
                  </h1>
                  <p className="text-stone-300 text-sm leading-relaxed max-w-lg">
                    Discover handpicked original gadgets, smartwatches, leather bags, and daily home items. Enjoy Cash on Delivery & fast dispatch across Pakistan.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById('products-grid');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" /> Explore Catalog
                    </button>

                    <button
                      onClick={() => setIsAdminLoginOpen(true)}
                      className="bg-stone-800/80 hover:bg-stone-800 text-stone-300 font-semibold px-4 py-3 rounded-xl text-xs transition-colors border border-stone-700"
                    >
                      Store Owner Login
                    </button>
                  </div>
                </div>

                {/* Featured Highlight Card */}
                {featuredProducts.length > 0 && (
                  <div className="hidden md:block bg-stone-900/80 backdrop-blur-md p-5 rounded-3xl border border-stone-800 shadow-2xl">
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest block mb-3">
                      ⭐ Featured Highlight
                    </span>
                    <div className="flex gap-4 items-center">
                      <img
                        src={featuredProducts[0].image}
                        alt={featuredProducts[0].name}
                        className="w-32 h-32 object-cover rounded-2xl bg-stone-800 border border-stone-700"
                      />
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider">{featuredProducts[0].category}</span>
                        <h3 className="font-bold text-white text-base line-clamp-1">{featuredProducts[0].name}</h3>
                        <p className="text-stone-400 text-xs line-clamp-2">{featuredProducts[0].description}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-lg font-black text-emerald-400">
                            {storeSettings.currencySymbol || 'Rs.'} {featuredProducts[0].price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleAddToCart(featuredProducts[0])}
                            className="bg-white text-stone-950 hover:bg-emerald-400 text-xs font-extrabold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Products Grid Section */}
          <section id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <span>Product Listing</span>
                  {selectedCategory !== 'All' && (
                    <span className="text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {selectedCategory}
                    </span>
                  )}
                </h2>
                <p className="text-stone-500 text-xs mt-0.5">
                  Showing {filteredProducts.length} items available in stock
                </p>
              </div>

              {/* Quick filters */}
              {searchQuery && (
                <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Search filter: "<strong>{searchQuery}</strong>"</span>
                  <button onClick={() => setSearchQuery('')} className="font-bold underline ml-1">
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Products grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 border border-stone-200 animate-pulse p-4 flex flex-col justify-between">
                    <div className="bg-stone-200 h-40 rounded-xl w-full"></div>
                    <div className="space-y-2">
                      <div className="bg-stone-200 h-4 rounded w-3/4"></div>
                      <div className="bg-stone-200 h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto my-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-stone-800 text-base">No Products Found</h3>
                <p className="text-xs text-stone-500">
                  We couldn't find any products matching your search or category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="bg-stone-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onQuickView={(p) => setSelectedProduct(p)}
                    currencySymbol={storeSettings.currencySymbol}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <Footer
            onOpenAdmin={() => {
              if (isAdminAuthenticated) {
                setActiveTab('admin');
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
            isAdmin={isAdminAuthenticated}
            storeName={storeSettings.storeName || 'Bazaar Express'}
            whatsappNumber={storeSettings.whatsappNumber || '+923001234567'}
          />
        </main>
      )}

      {/* MODALS & DRAWERS */}

      {/* Product Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        currencySymbol={storeSettings.currencySymbol}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        currencySymbol={storeSettings.currencySymbol}
        shippingFee={storeSettings.shippingFee || 199}
        freeShippingThreshold={storeSettings.freeShippingThreshold || 5000}
      />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        subtotal={cartSubtotal}
        shippingFee={cartSubtotal >= (storeSettings.freeShippingThreshold || 5000) ? 0 : (storeSettings.shippingFee || 199)}
        discount={0}
        total={cartSubtotal + (cartSubtotal >= (storeSettings.freeShippingThreshold || 5000) ? 0 : (storeSettings.shippingFee || 199))}
        currencySymbol={storeSettings.currencySymbol}
        whatsappNumber={storeSettings.whatsappNumber || '+923001234567'}
        onPlaceOrder={handlePlaceOrderSubmit}
      />

      {/* Order Success Receipt Modal */}
      <OrderSuccessModal
        order={placedOrder}
        onClose={() => setPlacedOrder(null)}
        currencySymbol={storeSettings.currencySymbol}
        whatsappNumber={storeSettings.whatsappNumber || '+923001234567'}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />

    </div>
  );
}

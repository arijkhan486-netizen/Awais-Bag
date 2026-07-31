import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
  KeyRound,
  Eye,
  CheckCircle2,
  DollarSign,
  Phone,
  Settings,
  Store,
  Tag,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, Product, StoreSettings } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { OrderDetailsModal } from './OrderDetailsModal';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onChangePassword: (currentPass: string, newPass: string) => Promise<void>;
  storeSettings: Partial<StoreSettings>;
  onUpdateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  currencySymbol?: string;
  categories: string[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onChangePassword,
  storeSettings,
  onUpdateStoreSettings,
  currencySymbol = 'Rs.',
  categories
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  
  // Product state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Settings state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [storeNameInput, setStoreNameInput] = useState(storeSettings.storeName || 'Bazaar Express');
  const [whatsappInput, setWhatsappInput] = useState(storeSettings.whatsappNumber || '+923001234567');
  const [shippingFeeInput, setShippingFeeInput] = useState(storeSettings.shippingFee?.toString() || '199');
  const [freeShippingInput, setFreeShippingInput] = useState(storeSettings.freeShippingThreshold?.toString() || '5000');
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  // Metrics Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  // Products filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Orders filtering
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus =
      orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleDeleteProd = async (id: string, name: string) => {
    if (window.confirm(`Kya aap product "${name}" delete karna chahte hain?`)) {
      await onDeleteProduct(id);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    try {
      await onChangePassword(currentPassword, newPassword);
      setPassMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message || 'Failed to update password' });
    }
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateStoreSettings({
        storeName: storeNameInput,
        whatsappNumber: whatsappInput,
        shippingFee: Number(shippingFeeInput),
        freeShippingThreshold: Number(freeShippingInput)
      });
      setSettingsMsg('Store settings saved successfully!');
      setTimeout(() => setSettingsMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 pb-16">
      
      {/* Top Admin Header Bar */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-stone-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded">
                  Admin Control Panel
                </span>
                <span className="text-stone-400 text-xs">Owner Mode Active</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Store Operations & Management
              </h1>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={handleOpenAddProduct}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Add New Product (Naya Product)
            </button>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 border-b border-stone-800 text-xs font-bold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveAdminTab('overview')}
              className={`px-4 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeAdminTab === 'overview'
                  ? 'bg-stone-100 text-stone-900 border-t-2 border-emerald-500'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Overview Dashboard
            </button>
            <button
              onClick={() => setActiveAdminTab('products')}
              className={`px-4 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeAdminTab === 'products'
                  ? 'bg-stone-100 text-stone-900 border-t-2 border-emerald-500'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" /> Products ({products.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('orders')}
              className={`px-4 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeAdminTab === 'orders'
                  ? 'bg-stone-100 text-stone-900 border-t-2 border-emerald-500'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Customer Orders ({orders.length})
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveAdminTab('settings')}
              className={`px-4 py-3 rounded-t-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeAdminTab === 'settings'
                  ? 'bg-stone-100 text-stone-900 border-t-2 border-emerald-500'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" /> Settings & Password
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* OVERVIEW TAB */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-stone-400 font-bold text-xs block uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <span className="text-2xl font-black text-stone-900 mt-1 block">
                    {currencySymbol} {totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">Valid placed orders</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-stone-400 font-bold text-xs block uppercase tracking-wider">
                    Total Orders
                  </span>
                  <span className="text-2xl font-black text-stone-900 mt-1 block">
                    {orders.length}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">Customer checkouts</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-stone-400 font-bold text-xs block uppercase tracking-wider">
                    Pending Orders
                  </span>
                  <span className="text-2xl font-black text-amber-600 mt-1 block">
                    {pendingOrdersCount}
                  </span>
                  <span className="text-[11px] text-amber-700 font-medium">Awaiting action</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-stone-400 font-bold text-xs block uppercase tracking-wider">
                    Active Products
                  </span>
                  <span className="text-2xl font-black text-stone-900 mt-1 block">
                    {products.length}
                  </span>
                  <span className="text-[11px] text-purple-600 font-medium">Catalog items</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Package className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Orders List */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" /> Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-400 py-6 text-center">No orders placed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        className="p-3.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200/70 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                            {ord.id.slice(-4)}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 text-xs">{ord.customerName}</p>
                            <span className="text-[10px] text-stone-500">
                              {ord.city} • {ord.items.length} items • {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-stone-900 text-xs block">
                            {currencySymbol} {ord.total.toLocaleString()}
                          </span>
                          <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Admin Actions Box */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" /> Owner Controls
                </h3>

                <button
                  onClick={handleOpenAddProduct}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Product to Store
                </button>

                <button
                  onClick={() => setActiveAdminTab('products')}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white p-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Package className="w-4 h-4" /> Manage & Edit Products
                </button>

                <button
                  onClick={() => setActiveAdminTab('settings')}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 p-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-stone-200"
                >
                  <KeyRound className="w-4 h-4 text-stone-600" /> Change Admin Password
                </button>
              </div>

            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter & Add bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search product name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Product (Naya Product)
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-900 text-white font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions (Edit/Delete)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-400">
                          No products found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border bg-stone-100 shrink-0" />
                              <div>
                                <p className="font-bold text-stone-900 text-xs line-clamp-1">{p.name}</p>
                                <span className="text-[10px] text-stone-400 font-mono">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-stone-900 text-sm">
                              {currencySymbol} {p.price.toLocaleString()}
                            </span>
                            {p.originalPrice && (
                              <span className="block text-[10px] text-stone-400 line-through">
                                {currencySymbol} {p.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {p.stock > 0 ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold text-[11px]">
                                {p.stock} in stock
                              </span>
                            ) : (
                              <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md font-bold text-[11px]">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {p.isFeatured && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 p-2 rounded-xl transition-all font-semibold flex items-center gap-1 text-xs"
                                title="Edit product"
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProd(p.id, p.name)}
                                className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 p-2 rounded-xl transition-all font-semibold flex items-center gap-1 text-xs"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, customer name, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-stone-400 font-semibold shrink-0">Status:</span>
                {['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-900 text-white font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer Name & Phone</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">View / Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-400">
                          No customer orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-stone-900">
                            {ord.id}
                            <span className="block text-[10px] text-stone-400 font-sans font-normal">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-stone-900">{ord.customerName}</p>
                            <span className="text-[11px] text-stone-500 font-mono">{ord.customerPhone}</span>
                          </td>
                          <td className="p-4 font-semibold text-stone-800">{ord.city}</td>
                          <td className="p-4 font-black text-emerald-700 text-sm">
                            {currencySymbol} {ord.total.toLocaleString()}
                          </td>
                          <td className="p-4 uppercase font-bold text-stone-600 text-[11px]">
                            {ord.paymentMethod}
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="bg-stone-100 border border-stone-300 rounded-lg px-2 py-1 text-[11px] font-bold text-stone-800"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="bg-stone-900 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeAdminTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            
            {/* Admin Password Change Form */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-stone-900 text-base">Change Admin Password</h3>
              </div>

              {passMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    passMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{passMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Current Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 4 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-xl transition-colors text-xs"
                >
                  Update Admin Password
                </button>
              </form>
            </div>

            {/* Store Information Form */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <Store className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-stone-900 text-base">Store Configuration</h3>
              </div>

              {settingsMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{settingsMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    value={storeNameInput}
                    onChange={(e) => setStoreNameInput(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">WhatsApp Order Number</label>
                  <input
                    type="text"
                    required
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Shipping Fee (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={shippingFeeInput}
                      onChange={(e) => setShippingFeeInput(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Free Shipping Min (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={freeShippingInput}
                      onChange={(e) => setFreeShippingInput(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl transition-colors text-xs"
                >
                  Save Store Settings
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

      {/* Product Add/Edit Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
        onSave={async (data) => {
          if (editingProduct) {
            await onUpdateProduct(editingProduct.id, data);
          } else {
            await onAddProduct(data);
          }
        }}
        categories={categories}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={async (id, status) => {
          await onUpdateOrderStatus(id, status);
          if (selectedOrder) {
            setSelectedOrder({ ...selectedOrder, status });
          }
        }}
        onDeleteOrder={onDeleteOrder}
        currencySymbol={currencySymbol}
        whatsappNumber={whatsappInput}
      />

    </div>
  );
};

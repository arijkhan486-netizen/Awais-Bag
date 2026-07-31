import React from 'react';
import { ShoppingBag, ShieldCheck, Search, Store, SlidersHorizontal, Lock, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
  activeTab: 'store' | 'admin';
  setActiveTab: (tab: 'store' | 'admin') => void;
  storeName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  isAdmin,
  onOpenAdmin,
  onLogoutAdmin,
  activeTab,
  setActiveTab,
  storeName
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>🔥 Free Express Delivery on orders over Rs. 5,000 | Cash on Delivery Available</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('store')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-emerald-700 transition-colors">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-stone-900 block leading-tight">
                  {storeName || 'Bazaar Express'}
                </span>
                <span className="text-[10px] text-stone-500 tracking-wider uppercase font-semibold">
                  Official Online Store
                </span>
              </div>
            </button>

            {/* View Mode Switcher */}
            <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
              <button
                onClick={() => setActiveTab('store')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'store'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Customer Shop
              </button>
              <button
                onClick={() => {
                  if (isAdmin) {
                    setActiveTab('admin');
                  } else {
                    onOpenAdmin();
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Panel</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Admin Access</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Field (Hidden on Admin tab) */}
          {activeTab === 'store' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {activeTab === 'store' ? (
              <button
                onClick={onOpenCart}
                id="cart-button"
                className="relative bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-white text-emerald-700 text-xs font-extrabold px-2 py-0.5 rounded-full ml-0.5">
                  {cartCount}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Logged in as Admin
                </span>
                <button
                  onClick={onLogoutAdmin}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Admin button if not logged in */}
            {!isAdmin && activeTab === 'store' && (
              <button
                onClick={onOpenAdmin}
                className="md:hidden bg-stone-100 p-2 rounded-xl text-stone-600 hover:text-stone-900"
                title="Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {activeTab === 'store' && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Categories Bar (For Customer Shop) */}
        {activeTab === 'store' && categories.length > 0 && (
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-stone-400 font-semibold flex items-center gap-1 shrink-0 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Categories:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  currencySymbol?: string;
  shippingFee: number;
  freeShippingThreshold: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  currencySymbol = 'Rs.',
  shippingFee,
  freeShippingThreshold
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const isFreeShipping = subtotal >= freeShippingThreshold || cartItems.length === 0;
  const currentShipping = isFreeShipping ? 0 : shippingFee;
  const finalTotal = Math.max(0, subtotal - discountAmount + currentShipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WELCOME10' || promoCode.trim().toUpperCase() === 'BAZAAR10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else {
      alert('Invalid Promo Code! Use "WELCOME10" for 10% OFF.');
    }
  };

  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col relative border-l border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base">Your Shopping Cart</h2>
              <p className="text-xs text-stone-500 font-medium">{cartItems.length} items selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cartItems.length > 0 && (
          <div className="bg-emerald-50/70 p-3.5 border-b border-emerald-100 text-xs text-stone-700">
            {subtotal >= freeShippingThreshold ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                🎉 Congratulations! You unlocked FREE Delivery!
              </span>
            ) : (
              <div>
                <span className="text-stone-600 font-medium">
                  Add <strong className="text-stone-900">{currencySymbol} {(freeShippingThreshold - subtotal).toLocaleString()}</strong> more for FREE Delivery
                </span>
                <div className="w-full bg-emerald-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-stone-300" />
              </div>
              <p className="font-bold text-stone-700 text-base mb-1">Your cart is empty</p>
              <p className="text-xs text-stone-500 mb-6 max-w-xs">
                Explore our products catalog and add items to your cart to get started.
              </p>
              <button
                onClick={onClose}
                className="bg-stone-900 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-stone-50/80 p-3 rounded-2xl border border-stone-200/70 relative group"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-white border border-stone-100 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-stone-900 text-xs line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium">{item.product.category}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-stone-900 text-sm">
                      {currencySymbol} {(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-l-lg transition-colors text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-r-lg transition-colors text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-stone-200 space-y-4">
            {/* Promo Code Input */}
            {!promoApplied ? (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                <span>10% Promo Discount Applied!</span>
                <button
                  onClick={() => {
                    setPromoApplied(false);
                    setDiscountPercent(0);
                    setPromoCode('');
                  }}
                  className="text-stone-400 hover:text-stone-700"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  {currencySymbol} {subtotal.toLocaleString()}
                </span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount (10%)</span>
                  <span>- {currencySymbol} {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-stone-900">
                  {isFreeShipping ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `${currencySymbol} ${currentShipping.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-2 flex justify-between text-base font-extrabold text-stone-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">
                  {currencySymbol} {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure Checkout (COD / WhatsApp / Mobile Pay)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

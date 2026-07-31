import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  currencySymbol?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  currencySymbol = 'Rs.'
}) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-stone-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-stone-100 hover:bg-stone-200 text-stone-600 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image side */}
          <div className="relative bg-stone-100 aspect-square md:aspect-auto h-full flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-80 md:max-h-full object-contain drop-shadow-md rounded-2xl"
            />
            {discountPercent !== null && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Details side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="uppercase tracking-widest font-bold">{product.category}</span>
                {product.stock > 0 ? (
                  <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                    Out of Stock
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-stone-900 mb-3 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700">{product.rating || 4.8}</span>
                <span className="text-xs text-stone-400">({product.reviewsCount || 45} verified customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-2xl font-black text-stone-900">
                  {currencySymbol} {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through font-medium">
                    {currencySymbol} {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider mb-2">
                  Product Description
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions & Perks */}
            <div>
              {/* Quantity selector & Add button */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white text-stone-600 font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-stone-900 text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white text-stone-600 font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : product.stock > 0
                      ? 'bg-stone-900 hover:bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart ({currencySymbol} {(product.price * qty).toLocaleString()})
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-500 border-t border-stone-100 pt-4">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Original</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>7 Days Return</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

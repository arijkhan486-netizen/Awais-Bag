import React from 'react';
import { ShoppingCart, Star, Eye, Tag, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  currencySymbol?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  currencySymbol = 'Rs.'
}) => {
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-lg hover:border-stone-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent !== null && (
          <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Tag className="w-3 h-3" /> -{discountPercent}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-500 text-stone-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs">
            Featured
          </span>
        )}
      </div>

      {/* Product Image & Hover Overlay */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white/90 hover:bg-white text-stone-900 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-400 text-[10px]">({product.reviewsCount || 12})</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 text-base line-clamp-1 hover:text-emerald-700 transition-colors cursor-pointer mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description Preview */}
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-stone-900">
              {currencySymbol} {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {currencySymbol} {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock state */}
          {isOutOfStock ? (
            <button
              disabled
              className="w-full bg-stone-100 text-stone-400 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <AlertCircle className="w-4 h-4" /> Out of Stock
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-stone-900 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (productData: Partial<Product>) => Promise<void>;
  categories: string[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
  categories
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [customCategory, setCustomCategory] = useState('');
  const [stock, setStock] = useState('10');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setPrice(productToEdit.price?.toString() || '');
      setOriginalPrice(productToEdit.originalPrice?.toString() || '');
      setCategory(productToEdit.category || 'Electronics');
      setStock(productToEdit.stock?.toString() || '10');
      setImage(productToEdit.image || '');
      setDescription(productToEdit.description || '');
      setIsFeatured(Boolean(productToEdit.isFeatured));
    } else {
      setName('');
      setPrice('');
      setOriginalPrice('');
      setCategory(categories[0] || 'Electronics');
      setStock('10');
      setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
      setDescription('');
      setIsFeatured(false);
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !image.trim() || !description.trim()) {
      setErrorMsg('Bara-e-karam product ka naam, price, image aur description zaroor likhein.');
      return;
    }

    const finalCategory = category === 'NEW' ? customCategory.trim() : category;
    if (!finalCategory) {
      setErrorMsg('Bara-e-karam category select karein ya nayi category likhein.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      await onSave({
        name: name.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category: finalCategory,
        stock: Number(stock),
        image: image.trim(),
        description: description.trim(),
        isFeatured
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Product save karne mein masla hua.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleImages = [
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-stone-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              {productToEdit ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-extrabold text-lg">
                {productToEdit ? 'Edit Existing Product' : 'Add New Product (Naya Product)'}
              </h2>
              <p className="text-xs text-stone-300">
                {productToEdit ? 'Update price, stock, description or details' : 'Enter product details to add to catalog'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Product Title / Name (Naam) <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Noise Cancelling Earbuds"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Sale Price (Rs.) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="2499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Original Price (Rs.) <span className="text-stone-400">(Optional cut price)</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="3499"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Stock Quantity (Tadaad) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Category selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Category <span className="text-rose-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="NEW">+ Create New Category</option>
              </select>
            </div>

            {category === 'NEW' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  New Category Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beauty & Cosmetics"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Image URL & Quick Sample Pick */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
              <span>Image URL (Tasveer Direct Link) <span className="text-rose-600">*</span></span>
              <span className="text-stone-400 font-normal">Unsplash / Image Link</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Live Image Preview */}
            {image && (
              <div className="mt-2.5 flex items-center gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <img src={image} alt="Preview" className="w-14 h-14 object-cover rounded-lg border bg-white" />
                <div className="text-xs text-stone-500">
                  <span className="font-bold text-stone-800 block">Image Preview</span>
                  <span className="text-[10px] text-stone-400 line-clamp-1">{image}</span>
                </div>
              </div>
            )}

            {/* Sample Image Presets */}
            <div className="mt-2 flex items-center gap-2 overflow-x-auto text-[11px] text-stone-500 pb-1">
              <span className="shrink-0 font-medium">Quick Presets:</span>
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(s.url)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-medium shrink-0"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Description (Tafseel) <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Write product specifications, features, warranty..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-toggle"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-stone-300"
            />
            <label htmlFor="featured-toggle" className="text-xs font-bold text-stone-800 cursor-pointer">
              Mark as Featured Product (Display on main banner grid)
            </label>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:bg-stone-400"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : productToEdit ? 'Update Product' : 'Add Product to Store'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

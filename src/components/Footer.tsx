import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Phone, Lock, Store, MessageSquare } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  isAdmin: boolean;
  storeName: string;
  whatsappNumber: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  isAdmin,
  storeName,
  whatsappNumber
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Guarantees grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Express Delivery</h4>
              <p className="text-stone-400 text-xs">Fast shipping across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Cash on Delivery</h4>
              <p className="text-stone-400 text-xs">Pay upon parcel arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">7-Day Guarantee</h4>
              <p className="text-stone-400 text-xs">Easy returns & replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">WhatsApp Orders</h4>
              <p className="text-stone-400 text-xs">Instant customer support</p>
            </div>
          </div>
        </div>

        {/* Main footer columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">{storeName}</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed mb-4">
              Your trusted online shopping destination for premium electronics, fashion, bags, home essentials, and lifestyle accessories.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3 uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Helpline / WhatsApp: <strong className="text-white font-mono">{whatsappNumber}</strong></span>
              </li>
              <li>Delivery Cities: Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Multan & All Pakistan</li>
              <li>Payment Options: Cash on Delivery, JazzCash, EasyPaisa, Bank Transfer</li>
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-white text-sm mb-3 uppercase tracking-wider">
                Store Admin Portal
              </h4>
              <p className="text-stone-400 text-xs mb-3">
                Store owner password-protected portal to manage products catalog, edit prices, delete items, and fulfill customer orders.
              </p>
              <button
                onClick={onOpenAdmin}
                className="bg-stone-800 hover:bg-stone-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors border border-stone-700"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAdmin ? 'Open Admin Panel' : 'Owner Admin Login'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>WhatsApp Quick Checkout</span>
            <span>•</span>
            <span>Admin Control Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

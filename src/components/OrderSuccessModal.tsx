import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquare, Printer, ShoppingBag, Truck, Phone, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  currencySymbol?: string;
  whatsappNumber: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  currencySymbol = 'Rs.',
  whatsappNumber
}) => {
  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [order]);

  if (!order) return null;

  // Build WhatsApp pre-filled text
  const itemSummaryText = order.items
    .map((i) => `• ${i.quantity}x ${i.productName} (${currencySymbol} ${i.price})`)
    .join('%0A');

  const rawWhatsappMsg = `Salam! Main ne order place kiya hai.%0A%0A*Order ID:* ${order.id}%0A*Naam:* ${order.customerName}%0A*Phone:* ${order.customerPhone}%0A*Pata:* ${order.address}, ${order.city}%0A*Payment Method:* ${order.paymentMethod.toUpperCase()}%0A%0A*Items:*%0A${itemSummaryText}%0A%0A*Total Amount:* ${currencySymbol} ${order.total.toLocaleString()}%0A%0APlease confirm my order shipment!`;

  const cleanWhatsappPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappPhone}?text=${rawWhatsappMsg}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 text-center relative">
        
        {/* Banner */}
        <div className="bg-emerald-600 text-white p-8 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-3 border border-white/30 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black mb-1">Shukriya! Order Placed</h2>
          <p className="text-emerald-100 text-xs font-medium">
            Your order has been recorded successfully!
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-5 text-left text-xs">
          {/* Tracking ID card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-stone-400 font-bold block text-[10px] uppercase tracking-wider">
                Order Reference Number
              </span>
              <span className="text-lg font-black text-stone-900 tracking-wider font-mono">
                {order.id}
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-xs uppercase">
              {order.status}
            </span>
          </div>

          {/* Customer info */}
          <div className="space-y-2 text-stone-600 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-900">{order.customerName}</span> ({order.customerPhone})
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{order.address}, {order.city}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment: <strong className="uppercase text-stone-800">{order.paymentMethod}</strong></span>
            </div>
          </div>

          {/* Items breakdown */}
          <div>
            <h4 className="font-extrabold text-stone-900 text-xs mb-2 uppercase tracking-wider">
              Ordered Products ({order.items.length})
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-lg object-cover bg-white" />
                    <div>
                      <p className="font-bold text-stone-900 line-clamp-1">{item.productName}</p>
                      <span className="text-[10px] text-stone-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-stone-900">
                    {currencySymbol} {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-sm font-extrabold">
            <span className="text-stone-700">Total Payable Amount</span>
            <span className="text-emerald-700 font-black text-lg">
              {currencySymbol} {order.total.toLocaleString()}
            </span>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            {/* WhatsApp Confirmation Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all text-xs"
            >
              <MessageSquare className="w-4 h-4" /> Send Confirmation via WhatsApp
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.print()}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>

              <button
                onClick={onClose}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

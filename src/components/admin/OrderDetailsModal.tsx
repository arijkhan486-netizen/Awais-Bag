import React from 'react';
import { X, Phone, MapPin, Truck, Calendar, MessageSquare, Printer, Trash2 } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  currencySymbol?: string;
  whatsappNumber: string;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onDeleteOrder,
  currencySymbol = 'Rs.',
  whatsappNumber
}) => {
  if (!order) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    await onUpdateStatus(order.id, newStatus);
  };

  const handleDelete = async () => {
    if (window.confirm(`Kya aap order ${order.id} delete karna chahte hain?`)) {
      await onDeleteOrder(order.id);
      onClose();
    }
  };

  const cleanCustomerPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const customerWhatsappUrl = `https://wa.me/92${cleanCustomerPhone.startsWith('0') ? cleanCustomerPhone.slice(1) : cleanCustomerPhone}?text=Salam%20${encodeURIComponent(order.customerName)}!%20Aapka%20Order%20${order.id}%20status:%20${order.status.toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-stone-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm">
              {order.id.slice(-4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg">Order #{order.id}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Status Changer Bar */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-stone-800 block">Change Order Status (Halaat Badlein):</span>
              <span className="text-stone-500 text-[11px]">Update fulfillment state for customer tracking</span>
            </div>
            <select
              value={order.status}
              onChange={handleStatusChange}
              className="bg-white border border-stone-300 text-stone-900 font-extrabold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            >
              <option value="pending">⏳ Pending (Naya Order)</option>
              <option value="processing">⚙️ Processing (Paking Ho Rahi Hai)</option>
              <option value="shipped">🚚 Shipped (Courier Ko De Diya)</option>
              <option value="delivered">✅ Delivered (Pahunch Gaya)</option>
              <option value="cancelled">❌ Cancelled (Radd Ho Gaya)</option>
            </select>
          </div>

          {/* Customer & Shipping info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50/60 p-4 rounded-2xl border border-stone-200/70">
            <div className="space-y-2">
              <h4 className="font-extrabold text-stone-900 uppercase text-[10px] tracking-wider">
                Customer Contact
              </h4>
              <div className="font-bold text-stone-900 text-sm">{order.customerName}</div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <a href={`tel:${order.customerPhone}`} className="hover:underline font-mono">
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div className="text-stone-500 text-[11px]">{order.customerEmail}</div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-stone-900 uppercase text-[10px] tracking-wider">
                Shipping & Payment
              </h4>
              <div className="flex items-start gap-1.5 text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{order.address}, <strong>{order.city}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment: <strong className="uppercase font-bold text-stone-900">{order.paymentMethod}</strong></span>
              </div>
              {order.notes && (
                <div className="text-stone-500 bg-amber-50 border border-amber-200/60 p-2 rounded-lg text-[11px]">
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Products List */}
          <div>
            <h4 className="font-extrabold text-stone-900 uppercase text-[10px] tracking-wider mb-2">
              Order Items Breakdown ({order.items.length})
            </h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                    <div>
                      <p className="font-bold text-stone-900 text-xs">{item.productName}</p>
                      <span className="text-stone-500 text-[11px]">
                        {currencySymbol} {item.price.toLocaleString()} x {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-stone-900 text-xs">
                    {currencySymbol} {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-stone-900 text-white p-4 rounded-2xl space-y-1.5">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span>{currencySymbol} {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Shipping Delivery Fee</span>
              <span>{currencySymbol} {order.shippingFee.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>- {currencySymbol} {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-stone-800 pt-2 flex justify-between font-extrabold text-base">
              <span>Grand Total</span>
              <span className="text-emerald-400 text-lg font-black">
                {currencySymbol} {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
            <button
              onClick={handleDelete}
              className="text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete Order Record
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>

              <a
                href={customerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" /> Chat with Customer
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

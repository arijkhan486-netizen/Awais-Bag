import React, { useState } from 'react';
import { X, Truck, MessageSquare, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currencySymbol?: string;
  whatsappNumber: string;
  onPlaceOrder: (formData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
    city: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Promise<void>;
}

const CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Multan',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Other City'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  shippingFee,
  discount,
  total,
  currencySymbol = 'Rs.',
  whatsappNumber,
  onPlaceOrder
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !city.trim()) {
      setErrorMsg('Khabardar! Bara-e-karam tamam zaroori khana pur karein (Please fill all required fields).');
      return;
    }

    if (customerPhone.trim().length < 10) {
      setErrorMsg('Bara-e-karam sahi Phone Number likhein (Please enter a valid phone number).');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await onPlaceOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        address: address.trim(),
        city: city.trim(),
        paymentMethod,
        notes: notes.trim()
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Order place karne mein masla hua. Wapis koshish karein.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg">Checkout Order Form</h2>
              <p className="text-xs text-stone-300 font-medium">Complete details to place your order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-stone-400 tracking-wider">
              1. Customer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name (Poora Naam) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Usman"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phone Number (Mobile No.) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03001234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address (Optional for invoice)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-extrabold uppercase text-stone-400 tracking-wider">
              2. Delivery Address (Pata)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Address (Street / House / Area) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="House #, Street name, Area / Colony"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  City (Shehar) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Special Delivery Notes (Khaas hidayat)
              </label>
              <input
                type="text"
                placeholder="e.g. Call before arrival, deliver after 2 PM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-extrabold uppercase text-stone-400 tracking-wider">
              3. Payment Method (Tariqa-e-Adaigi)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                    <Truck className="w-4 h-4 text-emerald-600" /> Cash on Delivery (COD)
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Pay cash when rider delivers parcel to your doorstep.
                  </p>
                </div>
              </label>

              {/* WhatsApp Quick Order */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'whatsapp'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="whatsapp"
                  checked={paymentMethod === 'whatsapp'}
                  onChange={() => setPaymentMethod('whatsapp')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Direct Order
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Pre-fills invoice message to send directly on WhatsApp.
                  </p>
                </div>
              </label>

              {/* JazzCash / EasyPaisa */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="jazzcash"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                    <CreditCard className="w-4 h-4 text-emerald-600" /> JazzCash / EasyPaisa
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Send payment to mobile wallet and receive instant dispatch.
                  </p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="easypaisa"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Online Bank Transfer
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Direct transfer via IBAN / Mobile Banking app.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
              Order Summary ({cartItems.length} items)
            </h4>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-stone-600">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium">
                    {currencySymbol} {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between font-extrabold text-stone-900 text-sm">
              <span>Total Payable</span>
              <span className="text-emerald-700 font-black">
                {currencySymbol} {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Form Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer disabled:bg-stone-400"
            >
              {isSubmitting ? (
                <span>Placing Order... Please wait</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Confirm & Place Order ({currencySymbol} {total.toLocaleString()})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

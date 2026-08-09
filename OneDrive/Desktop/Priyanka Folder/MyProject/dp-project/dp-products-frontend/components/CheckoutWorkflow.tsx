import { ActiveView, CartItem } from '@/types';
import { useState } from 'react';
interface CheckoutWorkflowProps {
  cart: CartItem[];
  currentStep: ActiveView;
  setStep: (step: ActiveView) => void;
  onClearCart: () => void;
  onExitApp: () => void;
}

export default function CheckoutWorkflow({ cart, currentStep, setStep, onClearCart, onExitApp }: CheckoutWorkflowProps) {
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('UPI');

  // Math processors
  const baseTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const qualifiesDiscount = baseTotal > 5000;
  const discount = qualifiesDiscount ? 1000 : 0;
  const grandTotal = baseTotal - discount;

  if (currentStep === 'CART') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xl my-6 animate-fade-in">
        <h3 className="text-xl font-black text-slate-900 mb-4 flex justify-between items-center">
          <span>Review Your Shopping Cart</span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{cart.length} Unique Items</span>
        </h3>

        <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2 mb-6">
          {cart.map((item, index) => (
            <div key={index} className="py-4 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-slate-100 rounded-xl">{item.product.image_url}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{item.product.name}</h4>
                  <p className="text-xs text-slate-400">Unit Price: ₹{item.product.price}</p>
                </div>
              </div>
              <span className="text-sm font-black text-slate-900">Qty {item.quantity} = ₹{item.product.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 mb-6 text-sm">
          <div className="flex justify-between text-slate-600"><span>Cart Subtotal:</span><span>₹{baseTotal}</span></div>
          {qualifiesDiscount ? (
            <div className="flex justify-between text-emerald-600 font-bold"><span>DP Mega Deal Applied:</span><span>-₹1,000</span></div>
          ) : (
            <div className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
              💡 Tip: Add ₹{5000 - baseTotal} more worth of items to unlock an instant flat ₹1,000 discount!
            </div>
          )}
          <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-2 mt-2">
            <span>Final Amount Payable:</span><span>₹{grandTotal}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStep('BROWSE')} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition">Continue Shopping</button>
          <button onClick={() => setStep('PAYMENT')} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Proceed To Pay</button>
        </div>
      </div>
    );
  }

  if (currentStep === 'PAYMENT') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xl my-6 animate-fade-in">
        <h3 className="text-lg font-black text-slate-900 mb-1">Select Payment Gateway</h3>
        <p className="text-xs text-slate-400 mb-4">Amount to process: ₹{grandTotal}</p>

        <div className="space-y-3 mb-6">
          {(['UPI', 'COD', 'CARD'] as const).map((method) => (
            <label key={method} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
              paymentMethod === method ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="pay_opt" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-bold text-slate-800">
                  {method === 'UPI' && 'Mobile UPI (PhonePe / GPay)'}
                  {method === 'COD' && 'Cash on Delivery (COD)'}
                  {method === 'CARD' && 'Credit / Debit Card Online'}
                </span>
              </div>
            </label>
          ))}
        </div>

        <button onClick={() => setStep('SUCCESS')} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
          Authorize Secure Payment
        </button>
      </div>
    );
  }

  if (currentStep === 'SUCCESS') {
    return (
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xl my-6 animate-fade-in">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 font-black">✓</div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Payment Successful!</h3>
        <p className="text-xs text-slate-400 mb-6">Your order has been recorded into the secure system ledger database.</p>

        <div className="flex flex-col gap-2.5">
          <button onClick={() => setStep('TRACKING')} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition">
            Order Tracking Details Flow
          </button>
          <button onClick={() => { onClearCart(); setStep('BROWSE'); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold transition">
            Shop More Products
          </button>
          <button onClick={onExitApp} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition">
            Exit to Welcome Screen
          </button>
        </div>
      </div>
    );
  }

  // Live Logistics Map Tracking Component
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xl my-6 animate-fade-in">
      <h3 className="text-lg font-black text-slate-900 mb-4">Real-Time Logistics Tracker</h3>
      
      <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
        <div className="flex items-center gap-4 relative">
          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">✓</span>
          <div><p className="text-xs font-bold text-slate-800">Order Placed & Confirmed</p><p className="text-[10px] text-slate-400">Payment captured securely</p></div>
        </div>
        <div className="flex items-center gap-4 relative">
          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">✓</span>
          <div><p className="text-xs font-bold text-slate-800">Dispatched via Premium Freight</p><p className="text-[10px] text-slate-400">In transit from Bangalore Warehouse</p></div>
        </div>
        <div className="flex items-center gap-4 relative">
          <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-xs flex items-center justify-center font-bold">3</span>
          <div><p className="text-xs font-bold text-slate-400">Out for Local Delivery</p><p className="text-[10px] text-slate-300">Pending arrival at your local hub</p></div>
        </div>
      </div>

      <button onClick={() => { onClearCart(); setStep('BROWSE'); }} className="w-full bg-indigo-600 text-white mt-8 py-3 rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
        Return to Home Hub Catalog
      </button>
    </div>
  );
}

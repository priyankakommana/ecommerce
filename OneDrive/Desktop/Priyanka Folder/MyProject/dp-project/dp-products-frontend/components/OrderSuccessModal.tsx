import { CheckCircle } from 'lucide-react';
import { ProductItem } from '../types';

interface SuccessProps {
  cart: ProductItem[];
  onClose: () => void;
  onViewTracking: () => void;
  onExit: () => void;
}

export default function OrderSuccessModal({ cart, onClose, onViewTracking, onExit }: SuccessProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-6 border border-slate-100 animate-fade-in">
        <div className="flex flex-col items-center space-y-2">
          <CheckCircle size={56} className="text-emerald-500 animate-bounce" />
          <h3 className="text-xl font-black text-slate-900">Payment Successful!</h3>
          <p className="text-xs text-slate-400">Your order has been authorized and dispatched to packing</p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs max-h-24 overflow-y-auto scrollbar-none">
          <p className="font-bold mb-1 text-slate-500">Summary Matrix:</p>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between py-0.5">
              <span className="text-slate-700 line-clamp-1 w-2/3">{item.name}</span>
              <span className="font-black text-slate-900">₹{item.price}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button onClick={onViewTracking} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs transition">
            Order & Tracking Details
          </button>
          <button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition">
            Shop For More Products
          </button>
          <button onClick={onExit} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-2.5 rounded-xl font-bold text-xs transition border border-slate-200">
            Exit Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

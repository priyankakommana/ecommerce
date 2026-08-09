import { Trash2, X } from 'lucide-react';
import { ProductItem } from '../types';

interface CartModalProps {
  cart: ProductItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onProceed: () => void;
}

export default function CartModal({ cart, onClose, onRemove, onProceed }: CartModalProps) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const isDiscounted = total > 5000;
  const discount = isDiscounted ? 1000 : 0;
  const finalPayable = total - discount;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl animate-fade-in">
        <div>
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-xl font-black text-slate-900">Shopping Bag ({cart.length})</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[65vh] pr-1 scrollbar-none">
            {cart.length === 0 ? (
              <p className="text-center text-slate-400 py-12 text-sm font-medium">Your cart is currently empty.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 text-lg flex items-center justify-center rounded-lg">📦</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs font-black text-indigo-600">₹{item.price}</p>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t pt-4 bg-white space-y-4">
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal:</span><span className="font-bold">₹{total.toFixed(2)}</span></div>
            {isDiscounted ? (
              <div className="flex justify-between text-emerald-600 font-bold"><span>Mega Promo Applied:</span><span>-₹1000.00</span></div>
            ) : (
              total > 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                  💡 Add <b>₹{(5000 - total).toFixed(2)}</b> more to unlock flat <b>₹1,000 Off</b>!
                </div>
              )
            )}
            <div className="flex justify-between text-base font-black text-slate-900 border-t pt-2">
              <span>Final Payable:</span><span>₹{finalPayable.toFixed(2)}</span>
            </div>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={onProceed}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-100 text-sm"
          >
            Proceed to Secure Payment
          </button>
        </div>
      </div>
    </div>
  );
}

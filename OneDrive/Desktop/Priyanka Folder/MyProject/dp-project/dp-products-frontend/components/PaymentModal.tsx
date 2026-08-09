// import { ShieldCheck, X } from 'lucide-react';
// import { useState } from 'react';
// import { ProductItem } from '../types';

// interface PaymentModalProps {
//   cart: ProductItem[];
//   onClose: () => void;
//   onPaymentSuccess: () => void;
// }

// export default function PaymentModal({ cart, onClose, onPaymentSuccess }: PaymentModalProps) {
//   const [method, setMethod] = useState<'COD' | 'UPI' | 'CARD'>('UPI');
//   const total = cart.reduce((sum, item) => sum + item.price, 0);
//   const finalPrice = total > 5000 ? total - 1000 : total;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6 animate-fade-in border border-slate-100">
//         <div className="flex justify-between items-center border-b pb-3">
//           <h3 className="text-lg font-black text-slate-800">Secure Settlement Hub</h3>
//           <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
//         </div>

//         <div className="space-y-3">
//           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Payment Route</p>
//           {[
//             { id: 'UPI', title: 'Instant UPI (GPay/PhonePe)', icon: '📱' },
//             { id: 'CARD', title: 'Credit / Debit Card Gateway', icon: '💳' },
//             { id: 'COD', title: 'Cash On Delivery (COD)', icon: '💵' }
//           ].map((opt) => (
//             <label 
//               key={opt.id} 
//               className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
//                 method === opt.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <span className="text-xl">{opt.icon}</span>
//                 <span className="text-sm font-bold text-slate-700">{opt.title}</span>
//               </div>
//               <input 
//                 type="radio" 
//                 name="payMethod" 
//                 checked={method === opt.id} 
//                 onChange={() => setMethod(opt.id as 'COD' | 'UPI' | 'CARD')}
//                 className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
//               />
//             </label>
//           ))}
//         </div>

//         {method === 'CARD' && (
//           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 animate-fade-in">
//             <input type="text" placeholder="Card Number (16 Digits)" className="w-full p-2.5 bg-white border border-slate-300 rounded-xl" />
//             <div className="grid grid-cols-2 gap-2">
//               <input type="text" placeholder="MM/YY" className="p-2.5 bg-white border border-slate-300 rounded-xl text-center" />
//               <input type="password" placeholder="CVV" className="p-2.5 bg-white border border-slate-300 rounded-xl text-center" />
//             </div>
//           </div>
//         )}

//         <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
//           <div>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Chargeable Amount</p>
//             <p className="text-xl font-black text-amber-400">₹{finalPrice.toFixed(2)}</p>
//           </div>
//           <div className="flex items-center gap-1 text-[10px] bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg font-bold border border-emerald-500/20">
//             <ShieldCheck size={12} /> 256-BIT SSL
//           </div>
//         </div>

//         <button 
//           onClick={onPaymentSuccess}
//           className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition text-sm shadow-xl shadow-emerald-100"
//         >
//           Authorize Secure Transaction
//         </button>
//       </div>
//     </div>
//   );
// }
import { ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { ProductItem, UserProfile } from '../types';
import { API } from '../utils/api';

interface PaymentModalProps {
  cart: ProductItem[];
  user: UserProfile | null; // 💡 Passed to track email and address records dynamically
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({ cart, user, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<'COD' | 'UPI' | 'CARD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const finalPrice = total > 5000 ? total - 1000 : total;

  // NEW NETWORK WORKFLOW: Processes the checkout logic in Spring Boot before advancing
  const handlePaymentSubmit = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      await API.checkoutCart(
        user?.id || 0,
        finalPrice,
        method,
        user?.address || "No address specified",
        user?.email || undefined // 🚀 Sends the active email directly to your backend mail engine
      );
      
      onPaymentSuccess();
    } catch (err) {
      console.error("Order processing failed:", err);
      alert("Failed to securely confirm the transaction. Check your server status logs.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6 animate-fade-in border border-slate-100">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-black text-slate-800">Secure Settlement Hub</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Payment Route</p>
          {[
            { id: 'UPI', title: 'Instant UPI (GPay/PhonePe)', icon: '📱' },
            { id: 'CARD', title: 'Credit / Debit Card Gateway', icon: '💳' },
            { id: 'COD', title: 'Cash On Delivery (COD)', icon: '💵' }
          ].map((opt) => (
            <label 
              key={opt.id} 
              className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                method === opt.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{opt.icon}</span>
                <span className="text-sm font-bold text-slate-700">{opt.title}</span>
              </div>
              <input 
                type="radio" 
                name="payMethod" 
                checked={method === opt.id} 
                onChange={() => setMethod(opt.id as 'COD' | 'UPI' | 'CARD')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
              />
            </label>
          ))}
        </div>

        {method === 'CARD' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 animate-fade-in">
            <input type="text" placeholder="Card Number (16 Digits)" className="w-full p-2.5 bg-white border border-slate-300 rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="MM/YY" className="p-2.5 bg-white border border-slate-300 rounded-xl text-center" />
              <input type="password" placeholder="CVV" className="p-2.5 bg-white border border-slate-300 rounded-xl text-center" />
            </div>
          </div>
        )}

        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Chargeable Amount</p>
            <p className="text-xl font-black text-amber-400">₹{finalPrice.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg font-bold border border-emerald-500/20">
            <ShieldCheck size={12} /> 256-BIT SSL
          </div>
        </div>

        <button 
          type="button"
          disabled={isProcessing}
          onClick={handlePaymentSubmit} // 💡 Triggers our network function rather than just shifting local panels
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold transition text-sm shadow-xl shadow-emerald-100"
        >
          {isProcessing ? "Verifying Transaction..." : "Authorize Secure Transaction"}
        </button>
      </div>
    </div>
  );
}

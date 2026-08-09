import { Check, X } from 'lucide-react';

export default function TrackingModal({ onClose }: { onClose: () => void }) {
  const roadmap = [
    { title: 'Order Confirmed & Logged', desc: 'System matched inventory allocations', complete: true },
    { title: 'Dispatched via Premium Carrier', desc: 'Handed off to prioritized tracking network', complete: true },
    { title: 'Out For Delivery Hub routing', desc: 'Assigned to neighborhood delivery agent', complete: false }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6 animate-fade-in border border-slate-100">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-black text-slate-800">Live Logistics Routing Flow</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100 pl-2">
          {roadmap.map((step, idx) => (
            <div key={idx} className="flex gap-4 relative items-start">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                step.complete ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
              }`}>
                {step.complete ? <Check size={12} /> : (idx + 1)}
              </div>
              <div>
                <p className={`text-sm font-bold ${step.complete ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg">
          Return To Storefront
        </button>
      </div>
    </div>
  );
}

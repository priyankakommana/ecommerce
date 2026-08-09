import { Bot, Send, X } from 'lucide-react';
import { useState } from 'react';

export default function HelpModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'TC' | 'BOT'>('TC');
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState<{ sender: 'U' | 'B'; txt: string }[]>([
    { sender: 'B', txt: 'Hello! I am DP Bot. Ask me anything about offers or tracking.' }
  ]);

  const handleSend = () => {
    if (!msg.trim()) return;
    const userMsg = msg;
    setChat(p => [...p, { sender: 'U', txt: userMsg }]);
    setMsg('');
    setTimeout(() => {
      setChat(p => [...p, { sender: 'B', txt: 'Thank you for reaching out! Our team is processing your request.' }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md h-[550px] shadow-2xl flex flex-col justify-between animate-fade-in border border-slate-100">
        <div>
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button onClick={() => setTab('TC')} className={`px-3 py-1.5 rounded-lg ${tab === 'TC' ? 'bg-white shadow' : 'text-slate-500'}`}>Terms & Rules</button>
              <button onClick={() => setTab('BOT')} className={`px-3 py-1.5 rounded-lg ${tab === 'BOT' ? 'bg-white shadow' : 'text-slate-500'}`}>Support Chatbot</button>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={18} /></button>
          </div>

          {tab === 'TC' ? (
            <div className="space-y-3 text-slate-600 text-xs overflow-y-auto max-h-[380px] pr-1">
              <h4 className="font-bold text-slate-800 text-sm">Corporate Terms & Standard Operation Conditions</h4>
              <p>1. <b>Instant Mega Rebates:</b> Cart valuations aggregating greater than ₹5,000 unlock an automated ₹1,000 threshold discount deduction.</p>
              <p>2. <b>Delivery Frameworks:</b> Premium options guarantee express distribution tracking protocols.</p>
              <p>3. <b>Return Protocols:</b> Exit functions clear execution parameters automatically returning users to splash configurations.</p>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col h-[380px] justify-between">
              <div className="space-y-2 overflow-y-auto pr-1 flex-1 scrollbar-none">
                {chat.map((c, i) => (
                  <div key={i} className={`flex gap-2 max-w-[85%] p-3 rounded-2xl text-xs ${c.sender === 'U' ? 'bg-indigo-600 text-white ml-auto' : 'bg-slate-100 text-slate-700'}`}>
                    {c.sender === 'B' && <Bot size={14} className="mt-0.5 text-indigo-600 shrink-0" />}
                    <p>{c.txt}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t pt-3">
                <input 
                  type="text" 
                  placeholder="Type support query..." 
                  value={msg} 
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs focus:outline-indigo-600" 
                />
                <button onClick={handleSend} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition"><Send size={14} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


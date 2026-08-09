import React, { useState } from 'react';

interface HelpDeskModalProps {
  onClose: () => void;
}

export default function HelpDeskModal({ onClose }: HelpDeskModalProps) {
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user', text: string }[]>([
    { sender: 'bot', text: 'Hello! Welcome to DP Products Support. How can I help you with your order today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    // Automated reactive simulation reply logic
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `Thanks for messaging! I am testing live. Once your Spring Boot endpoints are connected, I will trace real data for: "${userText}".` 
      }]);
    }, 8000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[550px] animate-fade-in">
        
        {/* Left Half: Legal Terms Policy */}
        <div className="w-full md:w-1/2 p-6 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto">
          <h3 className="text-lg font-black text-slate-900 mb-3">Terms & Conditions</h3>
          <div className="text-xs text-slate-500 space-y-3 leading-relaxed">
            <p><strong>1. Instant Discount Rules:</strong> The special flat ₹1,000 deduction automatically unlocks if the total item collection value strictly crosses a benchmark threshold of ₹5,000.</p>
            <p><strong>2. Return & Refunds:</strong> Customers can initiate returns through the system panel within a window of 7 business tracking updates.</p>
            <p><strong>3. Shipping Logistics:</strong> Premium fast-track carriers manage logistics. Delivery estimates display transparent statuses on the live tracker.</p>
          </div>
        </div>

        {/* Right Half: Live Dynamic AI Assistant Hub */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white">
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shadow-md">
            <div>
              <h4 className="font-bold text-sm">DP Live Support Bot</h4>
              <p className="text-[10px] text-indigo-200">Online & ready to guide</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-indigo-200 font-bold text-sm bg-indigo-700/50 px-2.5 py-1 rounded-lg transition">✕</button>
          </div>

          {/* Interactive Core Box Grid */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-normal shadow-sm ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* INJECTING CONTINUATION POINT FROM YOUR SELECTION REFERENCE */}
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-center">
              <p className="text-xs font-bold text-indigo-800 mb-1.5">Need interactive real-time updates?</p>
              <button 
                type="button"
                onClick={() => setMessages(prev => [...prev, { sender: 'bot', text: 'Connecting to live telemetry systems... Operational updates will appear when Spring Boot goes live.' }])}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-3 py-1 rounded-md font-bold transition shadow-sm"
              >
                Sync Spring Boot Connection API
              </button>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Ask support anything..." 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition">Send</button>
          </form>
        </div>

      </div>
    </div>
  );
}

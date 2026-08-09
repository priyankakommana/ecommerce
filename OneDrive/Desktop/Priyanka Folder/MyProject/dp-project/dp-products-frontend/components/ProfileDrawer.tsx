import { CheckCircle, ClipboardList, Edit, Package, Truck, X } from 'lucide-react';
import { useState } from 'react';
import { UserProfile } from '../types';
import { API } from '../utils/api';
import { MOCK_ORDERS_HISTORY } from '../utils/mockData';

interface ProfileDrawerProps {
  user: UserProfile | null;
  onLogout: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onClose: () => void;
}

export default function ProfileDrawer({ user, onLogout, onUpdateProfile, onClose }: ProfileDrawerProps) {
  const [subTab, setSubTab] = useState<'EDIT' | 'ORDERS'>('EDIT');
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');

//   const handleSaveProfile = () => {
//     onUpdateProfile({
//       name: editName,
//       phone: editPhone,
//       address: editAddress,
//       email: user?.email || ''
//     });
//     alert("Configuration parameters updated successfully!");
//   };
const handleSaveProfile = async () => {
  if (!user?.id) return;
  
  try {
    const updatedPayload = {
      name: editName,
      phone: editPhone,
      address: editAddress, // Your fresh input text modifications
      email: user.email
    };
    
    // Connects to Spring Boot network service layer
    const refreshedUser = await API.updateUserAddress(user.id, updatedPayload);
    
    // Bubble up state updates to index.tsx so your browser updates immediately
    onUpdateProfile(refreshedUser);
    alert("Database update successful! Your new address is now locked in MySQL.");
  } catch (err) {
    console.error("Failed to commit profile updates to server database logs", err);
  }
};

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-slate-200 mt-4 shadow-2xl space-y-4 animate-fade-in mx-4 md:mx-auto relative">
      <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-100 text-slate-400">
        <X size={16} />
      </button>

      {/* Switcher Navigation Controls */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
        <button 
          onClick={() => setSubTab('EDIT')} 
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${subTab === 'EDIT' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
        >
          <Edit size={14}/> Parameters
        </button>
        <button 
          onClick={() => setSubTab('ORDERS')} 
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition ${subTab === 'ORDERS' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
        >
          <ClipboardList size={14}/> Orders Logs
        </button>
      </div>

      {subTab === 'EDIT' ? (
        /* PANEL A: EDIT CONFIGURATIONS SCREEN */
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2.5 text-xs">
            <label className="block text-slate-500 font-medium">Customer Full Name</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600" />
            
            <label className="block text-slate-500 font-medium">Contact Mobile Line</label>
            <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:outline-indigo-600" />
            
            <label className="block text-slate-500 font-medium">Geographical Shipping Address</label>
            <textarea value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="w-full p-2.5 border rounded-xl h-20 bg-slate-50 focus:bg-white focus:outline-indigo-600 resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSaveProfile} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition">Save Data</button>
            <button onClick={onLogout} className="px-4 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold transition">Logout</button>
          </div>
        </div>
      ) : (
        /* PANEL B: PREVIOUS ORDERS & LIVE WORKFLOW TRACKER */
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 scrollbar-none animate-fade-in">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Historical Logs Matrix</h4>
          
          {MOCK_ORDERS_HISTORY.map((ord) => (
            <div key={ord.orderId} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                <div>
                  <p className="text-xs font-black text-slate-800">{ord.orderId}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{ord.date} • {ord.paymentMethod}</p>
                </div>
                
                {/* Visual Tracker Status Pill */}
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                  ord.trackingStatus === 'DELIVERED' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {ord.trackingStatus === 'DELIVERED' ? <CheckCircle size={10}/> : <Truck size={10}/>}
                  {ord.trackingStatus}
                </span>
              </div>

              {/* Sub-item map layout inside loop cards */}
              <div className="space-y-1 text-xs">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600">
                    <span className="truncate max-w-[200px] flex items-center gap-1"><Package size={10}/> {item.name}</span>
                    <span className="font-bold text-slate-900">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-white p-2 border rounded-xl text-xs font-black text-slate-800">
                <span>Total Chargeable:</span>
                <span className="text-indigo-600">₹{ord.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

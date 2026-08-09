import { ArrowLeftRight, HelpCircle, Search, ShoppingCart, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ActiveView, ProductItem, UserProfile } from '../types';
import { API } from '../utils/api';
import { CATEGORIES } from '../utils/mockData';

// Child Page Component Imports
import CartModal from './CartModal';
import HelpModal from './HelpModal';
import OrderSuccessModal from './OrderSuccessModal';
import PaymentModal from './PaymentModal';
import ProfileDrawer from './ProfileDrawer';
import TrackingModal from './TrackingModal';

interface HomeHubProps {
  user: UserProfile | null;
  onLogout: () => void;
  onExit: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function HomeHubView({ user, onLogout, onExit, onUpdateProfile }: HomeHubProps) {
  const [view, setView] = useState<ActiveView>('BROWSE');
  // Initialize to track the first category array context from your navigation track
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<ProductItem[]>([]);
  const [isEditProfile, setIsEditProfile] = useState(false);
  
  // Dynamic network state manager replacing local array states
  const [productsList, setProductsList] = useState<ProductItem[]>([]);

  // LIVE NETWORK PIPELINE ENGINE: Syncs database values dynamically with your UI
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        // Calls your Spring Boot controller layer with active search queries or category IDs
        const data = await API.getProducts(activeCat.id, search);
        setProductsList(data);
      } catch (err) {
        console.error("Data pipeline broken: failed to connect to Spring Boot context", err);
      }
    };
    
    fetchLiveProducts();
  }, [activeCat.id, search]); // Instant hot-reload listener!

  const addToCart = (product: ProductItem) => setCart([...cart, product]);
  const removeFromCart = (id: number) => setCart(cart.filter(item => item.id !== id));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Interactive Promotional Offers Banner */}
      <div className="bg-amber-400 text-slate-900 text-xs md:text-sm font-bold py-2.5 px-4 text-center flex justify-between items-center overflow-x-auto whitespace-nowrap scrollbar-none gap-8 shadow-sm">
        <button 
          onClick={() => setSearch('Jacket')} 
          className="hover:underline hover:text-indigo-800 transition text-left cursor-pointer active:scale-95 shrink-0"
        >
          🎉 Special Store Promotion: Flat 15% OFF Base Catalog Pricing!
        </button>
        <button 
          onClick={() => setSearch('Premium')} 
          className="hover:underline hover:text-indigo-800 transition text-left cursor-pointer active:scale-95 shrink-0"
        >
          👥 Refer your friends & earn ₹250 instant cashbacks!
        </button>
        <button 
          onClick={() => setSearch('Smartphone')} 
          className="hover:underline hover:text-indigo-800 transition text-left cursor-pointer active:scale-95 shrink-0"
        >
          🚀 Premium express cargo delivery channels active!
        </button>
      </div>

      {/* Global Shopping Navigation Bar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm max-w-7xl mx-auto rounded-xl mt-2 px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-black text-indigo-600 tracking-tight shrink-0">DP PRODUCTS</h2>
        
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search items, categories or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-6 text-slate-600 text-xs font-bold shrink-0">
          <button onClick={() => setIsEditProfile(!isEditProfile)} className="flex items-center gap-1.5 hover:text-indigo-600 transition">
            <User size={16} /> Profile
          </button>
          <button onClick={() => setView('CART')} className="flex items-center gap-1.5 hover:text-indigo-600 transition relative">
            <ShoppingCart size={16} /> Cart 
            <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center absolute -top-2 -right-3 font-black">
              {cart.length}
            </span>
          </button>
          <button onClick={() => setView('HELP')} className="flex items-center gap-1.5 hover:text-indigo-600 transition">
            <HelpCircle size={16} /> Help
          </button>
        </div>
      </header>

      {/* Embedded Refactored Profile Component Section */}
      {isEditProfile && (
        <ProfileDrawer 
          user={user}
          onLogout={onLogout}
          onUpdateProfile={onUpdateProfile}
          onClose={() => setIsEditProfile(false)}
        />
      )}

      {view === 'BROWSE' && (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Touch Scrollable Categories track navigation bar field */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSearch(''); // Clears the ribbon/text search to display category matches instead
                  setActiveCat(cat);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition snap-center ${
                  activeCat.id === cat.id && !search
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon_name}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Active Offers Campaign Notification Block */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <p className="text-indigo-400 font-bold uppercase tracking-wide">Category Campaign Discount</p>
              <h4 className="text-slate-800 font-black text-sm mt-0.5">{search ? 'Dynamic Search Matches' : activeCat.current_offer}</h4>
            </div>
            <div className="flex gap-1 bg-white px-2.5 py-1 rounded-lg border text-indigo-600 font-bold border-indigo-100 items-center">
              <ArrowLeftRight size={12} /> Swipe
            </div>
          </div>

          {/* Main Grid Catalog Product Field Displays (Fed dynamically via Spring Boot API list state) */}
          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsList.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-medium text-sm">
                No active inventory matches found for your current criteria.
              </div>
            ) : (
              productsList.map((prod) => (
                <div key={prod.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition group">
                  <div>
                    <div className="w-full h-40 bg-gradient-to-tr from-slate-100 to-indigo-50/30 rounded-2xl mb-4 flex items-center justify-center text-slate-300 text-3xl group-hover:scale-[1.01] transition-transform">🛍️</div>
                    <h4 className="font-black text-slate-800 text-base">{prod.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-medium">{prod.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-4">
                    <span className="text-lg font-black text-slate-900">₹{prod.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(prod)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-indigo-50"
                    >
                      + Add To Bag
                    </button>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      )}

      {/* Dynamic Workflow Modals Mapping System */}
      {view === 'CART' && (
        <CartModal cart={cart} onClose={() => setView('BROWSE')} onRemove={removeFromCart} onProceed={() => setView('PAYMENT')} />
      )}
      {view === 'PAYMENT' && (
        <PaymentModal 
          cart={cart} 
          user={user} // 🚀 Pass the active user prop down into the payment system here!
          onClose={() => setView('BROWSE')} 
          onPaymentSuccess={() => setView('SUCCESS')} 
        />
      )}
      {view === 'SUCCESS' && (
        <OrderSuccessModal cart={cart} onClose={() => { setCart([]); setView('BROWSE'); }} onViewTracking={() => setView('TRACKING')} onExit={onExit} />
      )}
      {view === 'TRACKING' && (
        <TrackingModal onClose={() => { setCart([]); setView('BROWSE'); }} />
      )}
      {view === 'HELP' && (
        <HelpModal onClose={() => setView('BROWSE')} />
      )}
    </div>
  );
}

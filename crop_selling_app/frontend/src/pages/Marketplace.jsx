import React, { useState, useEffect } from 'react';
import { Search, MapPin, Scale, MessageCircle, Navigation2 } from 'lucide-react';
import api from '../api/axios';
import ContactModal from '../components/ContactModal';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPincode, setSearchPincode] = useState('');
  const [debouncedPincode, setDebouncedPincode] = useState('');
  
  const [modalState, setModalState] = useState({ isOpen: false, listingId: null, farmerName: '' });

  // Debounce logic for pincode searching
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedPincode(searchPincode), 400);
    return () => clearTimeout(handler);
  }, [searchPincode]);

  // Fetch logic
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const url = debouncedPincode ? `/listings?pincode=${debouncedPincode}` : `/listings`;
        const res = await api.get(url);
        setListings(res.data);
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [debouncedPincode]);

  const openContact = (listingId, farmerName) => {
    setModalState({ isOpen: true, listingId, farmerName });
  };

  const closeContact = () => {
    setModalState({ isOpen: false, listingId: null, farmerName: '' });
  };

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200 gap-4 text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Active Marketplace</h1>
          <p className="text-slate-500 mt-1">Connect with local farmers and source fresh produce instantly.</p>
        </div>
        
        <div className="relative max-w-sm w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition tracking-wider"
            placeholder="Search by Pincode..."
            value={searchPincode}
            onChange={(e) => setSearchPincode(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-slate-100 rounded-2xl p-12 text-center text-slate-500 border border-slate-200 border-dashed">
          <Navigation2 className="h-10 w-10 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-800">No Listings Found</h3>
          <p className="mt-1">We couldn't find any produce matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map(item => (
            <div key={item._id} className="bg-white border text-left border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 rounded-2xl flex flex-col group hover:-translate-y-1">
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center group-hover:bg-emerald-50 transition-colors">
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">{item.cropName}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-1 inline-block">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-800 tracking-tight">₹{item.totalPrice}</div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Total</div>
                </div>
              </div>
              
              <div className="px-6 py-6 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <Scale className="h-5 w-5 text-slate-400 mr-3.5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.amountKg} kg available</p>
                      <p className="text-xs text-slate-500 mt-0.5">at ₹{item.pricePerKg} per kg</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-slate-400 mr-3.5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Farmer: {item.farmerName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Pincode: {item.pincode}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => openContact(item._id, item.farmerName)}
                  className="w-full mt-auto flex items-center justify-center border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 py-2.5 rounded-xl font-bold shadow-sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Farmer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactModal 
        isOpen={modalState.isOpen} 
        onClose={closeContact} 
        listingId={modalState.listingId} 
        farmerName={modalState.farmerName} 
      />
    </div>
  );
};

export default Marketplace;

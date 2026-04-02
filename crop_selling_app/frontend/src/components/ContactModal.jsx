import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

const ContactModal = ({ isOpen, onClose, listingId, farmerName }) => {
  const [formData, setFormData] = useState({ buyerName: '', buyerPhone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', { ...formData, listingId });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ buyerName: '', buyerPhone: '', message: '' });
        onClose();
      }, 2500); // Wait bit to show success msg
    } catch (err) {
      alert('Error sending message: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative border border-slate-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-left">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact {farmerName}</h2>
          <p className="text-slate-500 text-sm mb-6">Send an enquiry directly to the farmer to discuss terms or finalize a purchase.</p>
          
          {isSuccess ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-xl flex items-center justify-center font-medium animate-pulse">
              Message sent successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                <input 
                  type="text" required
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Phone</label>
                <input 
                  type="tel" required
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.buyerPhone}
                  onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Message (Optional)</label>
                <textarea 
                  rows="3"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="I am interested in buying..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

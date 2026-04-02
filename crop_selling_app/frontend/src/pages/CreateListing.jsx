import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CROP_CATEGORIES, CATEGORY_NAMES } from '../utils/constants';

const CreateListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farmerName: '',
    category: '',
    cropName: '',
    pincode: '',
    amountKg: '',
    pricePerKg: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');

  const availableCrops = formData.category ? CROP_CATEGORIES[formData.category] : [];
  
  const totalPrice = 
    (parseFloat(formData.amountKg) || 0) * (parseFloat(formData.pricePerKg) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMSG('');
    try {
      await api.post('/listings', {
        ...formData,
        amountKg: parseFloat(formData.amountKg),
        pricePerKg: parseFloat(formData.pricePerKg)
      });
      // Route back to marketplace on success
      navigate('/');
    } catch (err) {
      setErrorMSG(err.response?.data?.error || 'Error creating listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6 border-b pb-4">Create New Listing</h1>
      
      {errorMSG && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{errorMSG}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Farmer Name</label>
          <input 
            type="text" 
            required 
            className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.farmerName}
            onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select 
              required
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value, cropName: ''})}
            >
              <option value="">Select Category</option>
              {CATEGORY_NAMES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Crop Name</label>
            <select 
              required
              disabled={!formData.category}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 flex-1"
              value={formData.cropName}
              onChange={(e) => setFormData({...formData, cropName: e.target.value})}
            >
              <option value="">Select specific crop</option>
              {availableCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
          <input 
            type="text" 
            required
            pattern="[0-9]{6}" 
            title="6 digit postal code"
            className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount to Sell (kg)</label>
            <input 
              type="number" 
              required
              min="1"
              step="any"
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.amountKg}
              onChange={(e) => setFormData({...formData, amountKg: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Kg (₹)</label>
            <input 
              type="number" 
              required
              min="0.1"
              step="any"
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.pricePerKg}
              onChange={(e) => setFormData({...formData, pricePerKg: e.target.value})}
            />
          </div>
        </div>

        <div className="bg-slate-100 p-4 border border-slate-200 rounded-xl flex justify-between items-center text-lg mt-6">
          <span className="font-medium text-slate-600">Total Estimated Price:</span>
          <span className="font-bold text-emerald-700 text-2xl">₹{totalPrice.toFixed(2)}</span>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Creating...' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;

import React, { useState } from 'react';
import { Calculator as CalcIcon, TrendingUp, TrendingDown, Info, PackageX, Scale } from 'lucide-react';
import api from '../api/axios';

const Calculator = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    currentPricePerKg: '',
    amountKg: '',
    daysToHold: '',
    dailyStorageCostPerKg: '',
    spoilageRiskPercentage: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMSG, setErrorMSG] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMSG('');
    setResult(null);

    try {
      const res = await api.post('/calculator/hold-vs-sell', {
        cropName: formData.cropName,
        currentPricePerKg: parseFloat(formData.currentPricePerKg),
        amountKg: parseFloat(formData.amountKg),
        daysToHold: parseInt(formData.daysToHold),
        dailyStorageCostPerKg: parseFloat(formData.dailyStorageCostPerKg),
        spoilageRiskPercentage: parseFloat(formData.spoilageRiskPercentage),
      });

      setResult(res.data);
    } catch (err) {
      setErrorMSG(err.response?.data?.error || 'Failed to calculate projection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center">
          <CalcIcon className="w-8 h-8 mr-3 text-emerald-600" />
          Hold vs Sell Calculator
        </h1>
        <p className="text-slate-500 mt-2">Data-driven analysis to determine whether to liquidate inventory now or hold for future appreciation.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-5/12 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit shrink-0">
          <h2 className="text-xl font-bold border-b pb-3 mb-5 text-slate-800">Parameters</h2>
          
          {errorMSG && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">{errorMSG}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Crop Name</label>
              <input 
                type="text" required
                className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={formData.cropName} onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                placeholder="e.g. Wheat"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Price (₹/kg)</label>
                <input 
                  type="number" required min="0.1" step="any"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={formData.currentPricePerKg} onChange={(e) => setFormData({...formData, currentPricePerKg: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Total Yield (kg)</label>
                <input 
                  type="number" required min="1" step="any"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={formData.amountKg} onChange={(e) => setFormData({...formData, amountKg: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Hold Period (Days)</label>
              <input 
                type="number" required min="1" step="1"
                className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                value={formData.daysToHold} onChange={(e) => setFormData({...formData, daysToHold: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Storage Cost (₹/kg/day)</label>
                <input 
                  type="number" required min="0" step="any"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={formData.dailyStorageCostPerKg} onChange={(e) => setFormData({...formData, dailyStorageCostPerKg: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Spoilage Risk (%)</label>
                <input 
                  type="number" required min="0" max="100" step="any"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  value={formData.spoilageRiskPercentage} onChange={(e) => setFormData({...formData, spoilageRiskPercentage: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-75 disabled:cursor-wait"
              >
                {isLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  'Run Analysis'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-7/12 flex flex-col">
          {!result ? (
            <div className="flex-1 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 min-h-[400px]">
              <CalcIcon className="w-16 h-16 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-500">Awaiting Data</h3>
              <p className="mt-2 text-center max-w-sm">Enter your inventory parameters and click evaluate to generate profit projections.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-[fadeIn_0.5s_ease-out]">
              <div className={`p-4 rounded-2xl mb-6 flex items-center shadow-sm border ${result.recommendHolding ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                <div className={`p-3 rounded-full mr-4 ${result.recommendHolding ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {result.recommendHolding ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${result.recommendHolding ? 'text-emerald-700' : 'text-rose-700'}`}>
                    AI System Recommendation
                  </h3>
                  <p className={`text-2xl font-black ${result.recommendHolding ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {result.recommendHolding ? "HOLD THE ASSET" : "LIQUIDATE IMMEDIATELY"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Sell Today Card */}
                <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Sell Today</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-500 flex items-center"><Info className="w-4 h-4 mr-1.5"/> Revenue</span>
                        <span className="font-semibold text-slate-700">₹{result.profitIfSoldToday.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-500 flex items-center"><PackageX className="w-4 h-4 mr-1.5"/> Storage Cost</span>
                        <span className="font-semibold text-emerald-600">- ₹0.00</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-500 flex items-center"><Scale className="w-4 h-4 mr-1.5"/> Spoilage Impact</span>
                        <span className="font-semibold text-emerald-600">- ₹0.00</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold tracking-widest uppercase text-slate-400">Net Profit</span>
                      <span className="text-2xl font-black text-slate-900">₹{result.profitIfSoldToday.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Hold Card */}
                <div className="bg-white border text-left rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-bl-[100px] -z-10 opacity-60"></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Hold for {formData.daysToHold} Days</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-500 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1.5 text-indigo-400"/> Projected Value
                        </span>
                        <span className="font-semibold text-slate-700">₹{(result.predictedFuturePrice * formData.amountKg).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-500 flex items-center text-rose-400"><PackageX className="w-4 h-4 mr-1.5"/> Storage Cost</span>
                        <span className="font-semibold text-rose-600">- ₹{result.storageCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-500 flex items-center text-rose-400"><Scale className="w-4 h-4 mr-1.5"/> Risk Spoilage</span>
                        <span className="font-semibold text-rose-600">- ₹{result.spoilageLoss.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold tracking-widest uppercase text-slate-400">Net Profit</span>
                      <span className="text-2xl font-black text-indigo-900">₹{result.profitIfHeld.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;

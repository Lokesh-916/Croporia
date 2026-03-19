import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const CROPS = [
  'Nothing yet / Fallow','Tomato','Brinjal','Okra','Chilli','Onion','Potato','Cauliflower',
  'Cabbage','Spinach','Bitter Gourd','Bottle Gourd','Carrot','Mango','Banana','Papaya',
  'Guava','Watermelon','Pomegranate','Coconut','Lemon','Sapota','Jackfruit','Rice','Wheat',
  'Maize','Groundnut','Sunflower','Soybean','Cotton','Sugarcane','Turmeric','Red Gram',
  'Blackgram','Coriander','Fenugreek','Ginger','Garlic','Mint','Curry Leaf','Aloe Vera',
  'Lemongrass','Ashwagandha','Tulsi',
];

const WATER_OPTIONS = [
  { value: 'Borewell', icon: '💧' },
  { value: 'Canal', icon: '🌊' },
  { value: 'Rain-fed', icon: '🌧' },
  { value: 'Tank / Pond', icon: '🪣' },
];

const SOIL_TYPES = [
  { value: 'Clay',     icon: '🟤', color: '#a16207' },
  { value: 'Loamy',   icon: '🟫', color: '#78350f' },
  { value: 'Sandy',   icon: '🏜',  color: '#d97706' },
  { value: 'Black (Regur)', icon: '⬛', color: '#18181b' },
  { value: 'Red',     icon: '🔴', color: '#dc2626' },
  { value: 'Laterite',icon: '🪨', color: '#92400e' },
];

const STEPS = [
  { label: 'Field Basics', description: 'Basic information to identify and locate your plot.' },
  { label: 'Soil Details', description: 'The more accurate you are, the better your crop recommendations.' },
  { label: 'Crop Plans',   description: 'This helps us give you a head start on planning.' },
];

const INITIAL_DATA = {
  fieldName: '', landSize: '', landUnit: 'Acres', location: '', waterSource: '',
  soilType: '', phLevel: 6.5, nitrogen: '', phosphorus: '', potassium: '', lastCrop: '',
  currentCrop: '', sowingDate: '', nextCrop: '', season: '', labourCount: 5, notes: '',
};

// ─── Step Progress Bar ───────────────────────────────────────────────────────
function ProgressBar({ current }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={num} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
                  done   ? 'bg-[#1a3d0a] border-[#1a3d0a] text-white' :
                  active ? 'bg-[#4caf50] border-[#4caf50] text-white scale-110' :
                           'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {done ? '✓' : num}
              </div>
              <span className={`text-[10px] font-bold mt-1 uppercase tracking-wide ${active ? 'text-green-700' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-18px]" style={{ backgroundColor: done ? '#1a3d0a' : '#e5e7eb' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Input Component ─────────────────────────────────────────────────────────
function Field({ label, helper, error, children }) {
  return (
    <div className="mb-5">
      {label && <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{label}</label>}
      {children}
      {helper && !error && <p className="text-[11px] text-gray-400 mt-1">{helper}</p>}
      {error && <p className="text-[11px] text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}

const inputCls = (err) =>
  `w-full h-11 px-3 rounded-lg text-sm outline-none transition-all border ${
    err ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-[#4caf50] focus:ring-2 focus:ring-[#4caf50]/20'
  }`;

// ─── Step 1 ──────────────────────────────────────────────────────────────────
function Step1({ data, setData, errors }) {
  return (
    <div>
      <Field label="Field Name *" helper="Give this field a name you'll remember it by" error={errors.fieldName}>
        <input
          className={inputCls(errors.fieldName)}
          placeholder="e.g. North Plot, Home Field"
          value={data.fieldName}
          onChange={(e) => setData({ ...data, fieldName: e.target.value })}
        />
      </Field>

      <Field label="Land Size *" error={errors.landSize}>
        <div className="flex gap-2">
          <input
            type="number"
            className={`flex-1 h-11 px-3 rounded-lg text-sm outline-none transition-all border ${errors.landSize ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-[#4caf50] focus:ring-2 focus:ring-[#4caf50]/20'}`}
            placeholder="e.g. 2.5"
            value={data.landSize}
            onChange={(e) => setData({ ...data, landSize: e.target.value })}
          />
          <select
            className="h-11 px-3 rounded-lg text-sm border border-gray-200 bg-white outline-none focus:border-[#4caf50] focus:ring-2 focus:ring-[#4caf50]/20 transition-all"
            value={data.landUnit}
            onChange={(e) => setData({ ...data, landUnit: e.target.value })}
          >
            <option>Acres</option>
            <option>Guntas</option>
            <option>Hectares</option>
          </select>
        </div>
      </Field>

      <Field label="Location / District *" helper="Used to give region-specific advice" error={errors.location}>
        <input
          className={inputCls(errors.location)}
          placeholder="e.g. Guntur, Andhra Pradesh"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
        />
      </Field>

      <Field label="Water Source *" error={errors.waterSource}>
        <div className="grid grid-cols-2 gap-3">
          {WATER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setData({ ...data, waterSource: opt.value })}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                data.waterSource === opt.value
                  ? 'border-[#4caf50] bg-green-50 text-green-800'
                  : 'border-gray-150 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-xl">{opt.icon}</span> {opt.value}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────
function Step2({ data, setData, errors }) {
  const ph = parseFloat(data.phLevel);
  const phLabel = ph < 6 ? { text: 'Acidic — may need lime treatment', color: '#dc2626' }
    : ph <= 7.5 ? { text: 'Ideal range for most crops', color: '#16a34a' }
    : { text: 'Alkaline — may need sulfur treatment', color: '#d97706' };

  return (
    <div>
      <Field label="Soil Type *" error={errors.soilType}>
        <div className="grid grid-cols-3 gap-2">
          {SOIL_TYPES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setData({ ...data, soilType: s.value })}
              className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 text-[11px] font-bold transition-all ${
                data.soilType === s.value
                  ? 'text-white'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
              }`}
              style={data.soilType === s.value ? { borderColor: s.color, backgroundColor: s.color } : {}}
            >
              <span className="text-2xl">{s.icon}</span>
              {s.value}
            </button>
          ))}
        </div>
      </Field>

      <Field label={`pH Level — ${ph}`}>
        <div className="relative">
          <div className="h-2 rounded-full mb-2" style={{
            background: 'linear-gradient(to right, #dc2626 0%, #dc2626 33%, #16a34a 33%, #16a34a 58%, #d97706 58%, #d97706 100%)',
          }} />
          <input
            type="range" min="4" max="9" step="0.1"
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-transparent mt-[-28px] relative z-10"
            value={data.phLevel}
            onChange={(e) => setData({ ...data, phLevel: parseFloat(e.target.value) })}
          />
          <div className="text-center mt-2">
            <span className="text-2xl font-black" style={{ color: phLabel.color }}>{ph.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-[11px] font-semibold mt-1" style={{ color: phLabel.color }}>{phLabel.text}</p>
      </Field>

      <div className="grid grid-cols-3 gap-3">
        {[
          ['Nitrogen (N)', 'nitrogen', 'kg/acre', '0–150'],
          ['Phosphorus (P)', 'phosphorus', 'kg/acre', '0–100'],
          ['Potassium (K)', 'potassium', 'kg/acre', '0–200'],
        ].map(([label, key, unit, range]) => (
          <Field key={key} label={label} error={errors[key]}>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder={range}
                className={`w-full h-11 pr-16 px-3 rounded-lg text-sm outline-none transition-all border ${
                  errors[key]
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#4caf50] focus:ring-2 focus:ring-[#4caf50]/20'
                }`}
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">{unit}</span>
            </div>
          </Field>
        ))}
      </div>

      <Field label="Last Crop Grown" helper="Leave blank if this is a new field">
        <input
          className={inputCls(false)}
          placeholder="e.g. Rice"
          value={data.lastCrop}
          onChange={(e) => setData({ ...data, lastCrop: e.target.value })}
        />
      </Field>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────
function Step3({ data, setData, errors }) {
  return (
    <div>
      <Field label="Current Crop (if already sowed)" error={errors.currentCrop}>
        <select
          className={inputCls(errors.currentCrop)}
          value={data.currentCrop}
          onChange={(e) => setData({ ...data, currentCrop: e.target.value, sowingDate: '' })}
        >
          <option value="">— Select crop —</option>
          {CROPS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>

      {data.currentCrop && data.currentCrop !== 'Nothing yet / Fallow' && (
        <Field label="When did you sow it?" error={errors.sowingDate}>
          <input
            type="date"
            className={inputCls(errors.sowingDate)}
            value={data.sowingDate}
            onChange={(e) => setData({ ...data, sowingDate: e.target.value })}
          />
        </Field>
      )}

      <Field label="Next Planned Crop" error={errors.nextCrop}>
        <select
          className={inputCls(errors.nextCrop)}
          value={data.nextCrop}
          onChange={(e) => setData({ ...data, nextCrop: e.target.value })}
        >
          <option value="">— Select crop —</option>
          {CROPS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Season *" error={errors.season}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Kharif', sub: 'June – Oct' },
            { label: 'Rabi', sub: 'Nov – Mar' },
            { label: 'Zaid', sub: 'Mar – Jun' },
            { label: 'Year Round', sub: 'All year' },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setData({ ...data, season: s.label })}
              className={`flex flex-col px-4 py-3 rounded-xl border-2 text-sm transition-all text-left ${
                data.season === s.label
                  ? 'border-[#4caf50] bg-green-50 text-green-800'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="font-bold leading-tight">{s.label}</span>
              <span className="text-[10px] opacity-60">{s.sub}</span>
            </button>
          ))}
        </div>
      </Field>

      <Field label={`Labour Available — ${data.labourCount} workers/day`}>
        <input
          type="range" min="1" max="20" step="1"
          className="w-full accent-green-700"
          value={data.labourCount}
          onChange={(e) => setData({ ...data, labourCount: parseInt(e.target.value) })}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>1</span><span>20 workers</span>
        </div>
      </Field>

      <Field label="Notes (optional)">
        <textarea
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#4caf50] focus:ring-2 focus:ring-[#4caf50]/20 transition-all resize-none"
          placeholder="Any other details about this field... soil issues, past problems, water availability notes etc"
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </Field>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(step, data) {
  const errs = {};
  if (step === 1) {
    if (!data.fieldName.trim()) errs.fieldName = 'Field name is required';
    if (!data.landSize || isNaN(data.landSize) || parseFloat(data.landSize) <= 0) errs.landSize = 'Enter a valid land size';
    if (!data.location.trim()) errs.location = 'Location is required';
    if (!data.waterSource) errs.waterSource = 'Please select a water source';
  }
  if (step === 2) {
    if (!data.soilType) errs.soilType = 'Please select a soil type';
  }
  if (step === 3) {
    if (!data.season) errs.season = 'Please select a season';
  }
  return errs;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NewField() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const errs = validate(3, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    const token = localStorage.getItem('croporia_token');
    if (!token) {
      alert("Please login first to register a field.");
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: data.fieldName,
        area: { value: parseFloat(data.landSize), unit: data.landUnit },
        location: data.location,
        soilDetails: {
          type: data.soilType,
          ph: parseFloat(data.phLevel),
          nitrogen: data.nitrogen ? parseFloat(data.nitrogen) : undefined,
          phosphorus: data.phosphorus ? parseFloat(data.phosphorus) : undefined,
          potassium: data.potassium ? parseFloat(data.potassium) : undefined,
        },
        cropPlans: [{
          cropName: data.currentCrop || data.nextCrop || 'Fallow',
          status: data.currentCrop ? 'Sowed' : 'Planned'
        }]
      };

      const res = await fetch('http://localhost:5000/api/fields', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        navigate('/fields');
      } else {
        const errorData = await res.json();
        setErrors({ submit: errorData.error || 'Failed to register field.' });
      }
    } catch (err) {
      setErrors({ submit: 'Cannot connect to Server.' });
    } finally {
      setLoading(false);
    }
  };

  const stepTitle = ['Tell us about your field', "What's your soil like?", 'What are you planning to grow?'];

  return (
    <div className="bg-[#f4f7f0] min-h-screen font-sans">
      <style>{`
        input[type=range]::-webkit-slider-thumb { background: #1a3d0a; }
      `}</style>

      {/* Navbar */}
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-6 font-medium">
          <Link to="/fields" className="hover:text-green-700">My Farm</Link>
          <span>/</span>
          <span className="text-gray-600">Register New Field</span>
        </div>

        {/* Progress */}
        <ProgressBar current={step} />

        {/* Step title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#1a3d0a] tracking-tight">{stepTitle[step - 1]}</h1>
          <p className="text-[14px] text-gray-500 mt-1">{STEPS[step - 1].description}</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm mb-6">
          {step === 1 && <Step1 data={data} setData={setData} errors={errors} />}
          {step === 2 && <Step2 data={data} setData={setData} errors={errors} />}
          {step === 3 && <Step3 data={data} setData={setData} errors={errors} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>
          ) : (
            <Link to="/fields" className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 transition-all">
              Cancel
            </Link>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 rounded-xl bg-[#1a3d0a] text-white text-sm font-bold hover:bg-green-800 transition-all shadow-sm"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2.5 rounded-xl bg-[#1a3d0a] text-white text-sm font-bold hover:bg-green-800 transition-all shadow-sm disabled:opacity-70"
            >
              {loading ? 'Registering...' : '✓ Register Field'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

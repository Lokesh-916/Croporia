import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function FieldCard({ field }) {
  return (
    <div className="bg-white rounded-2xl border border-[#d0e8c0] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col">
      <div className="h-2 w-full bg-green-600" />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-3">{field.name || 'Unnamed Field'}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>📐 {field.area?.value} {field.area?.unit}</span>
            <span>🪨 {field.soilDetails?.type || 'Unknown soil'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {field.cropPlans && field.cropPlans.length > 0 && field.cropPlans[0].cropName !== 'Fallow' && (
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              🌱 {field.cropPlans[0].status}: {field.cropPlans[0].cropName}
            </span>
          )}

          {field.location && (
            <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
              📍 {field.location}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <Link to={`/fields/${field._id}`} className="text-[12px] font-bold text-green-700 hover:underline">View Details →</Link>
          <Link to={`/fields/${field._id}/edit`} className="text-[12px] font-medium text-gray-400 hover:text-gray-600">Edit</Link>
        </div>
      </div>
    </div>
  );
}

export default function MyFields() {
  const [fields, setFields] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchFields = async () => {
      const token = localStorage.getItem('croporia_token');
      if (!token) {
        setFields([]);
        return;
      }
      
      try {
        const res = await fetch('http://localhost:5000/api/fields', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setFields(data);
        } else {
          setFields([]);
        }
      } catch (err) {
        setFields([]);
      }
    };

    fetchFields();
  }, []);

  return (
    <div className="bg-[#f4f7f0] min-h-screen font-sans text-gray-900">
      <style>{`
        nav { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      `}</style>
      <Navbar />

      {/* HERO */}
      <section style={{ backgroundColor: '#f0f7ea', borderBottom: '1px solid #d0e8c0' }}>
        <div className="max-w-5xl mx-auto px-8 py-10 flex items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-[#1a3d0a] mb-2 tracking-tight">My Fields</h1>
            <p className="text-[15px] text-green-700/70 max-w-md leading-relaxed">
              Just sowed your field? Register it here and we'll help you track and manage it.
            </p>
          </div>
          <Link to="/fields/new"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a3d0a] text-white text-sm font-bold hover:bg-green-800 transition-colors shadow-sm"
          >
            + Register New Field
          </Link>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-8 py-8 pb-20">
        {!mounted ? null : fields.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-[#d0e8c0] text-center">
            <div className="text-6xl mb-4">🌾</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">No fields registered yet.</h2>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Add your first field to get personalized crop recommendations.
            </p>
            <Link to="/fields/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a3d0a] text-white text-sm font-bold hover:bg-green-800 transition-colors"
            >
              + Register Your First Field
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-gray-500">{fields.length} field{fields.length > 1 ? 's' : ''} registered</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map((field) => (
                <FieldCard key={field.id} field={field} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

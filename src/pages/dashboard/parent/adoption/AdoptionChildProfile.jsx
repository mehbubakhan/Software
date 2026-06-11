import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function AdoptionChildProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const response = await api.get(`/adoption/children/${id}`);
        setChild(response.data.data);
      } catch (err) {
        console.error('Error fetching child:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [id]);

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading profile...</div>;
  }

  if (!child) {
    return <div className="text-center text-slate-500 py-12">Child not found.</div>;
  }

  const childName = child.child_name || child.name || 'Child Profile'
  const interests = Array.isArray(child.interests)
    ? child.interests
    : String(child.interests || '').split(',').map(item => item.trim()).filter(Boolean)
  const location = child.orphanage_name || child.currentLocation || 'Adoption center'
  const status = child.adoption_status || child.matchStatus || 'available'
  const description = child.short_description || child.description || 'No description available.'
  const medicalInfo = child.medicalInfo || {
    healthCondition: child.health_condition || 'Unknown',
    medicalHistory: child.health_condition || 'Not specified',
    specialNeeds: 'Not specified',
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-68px)] text-slate-800 -m-6 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back
        </button>

        {/* Top Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-slate-800 text-5xl font-bold mb-4 shadow-lg">
              {child.image}
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">{childName}</h1>
            <button className="w-full bg-transparent hover:bg-slate-100 border border-slate-300 text-fuchsia-400 font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2">
              ♡ Add to Favorites
            </button>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{childName}</h2>
            <div className="text-slate-500 mb-6">{child.age} • {child.gender}</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Match Status</div>
                <div className={`inline-block px-3 py-1 rounded font-semibold ${status === 'adopted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  ✓ {status}
                </div>
              </div>
              
              <div>
                <div className="text-slate-500 mb-1">Education Level</div>
                <div className="text-slate-800 font-medium">{child.educationLevel}</div>
              </div>

              <div>
                <div className="text-slate-500 mb-1 flex items-center gap-1">📍 Current Location</div>
                <div className="text-slate-800 font-medium">{location}</div>
              </div>

              <div>
                <div className="text-slate-500 mb-1 flex items-center gap-1">🕒 Available Since</div>
                <div className="text-slate-800 font-medium">{child.availableSince}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-slate-500 mb-1 flex items-center gap-1">🌐 Languages</div>
                <div className="flex gap-2">
                  {(Array.isArray(child.languages) ? child.languages : []).map(lang => (
                    <span key={lang} className="bg-slate-100 border border-slate-200 text-fuchsia-300 px-3 py-1 rounded-md text-xs font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Personality</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Interests & Hobbies</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <span key={idx} className="bg-slate-100 text-fuchsia-300 border border-slate-200 text-sm px-3 py-1.5 rounded-md">
                  {interest}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Medical Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Medical Information</h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-sm font-bold text-slate-800 mb-1">Health Condition</div>
              <div className={`inline-flex items-center gap-1 text-sm font-semibold ${medicalInfo.healthCondition === 'Excellent' || medicalInfo.healthCondition === 'Good' ? 'text-green-400' : 'text-yellow-400'}`}>
                ✓ {medicalInfo.healthCondition}
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-800 mb-1">Medical History</div>
              <div className="text-sm text-slate-500">{medicalInfo.medicalHistory}</div>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-800 mb-1">Special Needs</div>
              <div className="text-sm text-slate-500">{medicalInfo.specialNeeds}</div>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-slate-100/50 border border-slate-200 rounded-2xl p-6 mb-8 text-sm text-slate-500 flex items-start gap-4">
          <span className="text-xl">🛡️</span>
          <div>
            <span className="font-bold text-slate-600 block mb-1">Privacy & Protection</span>
            For the child's safety and privacy, some information is limited to approved applicants only. Full medical records, background details, and additional information will be shared during the formal adoption process after initial screening.
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button 
            onClick={() => navigate('apply')}
            className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-fuchsia-900/20"
          >
            Start Adoption Application
          </button>
          <button 
            onClick={() => navigate('schedule')}
            className="flex-1 bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-4 rounded-xl transition"
          >
            Schedule Visit
          </button>
        </div>

      </div>
    </div>
  );
}



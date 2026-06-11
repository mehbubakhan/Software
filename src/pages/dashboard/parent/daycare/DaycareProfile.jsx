import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function DaycareProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [daycare, setDaycare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('About');

  useEffect(() => {
    const fetchDaycare = async () => {
      try {
        const response = await api.get(`/daycare/${id}`);
        setDaycare(response.data.data);
      } catch (err) {
        console.error('Error fetching daycare:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDaycare();
  }, [id]);

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading profile...</div>;
  }

  if (!daycare) {
    return <div className="text-center text-slate-500 py-12">Daycare not found.</div>;
  }

  const tabs = ['About', 'Facilities', 'Parent Features', 'Schedule', 'Staff', 'Admission', 'Reviews'];

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="max-w-5xl mx-auto mt-6">
        
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 mb-6 transition text-sm font-semibold w-max">
          ← Back to Directory
        </button>

        {/* Header Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 mb-8 relative">
          <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{daycare.name}</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-yellow-400 text-lg leading-none">★</span>
                <span className="font-bold text-slate-900">{daycare.rating}</span>
                <span className="text-slate-500">({Array.isArray(daycare.reviews) ? daycare.reviews.length : daycare.reviews} reviews)</span>
                <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">🔴 Live CCTV</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{daycare.price}</div>
              <div className="text-sm text-slate-500">{daycare.careType}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-slate-600 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-slate-400">📍</span>
              <span>{daycare.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">📞</span>
              <span>{daycare.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">✉️</span>
              <span>{daycare.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">🌐</span>
              <span className="text-fuchsia-600 font-semibold hover:underline cursor-pointer">{daycare.website}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">👥</span>
              <span>{daycare.enrolledInfo}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">🕒</span>
              <span>{daycare.hours}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('apply')} className="flex-1 min-w-[200px] bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-xl shadow-sm transition text-sm">
              Apply for Admission
            </button>
            <button className="flex-1 min-w-[150px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition text-sm">
              Book a Tour
            </button>
            <button onClick={() => navigate('cctv')} className="flex-1 min-w-[150px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2">
              📷 Live CCTV
            </button>
            <button onClick={() => navigate('chat')} className="flex-1 min-w-[150px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2">
              💬 Chat
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${activeTab === tab ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-20">
          
          {activeTab === 'About' && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 text-slate-900">About</h3>
              <div className="text-slate-600 text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
                {daycare.about}
              </div>
              <div className="mt-8 bg-slate-50 border border-slate-100 text-slate-900 rounded-xl p-6">
                <h4 className="font-bold mb-3">Our Core Values</h4>
                <ul className="space-y-2 text-sm">
                  {daycare.coreValues.map((val, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-fuchsia-600 font-bold">✓</span> {val}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'Facilities' && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-center text-slate-500 py-12">
              Facilities content not fully specified in mockups, placeholder area.
            </div>
          )}

          {activeTab === 'Parent Features' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Parent Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6">
                  <h4 className="font-bold mb-3">Communication & Updates</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {daycare.parentFeatures.communication.map((val, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-fuchsia-600 font-bold">✓</span> {val}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6">
                  <h4 className="font-bold mb-3">Safety & Monitoring</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {daycare.parentFeatures.safety.map((val, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-fuchsia-600 font-bold">✓</span> {val}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6">
                  <h4 className="font-bold mb-3">Engagement & Events</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {daycare.parentFeatures.engagement.map((val, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-fuchsia-600 font-bold">✓</span> {val}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6">
                  <h4 className="font-bold mb-3">Convenience Features</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {daycare.parentFeatures.convenience.map((val, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-fuchsia-600 font-bold">✓</span> {val}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Schedule' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Daily Schedule</h3>
              
              <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6 mb-6">
                <h4 className="font-bold mb-4">Typical Day at Little Stars</h4>
                <div className="space-y-4">
                  {daycare.schedule.daily.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 font-bold text-fuchsia-600 shrink-0 text-sm">{item.time}</div>
                      <div>
                        <div className="font-bold text-sm">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6">
                <h4 className="font-bold mb-4">Weekly Special Activities</h4>
                <div className="space-y-2 text-sm text-slate-600">
                  {daycare.schedule.weekly.map((item, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-28 font-bold text-slate-900">{item.day}:</span>
                      <span>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Staff' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Our Staff</h3>
              
              <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6 mb-6">
                <h4 className="font-bold mb-3">Staff Qualifications</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> All staff members have background checks and clearances</li>
                  <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> 100% certified in Early Childhood Education</li>
                  <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> CPR and First Aid certified</li>
                  <li className="flex items-center gap-2"><span className="text-fuchsia-600 font-bold">✓</span> Ongoing professional development training</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {daycare.staff.map((member) => (
                  <div key={member.id} className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6 flex flex-col items-start hover:shadow-md transition">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-fuchsia-600 flex items-center justify-center font-bold text-xl mb-4">
                      {member.initials}
                    </div>
                    <div className="font-bold text-lg mb-1">{member.name}</div>
                    <div className="text-sm text-fuchsia-600 font-semibold mb-3">{member.role}</div>
                    <div className="text-xs text-slate-500 mb-1">{member.experience}</div>
                    <div className="text-xs text-slate-500">{member.certs}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Admission' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Admission Plans</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {Object.entries(daycare.admissions).map(([key, plan]) => (
                  <div key={key} className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6 flex flex-col">
                    <h4 className="font-bold text-lg capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <div className="text-2xl font-bold mb-1">{plan.price}</div>
                    <div className="text-sm text-slate-500 mb-4">{plan.desc}</div>
                    <ul className="space-y-2 text-sm mb-6 flex-1 text-slate-600">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-fuchsia-600 font-bold">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => navigate('apply')}
                      className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-sm mt-auto shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6">
                <h4 className="font-bold mb-4">Required Documents for Admission</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><span className="text-slate-400">📄</span> Child's Birth Certificate</div>
                  <div className="flex items-center gap-2"><span className="text-slate-400">📄</span> Medical History Form</div>
                  <div className="flex items-center gap-2"><span className="text-slate-400">📄</span> Immunization Records</div>
                  <div className="flex items-center gap-2"><span className="text-slate-400">📄</span> Parent/Guardian ID</div>
                  <div className="flex items-center gap-2"><span className="text-slate-400">📄</span> Emergency Contact Information</div>
                  <div className="flex items-center gap-2"><span className="text-slate-400">📄</span> Proof of Address</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Parent Reviews</h3>
              
              <div className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6 mb-6 flex items-center gap-4">
                <div className="text-4xl font-bold text-slate-900">{daycare.rating}</div>
                <div>
                  <div className="text-yellow-400 text-xl tracking-widest">★★★★★</div>
                  <div className="text-sm text-slate-500">Based on {Array.isArray(daycare.reviews) ? daycare.reviews.length : daycare.reviews} reviews</div>
                </div>
              </div>

              <div className="space-y-4">
                {daycare.reviews.map(review => (
                  <div key={review.id} className="bg-white border border-slate-200 shadow-sm text-slate-900 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{review.parent}</div>
                        <div className="text-xs text-slate-500">{review.date}</div>
                      </div>
                      <div className="text-yellow-400 text-sm tracking-widest">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mt-3 text-slate-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}


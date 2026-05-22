import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function AdoptionTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/adoption/applications');
        setApplications(response.data.data || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="bg-[#111322] min-h-[calc(100vh-68px)] text-slate-100 -m-6 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Adoption Applications</h1>
          <p className="text-slate-400">Track the status of your adoption applications and upload required documents.</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-bold text-white mb-2">No Applications Found</h3>
            <p className="text-slate-400 mb-6">You haven't started any adoption applications yet.</p>
            <button 
              onClick={() => navigate('/dashboard/parent/adoption/children')}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-8 rounded-xl transition"
            >
              Browse Available Children
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {applications.map((app) => (
              <div key={app.id} className="bg-[#1a1c2d] border border-slate-700 rounded-2xl p-8">
                
                {/* Application Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-700 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{app.childName}</h2>
                    <p className="text-slate-400 text-sm">{app.childGender} • {app.childAge}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <button className="bg-transparent hover:bg-slate-800 border border-slate-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition mb-2">
                      View Application
                    </button>
                    <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded text-xs font-semibold">
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Application Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-xs text-slate-500 mb-1">Date Applied</div>
                    <div className="font-bold text-white">{app.dateApplied}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-xs text-slate-500 mb-1">Last Updated</div>
                    <div className="font-bold text-white">{app.lastUpdated}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-xs text-slate-500 mb-1">Application ID</div>
                    <div className="font-bold text-white">{app.id}</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Application Timeline</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-fuchsia-500 before:via-slate-700 before:to-slate-700">
                    {app.timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#1a1c2d] ${step.completed ? 'bg-fuchsia-500' : 'bg-slate-600'} text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-slate-700 bg-slate-800/30">
                          <div className="flex items-center justify-between mb-1">
                            <div className={`font-bold text-sm ${step.completed ? 'text-white' : 'text-slate-400'}`}>{step.stage}</div>
                            <div className="text-xs text-slate-500">{step.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents List */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span>📄</span> Required Documents
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Please submit the following documents to proceed with your application. All documents must be clear, legible, and in PDF or JPEG format.
                  </p>
                  
                  <div className="space-y-3">
                    {app.documents.map((doc, idx) => (
                      <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`text-xl ${doc.uploaded ? 'text-green-500' : 'text-slate-500'}`}>
                            {doc.uploaded ? '✅' : '📄'}
                          </div>
                          <div>
                            <div className={`text-sm font-semibold ${doc.uploaded ? 'text-white' : 'text-slate-300'}`}>{doc.name}</div>
                            <div className="text-xs text-slate-500">{doc.uploaded ? 'Uploaded successfully' : 'Not uploaded'}</div>
                          </div>
                        </div>
                        <button 
                          className={`text-xs font-semibold py-1.5 px-4 rounded-lg transition ${doc.uploaded ? 'bg-slate-700 text-slate-300 cursor-default' : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white'}`}
                        >
                          {doc.uploaded ? 'Update' : 'Upload'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 text-xs text-yellow-400/80">
                    <strong>Note:</strong> The document review process may take up to 2 weeks. You will be notified once all documents have been reviewed and verified by our team.
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-12 text-center pb-12">
          <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
          <p className="text-slate-400 mb-4 text-sm">If you have questions about your application status or need assistance with documents, please contact our support team.</p>
          <button className="bg-transparent hover:bg-slate-800 border border-slate-600 text-white text-sm font-semibold py-2 px-6 rounded-xl transition">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}

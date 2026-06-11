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

  const handleUpload = async (appId, docName, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_name', docName);

    try {
      await api.post(`/adoption/applications/${appId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Refresh applications after successful upload
      const response = await api.get('/adoption/applications');
      setApplications(response.data.data || []);
      alert(`${docName} uploaded successfully!`);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-68px)] text-slate-800 -m-6 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Adoption Applications</h1>
          <p className="text-slate-500">Track the status of your adoption applications and upload required documents.</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-12">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Applications Found</h3>
            <p className="text-slate-500 mb-6">You haven't started any adoption applications yet.</p>
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
              <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-8">
                
                {/* Application Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-200 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{app.child_name}</h2>
                    <p className="text-slate-500 text-sm">{app.gender} • {app.age}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <button className="bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold py-2 px-4 rounded-lg transition mb-2">
                      View Application
                    </button>
                    <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded text-xs font-semibold uppercase">
                      {app.application_status}
                    </span>
                  </div>
                </div>

                {/* Application Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Date Applied</div>
                    <div className="font-bold text-slate-800">{new Date(app.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Compatibility Score</div>
                    <div className="font-bold text-slate-800">{app.compatibility_score || 0}%</div>
                  </div>
                  <div className="bg-slate-100/50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Application ID</div>
                    <div className="font-bold text-slate-800">{app.id}</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider">Application Timeline</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-fuchsia-500 before:via-slate-700 before:to-slate-700">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#1a1c2d] bg-fuchsia-500 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-100/30">
                        <div className="flex items-center justify-between mb-1">
                          <div className={`font-bold text-sm text-slate-800`}>Application Submitted</div>
                          <div className="text-xs text-slate-500">{new Date(app.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents List */}
                <div>
                  <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span>📄</span> Required Documents
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Please submit the following documents to proceed with your application. All documents must be clear, legible, and in PDF or JPEG format.
                  </p>
                  
                  <div className="space-y-3">
                    {(app.submitted_documents || []).map((doc, idx) => (
                      <div key={idx} className="bg-slate-100/50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`text-xl ${doc.uploaded ? 'text-green-500' : 'text-slate-500'}`}>
                            {doc.uploaded ? '✅' : '📄'}
                          </div>
                          <div>
                            <div className={`text-sm font-semibold ${doc.uploaded ? 'text-slate-800' : 'text-slate-600'}`}>{doc.name}</div>
                            <div className="text-xs text-slate-500">{doc.uploaded ? 'Uploaded successfully' : 'Not uploaded'}</div>
                          </div>
                        </div>
                        <label className={`text-xs font-semibold py-1.5 px-4 rounded-lg transition ${doc.uploaded ? 'bg-slate-700 text-slate-600 cursor-default' : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer'}`}>
                          {doc.uploaded ? 'Update' : 'Upload'}
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleUpload(app.id, doc.name, e.target.files[0])}
                          />
                        </label>
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
          <h3 className="text-lg font-bold text-slate-800 mb-2">Need Help?</h3>
          <p className="text-slate-500 mb-4 text-sm">If you have questions about your application status or need assistance with documents, please contact our support team.</p>
          <button className="bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-800 text-sm font-semibold py-2 px-6 rounded-xl transition">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}



import React, { useState } from 'react';
import { 
  CheckCircle, 
  Shield, 
  UploadCloud, 
  FileText, 
  Award, 
  Camera,
  AlertTriangle,
  Lock
} from 'lucide-react';

export default function Verification() {
  const [docsUploaded, setDocsUploaded] = useState({
    id: false,
    address: false,
    police: false,
    medical: false
  });

  const progress = Object.values(docsUploaded).filter(Boolean).length * 25; // 4 docs = 25% each

  const handleUpload = (type) => {
    // Simulate file upload
    alert(`Uploading ${type}...`);
    setTimeout(() => {
      setDocsUploaded(prev => ({ ...prev, [type]: true }));
      alert(`${type} uploaded successfully!`);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          Verification & Trust <Shield className="w-8 h-8 text-emerald-500" />
        </h1>
        <p className="text-slate-500 mt-2">Build trust with parents by verifying your identity and qualifications.</p>
      </div>

      {/* Progress Bar (UNIQUE IDEA) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Your Trust Profile is {progress}% Complete</h2>
        
        {/* Circular Progress Simulator - CSS approach */}
        <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-50 border-[12px] border-slate-100 shadow-inner">
          <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
            <circle 
              cx="50%" cy="50%" r="46%" 
              fill="transparent" 
              stroke={progress === 100 ? '#10b981' : '#3b82f6'} 
              strokeWidth="24" 
              strokeDasharray={`${progress * 2.89} 1000`} // Approximation for circumference
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="text-4xl font-black text-slate-900 z-10">{progress}%</div>
        </div>

        {progress === 100 ? (
          <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl inline-block font-bold">
            🎉 You are now a Fully Verified Nanny!
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Upload the remaining documents below to reach 100% and unlock Premium jobs.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Document Uploads */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Required Documents</h2>

          <div className={`p-5 rounded-2xl border transition-all ${docsUploaded.id ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Camera className={`w-5 h-5 ${docsUploaded.id ? 'text-emerald-600' : 'text-blue-500'}`} />
                <h3 className="font-bold text-slate-900">National ID Card</h3>
              </div>
              {docsUploaded.id && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </div>
            {!docsUploaded.id ? (
              <button onClick={() => handleUpload('id')} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <UploadCloud className="w-4 h-4" /> Upload NID
              </button>
            ) : (
              <div className="text-emerald-700 text-sm font-medium">Verified by Admin</div>
            )}
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${docsUploaded.police ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${docsUploaded.police ? 'text-emerald-600' : 'text-purple-500'}`} />
                <h3 className="font-bold text-slate-900">Police Clearance</h3>
              </div>
              {docsUploaded.police && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </div>
            {!docsUploaded.police ? (
              <button onClick={() => handleUpload('police')} className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <UploadCloud className="w-4 h-4" /> Upload Certificate
              </button>
            ) : (
              <div className="text-emerald-700 text-sm font-medium">Verified by Admin</div>
            )}
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${docsUploaded.address ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <FileText className={`w-5 h-5 ${docsUploaded.address ? 'text-emerald-600' : 'text-orange-500'}`} />
                <h3 className="font-bold text-slate-900">Proof of Address</h3>
              </div>
              {docsUploaded.address && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </div>
            {!docsUploaded.address ? (
              <button onClick={() => handleUpload('address')} className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <UploadCloud className="w-4 h-4" /> Upload Utility Bill
              </button>
            ) : (
              <div className="text-emerald-700 text-sm font-medium">Verified by Admin</div>
            )}
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${docsUploaded.medical ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <FileText className={`w-5 h-5 ${docsUploaded.medical ? 'text-emerald-600' : 'text-red-500'}`} />
                <h3 className="font-bold text-slate-900">Medical Fitness</h3>
              </div>
              {docsUploaded.medical && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </div>
            {!docsUploaded.medical ? (
              <button onClick={() => handleUpload('medical')} className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <UploadCloud className="w-4 h-4" /> Upload Report
              </button>
            ) : (
              <div className="text-emerald-700 text-sm font-medium">Verified by Admin</div>
            )}
          </div>
        </div>

        {/* Badge System */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Your Trust Badges</h2>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Award className="w-32 h-32 text-slate-900" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${progress >= 0 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Registered Nanny</h4>
                  <p className="text-xs text-slate-500">Basic account created.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${progress >= 50 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-bold ${progress >= 50 ? 'text-blue-700' : 'text-slate-400'}`}>Verified Nanny</h4>
                  <p className="text-xs text-slate-500">Identity and background checked.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${progress >= 100 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`font-bold ${progress >= 100 ? 'text-emerald-700' : 'text-slate-400'}`}>Trusted Caregiver</h4>
                  <p className="text-xs text-slate-500">All documents 100% verified.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 opacity-50 grayscale">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-700 flex items-center gap-1"><Lock className="w-3 h-3" /> Premium Caregiver</h4>
                  <p className="text-xs text-slate-500">Requires 5+ excellent reviews.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award, 
  Trophy, 
  Play, 
  Target, 
  Check,
  Medal,
  HeartPulse,
  Siren,
  Brain,
  Star,
  ShieldCheck,
  Baby,
  Apple,
  FileCheck,
  UploadCloud,
  X
} from 'lucide-react';

const coursesData = [
  {
    id: 1,
    title: 'CPR & First Aid Training',
    category: 'Safety',
    duration: '2 hours',
    status: 'Completed',
    progress: 100,
    icon: <HeartPulse className="w-8 h-8 text-rose-500" />
  },
  {
    id: 2,
    title: 'Child Psychology Basics',
    category: 'Development',
    duration: '3 hours',
    status: 'In Progress',
    progress: 60,
    icon: <Brain className="w-8 h-8 text-pink-500" />
  },
  {
    id: 3,
    title: 'Emergency Handling',
    category: 'Safety',
    duration: '1.5 hours',
    status: 'Completed',
    progress: 100,
    icon: <Siren className="w-8 h-8 text-red-500" />
  },
  {
    id: 4,
    title: 'Infant Care Essentials',
    category: 'Childcare',
    duration: '4 hours',
    status: 'Not Started',
    progress: 0,
    icon: <Baby className="w-8 h-8 text-amber-500" />
  },
  {
    id: 5,
    title: 'Nutrition & Meal Planning',
    category: 'Health',
    duration: '2 hours',
    status: 'Not Started',
    progress: 0,
    icon: <Apple className="w-8 h-8 text-red-500" />
  },
  {
    id: 6,
    title: 'Special Needs Care',
    category: 'Advanced',
    duration: '5 hours',
    status: 'In Progress',
    progress: 30,
    icon: <Star className="w-8 h-8 text-yellow-500" />
  }
];

export default function Learning() {
  const [filter, setFilter] = useState('All Courses');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const categories = ['All Courses', 'Safety', 'Development', 'Childcare', 'Advanced'];

  const filteredCourses = filter === 'All Courses' 
    ? coursesData 
    : coursesData.filter(c => c.category === filter);

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            Learning & Growth 
            <span className="flex text-2xl">
              <BookOpen className="text-emerald-600" />
            </span>
          </h1>
          <p className="text-slate-500 mt-2">Enhance your skills and earn certifications</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
        >
          <UploadCloud className="w-4 h-4" /> Upload Certificate
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Completed</span>
          </div>
          <div className="text-4xl font-bold mb-1">3</div>
          <div className="text-emerald-100 text-sm">Courses finished</div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-600">
            <Clock className="w-5 h-5" />
            <span className="font-medium">In Progress</span>
          </div>
          <div className="text-4xl font-bold text-slate-900 mb-1">2</div>
          <div className="text-slate-500 text-sm">Active courses</div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-600">
            <Award className="w-5 h-5" />
            <span className="font-medium">Certificates</span>
          </div>
          <div className="text-4xl font-bold text-slate-900 mb-1">5</div>
          <div className="text-slate-500 text-sm">Badges earned</div>
        </div>
      </div>

      {/* Your Certificates */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
          Your Certificates <Trophy className="w-5 h-5 text-amber-500" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
            <FileCheck className="w-8 h-8 text-slate-400" />
            <span className="text-xs font-bold text-slate-800">CPR Certified</span>
          </div>
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
            <Siren className="w-8 h-8 text-red-500" />
            <span className="text-xs font-bold text-slate-800">Emergency Handler</span>
          </div>
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
            <Brain className="w-8 h-8 text-pink-500" />
            <span className="text-xs font-bold text-slate-800">Child Psychology</span>
          </div>
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-xs font-bold text-slate-800">Top Performer</span>
          </div>
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3">
            <ShieldCheck className="w-8 h-8 text-yellow-500" />
            <span className="text-xs font-bold text-slate-800">Trusted Nanny</span>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                {course.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    course.status === 'Completed' ? 'bg-emerald-600 text-white' :
                    course.status === 'In Progress' ? 'bg-blue-600 text-white' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {course.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                    {course.status}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-white">{course.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                </div>

                {course.status !== 'Not Started' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-slate-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                )}

                <div>
                  {course.status === 'Not Started' && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors">
                      <Play className="w-4 h-4" /> START COURSE
                    </button>
                  )}
                  {course.status === 'In Progress' && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors">
                      <Play className="w-4 h-4" /> CONTINUE LEARNING
                    </button>
                  )}
                  {course.status === 'Completed' && course.title === 'Emergency Handling' && (
                    <button className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors">
                      <Award className="w-4 h-4" /> VIEW CERTIFICATE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-fuchsia-50 border border-fuchsia-100 p-8 rounded-2xl">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-red-500" /> Benefits of Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
          <div className="flex items-center gap-2 text-slate-700">
            <Check className="w-4 h-4 text-purple-600" />
            <span>Earn certificates and badges</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Check className="w-4 h-4 text-purple-600" />
            <span>Increase your trust score</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Check className="w-4 h-4 text-purple-600" />
            <span>Get higher paying jobs</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Check className="w-4 h-4 text-purple-600" />
            <span>Rank higher in search</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Check className="w-4 h-4 text-purple-600" />
            <span>Build parent confidence</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Check className="w-4 h-4 text-purple-600" />
            <span>Access exclusive jobs</span>
          </div>
        </div>
      </div>

      {/* External Cert Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button onClick={() => setIsUploadOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Upload Certification</h2>
              <p className="text-slate-500 mb-6 text-sm">Upload a document to get it verified and added to your profile.</p>
              
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-slate-50 transition-colors cursor-pointer mb-6">
                <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-700 text-sm">Click to browse or drag file</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </div>

              <button 
                onClick={() => {
                  alert('Certification uploaded for review!');
                  setIsUploadOpen(false);
                }}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Submit Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

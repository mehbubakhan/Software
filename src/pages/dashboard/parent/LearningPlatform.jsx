import React, { useState } from 'react'
import api from '../../../services/api'

export default function LearningPlatform() {
  const [activeTab, setActiveTab] = useState('content')
  const [selectedLesson, setSelectedLesson] = useState(null)

  const learningContent = [
    {
      id: 1,
      category: 'Alphabet',
      title: 'Learning A-Z',
      description: 'Interactive alphabet learning',
      icon: '🔤',
      lessons: ['Letter A', 'Letter B', 'Letter C'],
      duration: '5 min'
    },
    {
      id: 2,
      category: 'Math',
      title: 'Counting Numbers',
      description: 'Fun number games',
      icon: '🔢',
      lessons: ['1-5', '6-10', 'Basic Addition'],
      duration: '8 min'
    },
    {
      id: 3,
      category: 'Stories',
      title: 'Bedtime Stories',
      description: 'Engaging storybook collection',
      icon: '📖',
      lessons: ['The Little Train', 'Sleeping Beauty', 'Snow White'],
      duration: '10 min'
    },
    {
      id: 4,
      category: 'Drawing',
      title: 'Art & Drawing',
      description: 'Creative drawing activities',
      icon: '🎨',
      lessons: ['Shapes', 'Colors', 'Animals'],
      duration: '15 min'
    },
    {
      id: 5,
      category: 'Videos',
      title: 'Educational Videos',
      description: 'Interactive video lessons',
      icon: '🎬',
      lessons: ['Alphabet Song', 'Counting Song', 'Color Recognition'],
      duration: '12 min'
    },
    {
      id: 6,
      category: 'Science',
      title: 'Basic Science',
      description: 'Fun science experiments',
      icon: '🧪',
      lessons: ['Animals', 'Planets', 'Weather'],
      duration: '7 min'
    }
  ]

  const progressData = [
    { name: 'Emma', age: '4 years', progress: 72 },
  ]

  const completedLessons = [
    { title: 'Letter A', score: 95, date: 'Today' },
    { title: 'Counting 1-5', score: 88, date: 'Yesterday' },
    { title: 'Color Recognition', score: 92, date: '2 days ago' },
  ]

  const recommendations = [
    { age: '3-4 years', content: 'Basic Alphabet' },
    { age: '4-5 years', content: 'Simple Math' },
    { age: '5+ years', content: 'Reading Stories' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Learning Platform</h1>
        <p className="text-slate-600 mt-2">Educational content for your child's development</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'content'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📚 Learning Content
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'progress'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📊 Progress Tracking
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'recommendations'
              ? 'text-fuchsia-600 border-b-2 border-fuchsia-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💡 Recommendations
        </button>
      </div>

      {/* Learning Content Tab */}
      {activeTab === 'content' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningContent.map((content) => (
              <div
                key={content.id}
                onClick={() => setSelectedLesson(content)}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg transition cursor-pointer hover:border-fuchsia-500"
              >
                <div className="text-5xl mb-3">{content.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg">{content.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{content.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {content.category}
                  </span>
                  <span className="text-xs text-slate-500">{content.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lesson Modal */}
          {selectedLesson && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-5xl mb-2">{selectedLesson.icon}</div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedLesson.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="text-2xl text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-slate-600 mb-6">{selectedLesson.description}</p>

                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Available Lessons:</h3>
                  <div className="space-y-2">
                    {selectedLesson.lessons.map((lesson, idx) => (
                      <button
                        key={idx}
                        className="w-full p-3 text-left bg-slate-50 border border-slate-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition"
                      >
                        ▶️ {lesson}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Starting: ${selectedLesson.title}`);
                    setSelectedLesson(null);
                  }}
                  className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition font-semibold"
                >
                  Start Learning
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Tracking Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {progressData.map((child, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                👧 {child.name} ({child.age})
              </h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">Overall Progress</span>
                  <span className="text-2xl font-bold text-fuchsia-600">{child.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-fuchsia-500 to-pink-500 h-4 rounded-full transition"
                    style={{ width: `${child.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Recently Completed</h4>
                <div className="space-y-2">
                  {completedLessons.map((lesson, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">{lesson.title}</p>
                        <p className="text-xs text-slate-600">{lesson.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{lesson.score}%</p>
                        <p className="text-xs text-slate-600">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <p className="text-slate-600">
            These are recommended learning paths based on your child's age group:
          </p>
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-slate-900 mb-2">For {rec.age}</h3>
              <p className="text-slate-600 mb-4">{rec.content}</p>
              <button className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition">
                View Lessons →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


import { FileText, Heart, Activity, Calendar, Upload, CheckCircle } from 'lucide-react';

interface TimelineEvent {
  id: number;
  type: 'medical' | 'counselling' | 'adoption' | 'document' | 'general';
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'upcoming';
}

interface ChildTimelineProps {
  childId: string;
}

export default function ChildTimeline({ childId }: ChildTimelineProps) {
  const timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      type: 'adoption',
      title: 'Child Profile Created',
      description: 'Initial profile setup completed with all basic information',
      date: '2024-01-15',
      time: '10:30 AM',
      status: 'completed'
    },
    {
      id: 2,
      type: 'medical',
      title: 'Medical Checkup',
      description: 'Routine health examination completed. All vitals normal.',
      date: '2024-01-20',
      time: '2:00 PM',
      status: 'completed'
    },
    {
      id: 3,
      type: 'document',
      title: 'Vaccination Records Updated',
      description: 'Latest vaccination certificates uploaded to system',
      date: '2024-02-05',
      time: '11:15 AM',
      status: 'completed'
    },
    {
      id: 4,
      type: 'counselling',
      title: 'Counselling Session',
      description: 'Monthly counselling session with Dr. Sarah Smith',
      date: '2024-02-12',
      time: '3:30 PM',
      status: 'completed'
    },
    {
      id: 5,
      type: 'adoption',
      title: 'Application Received',
      description: 'New adoption application from Smith family received',
      date: '2024-02-20',
      time: '9:00 AM',
      status: 'completed'
    },
    {
      id: 6,
      type: 'medical',
      title: 'Dental Checkup',
      description: 'Dental examination scheduled and completed',
      date: '2024-03-01',
      time: '1:00 PM',
      status: 'completed'
    },
    {
      id: 7,
      type: 'adoption',
      title: 'First Meeting with Prospective Parents',
      description: 'Initial meeting with Smith family went well',
      date: '2024-03-10',
      time: '10:00 AM',
      status: 'completed'
    },
    {
      id: 8,
      type: 'counselling',
      title: 'Upcoming Counselling Session',
      description: 'Scheduled counselling session with Dr. Sarah Smith',
      date: '2024-06-05',
      time: '3:00 PM',
      status: 'upcoming'
    },
    {
      id: 9,
      type: 'medical',
      title: 'Annual Physical Exam',
      description: 'Yearly comprehensive health checkup scheduled',
      date: '2024-06-15',
      time: '2:00 PM',
      status: 'upcoming'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <Activity className="w-5 h-5 text-red-500" />;
      case 'counselling':
        return <Heart className="w-5 h-5 text-purple-500" />;
      case 'adoption':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'document':
        return <Upload className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Child Timeline</h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline Events */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                  {getIcon(event.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🕒</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Button */}
      <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium">
        + Add Timeline Event
      </button>
    </div>
  );
}

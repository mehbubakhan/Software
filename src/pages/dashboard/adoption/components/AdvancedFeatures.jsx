import { useState, useEffect } from 'react';
import { Brain, Shield, Zap, Lock, Key, UserCheck, FileText, Globe, Bell, Calendar, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Activity, Database, Search } from 'lucide-react';
import { toast } from 'sonner';







export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState('ai');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compatibilityResults, setCompatibilityResults] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [behaviourData, setBehaviourData] = useState([]);
  const [automationEnabled, setAutomationEnabled] = useState({
    reminders: true,
    scheduling: true,
    statusUpdates: true,
    notifications: true,
    reports: false
  });

  // Initialize data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Load fraud alerts
    setFraudAlerts([
      {
        id: 'FR-001',
        type: 'Duplicate Account',
        severity: 'high',
        description: 'Same IP address detected for multiple applications',
        timestamp: '2026-06-03 10:30 AM',
        status: 'active'
      },
      {
        id: 'FR-002',
        type: 'Fake Document',
        severity: 'critical',
        description: 'AI detected edited income certificate - Application #2458',
        timestamp: '2026-06-03 09:15 AM',
        status: 'investigating'
      },
      {
        id: 'FR-003',
        type: 'Suspicious Pattern',
        severity: 'medium',
        description: 'Unusual login pattern detected from new location',
        timestamp: '2026-06-02 04:45 PM',
        status: 'resolved'
      }
    ]);

    // Load behaviour analysis
    setBehaviourData([
      {
        childId: 'CH001',
        childName: 'Emma Wilson',
        patterns: {
          socialInteraction: 85,
          emotionalStability: 72,
          learningProgress: 90,
          sleepQuality: 78,
          appetiteHealth: 88
        },
        concerns: ['Occasional anxiety during group activities', 'Sleep disruption on weekends'],
        improvements: ['Improved reading skills', 'Better peer relationships'],
        aiInsights: 'Emma shows strong academic progress and positive social development. Recommend continued counseling support for anxiety management.'
      },
      {
        childId: 'CH002',
        childName: 'Michael Chen',
        patterns: {
          socialInteraction: 65,
          emotionalStability: 58,
          learningProgress: 75,
          sleepQuality: 62,
          appetiteHealth: 70
        },
        concerns: ['Withdrawn behavior', 'Difficulty sleeping', 'Low appetite'],
        improvements: ['Participating more in art therapy'],
        aiInsights: 'Michael requires additional emotional support. Recommend increasing counseling sessions and monitoring sleep patterns closely.'
      }
    ]);
  };

  const runCompatibilityMatching = () => {
    setIsProcessing(true);
    toast.info('AI analyzing compatibility factors...');

    setTimeout(() => {
      const results = [
        {
          id: 'CM-001',
          childName: 'Emma Wilson (Age 8)',
          parentName: 'Sarah & John Smith',
          score: 94,
          factors: {
            ageCompatibility: 95,
            experienceMatch: 88,
            environmentSuitability: 96,
            emotionalReadiness: 92,
            financialStability: 98
          },
          recommendation: 'Excellent Match - Highly Recommended'
        },
        {
          id: 'CM-002',
          childName: 'Michael Chen (Age 6)',
          parentName: 'Robert & Lisa Johnson',
          score: 87,
          factors: {
            ageCompatibility: 90,
            experienceMatch: 85,
            environmentSuitability: 88,
            emotionalReadiness: 82,
            financialStability: 90
          },
          recommendation: 'Strong Match - Recommended with Support'
        },
        {
          id: 'CM-003',
          childName: 'Sophia Martinez (Age 10)',
          parentName: 'David & Anna Williams',
          score: 76,
          factors: {
            ageCompatibility: 80,
            experienceMatch: 70,
            environmentSuitability: 78,
            emotionalReadiness: 75,
            financialStability: 78
          },
          recommendation: 'Moderate Match - Requires Additional Assessment'
        }
      ];
      setCompatibilityResults(results);
      setIsProcessing(false);
      toast.success('Compatibility analysis complete!');
    }, 2000);
  };

  const scanForFraud = () => {
    setIsProcessing(true);
    toast.info('Running AI fraud detection scan...');

    setTimeout(() => {
      const newAlert = {
        id: `FR-${String(fraudAlerts.length + 1).padStart(3, '0')}`,
        type: 'Anomaly Detection',
        severity: 'medium',
        description: 'Multiple applications with similar personal details detected',
        timestamp: new Date().toLocaleString(),
        status: 'active'
      };
      setFraudAlerts([newAlert, ...fraudAlerts]);
      setIsProcessing(false);
      toast.warning('New fraud alert detected!');
    }, 2500);
  };

  const analyzeBehaviour = (childId) => {
    toast.info(`Analyzing behavior patterns for ${childId}...`);
    setTimeout(() => {
      toast.success('Behavior analysis updated!');
    }, 1500);
  };

  const generateSmartRecommendations = () => {
    setIsProcessing(true);
    toast.info('AI generating smart recommendations...');

    setTimeout(() => {
      const recommendations = [
        'Match Emma Wilson with Smith family - 94% compatibility',
        'Schedule additional counseling for Michael Chen',
        'Review Application #2458 - potential fraud detected',
        'Initiate trial bonding for Johnson family',
        'Update medical records for 3 children due this week'
      ];

      setIsProcessing(false);
      toast.success('Generated 5 smart recommendations!', {
        description: recommendations[0]
      });
    }, 2000);
  };

  const testEncryption = () => {
    const sampleData = 'Sensitive child information';
    toast.info('Encrypting data with AES-256...');

    setTimeout(() => {
      const encrypted = btoa(sampleData); // Simulated encryption
      toast.success('Data encrypted successfully!', {
        description: `Encrypted: ${encrypted.substring(0, 20)}...`
      });
    }, 1000);
  };

  const verifyJWT = () => {
    toast.info('Verifying JWT token...');

    setTimeout(() => {
      toast.success('JWT token verified!', {
        description: 'Session valid until: 2026-06-03 18:00'
      });
    }, 800);
  };

  const checkPermissions = (role) => {
    const permissions = {
      admin: ['read', 'write', 'delete', 'approve', 'manage'],
      manager: ['read', 'write', 'approve'],
      counselor: ['read', 'write'],
      viewer: ['read']
    };

    toast.success(`${role} permissions:`, {
      description: permissions[role]?.join(', ')
    });
  };

  const viewAuditLogs = () => {
    toast.info('Loading audit logs...', {
      description: 'Last 24 hours: 147 actions logged'
    });
  };

  const trackIP = () => {
    const mockIP = '192.168.1.' + Math.floor(Math.random() * 255);
    toast.info('IP Tracking Active', {
      description: `Current IP: ${mockIP} - Location: New York, USA`
    });
  };

  const toggleAutomation = (feature) => {
    setAutomationEnabled(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    toast.success(`${feature} automation ${!automationEnabled[feature] ? 'enabled' : 'disabled'}`);
  };

  const triggerReminder = () => {
    toast.info('Reminder sent!', {
      description: 'Meeting reminder sent to Sarah Johnson'
    });
  };

  const autoScheduleMeeting = () => {
    setIsProcessing(true);
    toast.info('AI finding optimal meeting time...');

    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Meeting scheduled!', {
        description: 'June 5, 2026 at 2:00 PM - Smith Family Home Visit'
      });
    }, 1500);
  };

  const autoUpdateStatus = () => {
    toast.success('Status auto-updated!', {
      description: 'Application #2456 moved to "Trial Bonding" stage'
    });
  };

  const generateAutoReport = () => {
    setIsProcessing(true);
    toast.info('Generating automated report...');

    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Report generated!', {
        description: 'Monthly_Performance_Report_June_2026.pdf'
      });
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Features</h1>
        <p className="text-gray-600 mt-1">AI-powered features, security controls, and automation systems</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'ai'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Features
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'automation'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Automation
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* AI Features Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* AI Control Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI Control Panel</h2>
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={runCompatibilityMatching}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex flex-col items-center gap-2"
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">Run Compatibility</span>
              </button>
              <button
                onClick={scanForFraud}
                disabled={isProcessing}
                className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex flex-col items-center gap-2"
              >
                <AlertTriangle className="w-6 h-6" />
                <span className="text-sm">Scan Fraud</span>
              </button>
              <button
                onClick={() => analyzeBehaviour('CH001')}
                disabled={isProcessing}
                className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex flex-col items-center gap-2"
              >
                <Activity className="w-6 h-6" />
                <span className="text-sm">Analyze Behaviour</span>
              </button>
              <button
                onClick={generateSmartRecommendations}
                disabled={isProcessing}
                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex flex-col items-center gap-2"
              >
                <Brain className="w-6 h-6" />
                <span className="text-sm">Smart Recommendations</span>
              </button>
            </div>
          </div>

          {/* Compatibility Results */}
          {compatibilityResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">AI Compatibility Matching Results</h2>
              <div className="space-y-4">
                {compatibilityResults.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{result.childName} ↔ {result.parentName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{result.recommendation}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {Object.entries(result.factors).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${value >= 90 ? 'bg-green-500' : value >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fraud Detection Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI Fraud Detection Alerts</h2>
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">{alert.type}</h3>
                        <p className="text-sm mt-1">{alert.description}</p>
                        <p className="text-xs mt-2 opacity-75">{alert.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'active' ? 'bg-red-200 text-red-800' :
                        alert.status === 'investigating' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behaviour Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI Behaviour Analysis</h2>
            <div className="space-y-6">
              {behaviourData.map((child) => (
                <div key={child.childId} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">{child.childName} ({child.childId})</h3>

                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {Object.entries(child.patterns).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-xs text-gray-600 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <div className="relative w-20 h-20 mx-auto">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke={value >= 80 ? '#10b981' : value >= 60 ? '#3b82f6' : '#f59e0b'}
                              strokeWidth="6"
                              strokeDasharray={`${(value / 100) * 220} 220`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold">{value}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Concerns:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {child.concerns.map((concern, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Improvements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {child.improvements.map((improvement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Insights
                    </h4>
                    <p className="text-sm text-blue-800">{child.aiInsights}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Features Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Encryption */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AES-256 Encryption</h3>
                  <p className="text-sm text-gray-600">Military-grade data encryption</p>
                </div>
              </div>
              <button
                onClick={testEncryption}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Encryption
              </button>
            </div>

            {/* JWT Authentication */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">JWT Authentication</h3>
                  <p className="text-sm text-gray-600">Secure token-based auth</p>
                </div>
              </div>
              <button
                onClick={verifyJWT}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Verify JWT Token
              </button>
            </div>

            {/* Role Permissions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Role Permissions</h3>
                  <p className="text-sm text-gray-600">Granular access control</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => checkPermissions('admin')}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Admin
                </button>
                <button
                  onClick={() => checkPermissions('manager')}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Manager
                </button>
                <button
                  onClick={() => checkPermissions('counselor')}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Counselor
                </button>
                <button
                  onClick={() => checkPermissions('viewer')}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Viewer
                </button>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Audit Logs</h3>
                  <p className="text-sm text-gray-600">Complete activity tracking</p>
                </div>
              </div>
              <button
                onClick={viewAuditLogs}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                View Audit Logs
              </button>
            </div>

            {/* IP Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Globe className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">IP Tracking & Geolocation</h3>
                  <p className="text-sm text-gray-600">Real-time location monitoring</p>
                </div>
              </div>
              <button
                onClick={trackIP}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Track Current IP
              </button>
            </div>
          </div>

          {/* Security Status Dashboard */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Security Status Dashboard</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Encryption</span>
                </div>
                <p className="text-2xl font-bold text-green-600">Active</p>
                <p className="text-xs text-green-700 mt-1">AES-256 enabled</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Authentication</span>
                </div>
                <p className="text-2xl font-bold text-green-600">Secure</p>
                <p className="text-xs text-green-700 mt-1">JWT validated</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Permissions</span>
                </div>
                <p className="text-2xl font-bold text-green-600">4 Roles</p>
                <p className="text-xs text-green-700 mt-1">Access controlled</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Audit Logs</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">147</p>
                <p className="text-xs text-blue-700 mt-1">Last 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          {/* Automation Controls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Automation Controls</h2>
            <div className="space-y-4">
              {Object.entries(automationEnabled).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <p className="text-sm text-gray-600">
                      {key === 'reminders' && 'Automatically send meeting and deadline reminders'}
                      {key === 'scheduling' && 'AI-powered optimal meeting time finder'}
                      {key === 'statusUpdates' && 'Auto-update application statuses based on actions'}
                      {key === 'notifications' && 'Trigger notifications for important events'}
                      {key === 'reports' && 'Generate periodic reports automatically'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAutomation(key)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      enabled
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Automation Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={triggerReminder}
                disabled={!automationEnabled.reminders}
                className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                <Bell className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Send Reminder</div>
                  <div className="text-xs opacity-90">Trigger manual reminder</div>
                </div>
              </button>

              <button
                onClick={autoScheduleMeeting}
                disabled={!automationEnabled.scheduling || isProcessing}
                className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                <Calendar className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Auto-Schedule</div>
                  <div className="text-xs opacity-90">Find optimal meeting time</div>
                </div>
              </button>

              <button
                onClick={autoUpdateStatus}
                disabled={!automationEnabled.statusUpdates}
                className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                <RefreshCw className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Update Status</div>
                  <div className="text-xs opacity-90">Auto-progress applications</div>
                </div>
              </button>

              <button
                onClick={generateAutoReport}
                disabled={!automationEnabled.reports || isProcessing}
                className="bg-orange-600 text-white px-6 py-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                <FileText className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Generate Report</div>
                  <div className="text-xs opacity-90">Create automated report</div>
                </div>
              </button>
            </div>
          </div>

          {/* Automation Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Automation Statistics (Last 30 Days)</h2>
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">248</p>
                <p className="text-sm text-blue-700">Reminders Sent</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">67</p>
                <p className="text-sm text-purple-700">Meetings Scheduled</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">134</p>
                <p className="text-sm text-green-700">Status Updates</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <Bell className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-900">892</p>
                <p className="text-sm text-yellow-700">Notifications</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-900">28</p>
                <p className="text-sm text-orange-700">Reports Generated</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { exportToCSV } from '../../../../utils/exportUtils';
import { useState } from 'react';
import {
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Download,
  FileDown,
  Printer,
  FileSpreadsheet,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { toast } from 'sonner';

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('2026');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Analytics Data
  const analyticsCards = [
    { id: 'total-children', label: 'Total Children', value: 148, change: '+5', trend: 'up', icon: Users, color: 'bg-blue-500' },
    { id: 'total-apps', label: 'Total Applications', value: 342, change: '+28', trend: 'up', icon: FileText, color: 'bg-purple-500' },
    { id: 'approval-rate', label: 'Approval Rate', value: '68%', change: '+3%', trend: 'up', icon: CheckCircle, color: 'bg-green-500' },
    { id: 'rejection-rate', label: 'Rejection Rate', value: '18%', change: '-2%', trend: 'down', icon: XCircle, color: 'bg-red-500' },
    { id: 'pending-reviews', label: 'Pending Reviews', value: 27, change: '+8', trend: 'up', icon: Clock, color: 'bg-yellow-500' },
    { id: 'meetings', label: 'Meetings Conducted', value: 156, change: '+12', trend: 'up', icon: Calendar, color: 'bg-indigo-500' },
  ];

  // Monthly Adoption Data
  const monthlyAdoptionData = [
    { month: 'Jan', applications: 45, approvals: 32, rejections: 8, pending: 5 },
    { month: 'Feb', applications: 52, approvals: 35, rejections: 10, pending: 7 },
    { month: 'Mar', applications: 48, approvals: 30, rejections: 9, pending: 9 },
    { month: 'Apr', applications: 61, approvals: 42, rejections: 12, pending: 7 },
    { month: 'May', applications: 55, approvals: 38, rejections: 9, pending: 8 },
    { month: 'Jun', applications: 81, approvals: 55, rejections: 15, pending: 11 },
  ];

  // Application Growth Trend
  const applicationGrowthData = [
    { month: 'Jan', applications: 45, adoptions: 32 },
    { month: 'Feb', applications: 52, adoptions: 35 },
    { month: 'Mar', applications: 48, adoptions: 30 },
    { month: 'Apr', applications: 61, adoptions: 42 },
    { month: 'May', applications: 55, adoptions: 38 },
    { month: 'Jun', applications: 81, adoptions: 55 },
  ];

  // Child Demographics - Age Distribution
  const ageDistributionData = [
    { range: '0-2 years', count: 25, percentage: 17 },
    { range: '3-5 years', count: 35, percentage: 24 },
    { range: '6-8 years', count: 42, percentage: 28 },
    { range: '9-12 years', count: 28, percentage: 19 },
    { range: '13-17 years', count: 18, percentage: 12 },
  ];

  // Gender Distribution
  const genderDistributionData = [
    { name: 'Male', value: 78, color: '#3b82f6' },
    { name: 'Female', value: 70, color: '#ec4899' },
  ];

  // Health Categories
  const healthCategoriesData = [
    { name: 'Excellent', value: 95, color: '#10b981' },
    { name: 'Good', value: 38, color: '#3b82f6' },
    { name: 'Fair', value: 12, color: '#f59e0b' },
    { name: 'Special Care', value: 3, color: '#ef4444' },
  ];

  // Complaint Trends
  const complaintTrendsData = [
    { month: 'Jan', total: 4, resolved: 3, pending: 1 },
    { month: 'Feb', total: 6, resolved: 5, pending: 1 },
    { month: 'Mar', total: 5, resolved: 4, pending: 1 },
    { month: 'Apr', total: 3, resolved: 3, pending: 0 },
    { month: 'May', total: 7, resolved: 5, pending: 2 },
    { month: 'Jun', total: 6, resolved: 4, pending: 2 },
  ];

  // Revenue Data
  const revenueData = [
    { month: 'Jan', fees: 15000, donations: 8500, total: 23500 },
    { month: 'Feb', fees: 18000, donations: 12000, total: 30000 },
    { month: 'Mar', fees: 16500, donations: 9500, total: 26000 },
    { month: 'Apr', fees: 21000, donations: 15000, total: 36000 },
    { month: 'May', fees: 19500, donations: 11000, total: 30500 },
    { month: 'Jun', fees: 28000, donations: 18500, total: 46500 },
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.total, 0);
  const totalFees = revenueData.reduce((sum, item) => sum + item.fees, 0);
  const totalDonations = revenueData.reduce((sum, item) => sum + item.donations, 0);

  const handleExportPDF = () => {
    toast.success('Generating PDF report...');
    setTimeout(() => {
      toast.success('PDF report downloaded successfully');
    }, 1500);
  };

  const handleExportExcel = () => {
    toast.success('Generating Excel report...');
    setTimeout(() => {
      toast.success('Excel report downloaded successfully');
    }, 1500);
  };

  const handlePrint = () => {
    toast.info('Opening print dialog...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleGenerateSummary = () => {
    toast.success('Generating executive summary...');
    setTimeout(() => {
      toast.success('Summary report generated successfully');
    }, 1500);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Monitor orphanage performance and generate reports</p>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2026">Year 2026</option>
              <option value="2025">Year 2025</option>
              <option value="Q2-2026">Q2 2026</option>
              <option value="Jun-2026">June 2026</option>
            </select>

            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="overview">Overview Report</option>
              <option value="applications">Applications Report</option>
              <option value="children">Children Report</option>
              <option value="financial">Financial Report</option>
              <option value="complaints">Complaints Report</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToCSV([], 'data_export.csv')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => exportToCSV([], 'data_export.csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleGenerateSummary}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Generate Summary
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {analyticsCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingUp;

          return (
            <div key={card.id} className="bg-white rounded-lg shadow-md p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{card.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Total Revenue (2026)</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${totalFees.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Application Fees Collected</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${totalDonations.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Donations Received</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Adoption Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Monthly Adoption Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyAdoptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar key="bar-applications" dataKey="applications" fill="#3b82f6" name="Applications" />
              <Bar key="bar-approvals" dataKey="approvals" fill="#10b981" name="Approvals" />
              <Bar key="bar-rejections" dataKey="rejections" fill="#ef4444" name="Rejections" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Growth Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Application Growth Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={applicationGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area key="area-applications" type="monotone" dataKey="applications" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Applications" />
              <Area key="area-adoptions" type="monotone" dataKey="adoptions" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Adoptions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Age Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="range" type="category" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar key="bar-age-count" dataKey="count" fill="#8b5cf6" name="Children" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Gender Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {genderDistributionData.map((entry, index) => (
                  <Cell key={`gender-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Health Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Health Categories</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthCategoriesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {healthCategoriesData.map((entry, index) => (
                  <Cell key={`health-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Complaint Trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complaintTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line key="line-total" type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} name="Total" />
              <Line key="line-resolved" type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
              <Line key="line-pending" type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Revenue Analysis (2026)</h2>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area key="area-fees" type="monotone" dataKey="fees" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} name="Application Fees ($)" />
            <Area key="area-donations" type="monotone" dataKey="donations" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Donations ($)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Summary Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Q1 2026</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Q2 2026</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Applications Received</td>
                <td className="px-6 py-4 text-gray-700">145</td>
                <td className="px-6 py-4 text-gray-700">197</td>
                <td className="px-6 py-4 font-semibold text-gray-900">342</td>
                <td className="px-6 py-4 text-green-600 font-medium">+35.9%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Applications Approved</td>
                <td className="px-6 py-4 text-gray-700">97</td>
                <td className="px-6 py-4 text-gray-700">135</td>
                <td className="px-6 py-4 font-semibold text-gray-900">232</td>
                <td className="px-6 py-4 text-green-600 font-medium">+39.2%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Applications Rejected</td>
                <td className="px-6 py-4 text-gray-700">27</td>
                <td className="px-6 py-4 text-gray-700">36</td>
                <td className="px-6 py-4 font-semibold text-gray-900">63</td>
                <td className="px-6 py-4 text-orange-600 font-medium">+33.3%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Meetings Conducted</td>
                <td className="px-6 py-4 text-gray-700">68</td>
                <td className="px-6 py-4 text-gray-700">88</td>
                <td className="px-6 py-4 font-semibold text-gray-900">156</td>
                <td className="px-6 py-4 text-green-600 font-medium">+29.4%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Complaints Filed</td>
                <td className="px-6 py-4 text-gray-700">15</td>
                <td className="px-6 py-4 text-gray-700">16</td>
                <td className="px-6 py-4 font-semibold text-gray-900">31</td>
                <td className="px-6 py-4 text-red-600 font-medium">+6.7%</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 font-bold text-gray-900">Total Revenue</td>
                <td className="px-6 py-4 font-semibold text-gray-900">$79,500</td>
                <td className="px-6 py-4 font-semibold text-gray-900">$113,000</td>
                <td className="px-6 py-4 font-bold text-green-600">$192,500</td>
                <td className="px-6 py-4 text-green-600 font-bold">+42.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

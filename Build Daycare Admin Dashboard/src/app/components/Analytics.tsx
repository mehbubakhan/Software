import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Users, TrendingUp, DollarSign, Bus, Star, Award,
  Download, FileText, Printer, RefreshCw, ChevronDown
} from "lucide-react";
import { Card, PageHeader, Btn } from "./ui";
import { enrollmentTrend, attendanceData, ageDistribution, revenueData } from "./mockData";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#f87171"];

const staffDistribution = [
  { name: "Teachers", value: 4 },
  { name: "Nannies", value: 1 },
  { name: "Drivers", value: 2 },
  { name: "Nurses", value: 1 },
];

const monthlyBilling = [
  { month: "Jan", collected: 22000, pending: 2500 },
  { month: "Feb", collected: 24000, pending: 2000 },
  { month: "Mar", collected: 25500, pending: 1700 },
  { month: "Apr", collected: 24800, pending: 2000 },
  { month: "May", collected: 27200, pending: 2200 },
  { month: "Jun", collected: 26200, pending: 4400 },
];

const incidentTrend = [
  { month: "Jan", incidents: 3 }, { month: "Feb", incidents: 2 },
  { month: "Mar", incidents: 4 }, { month: "Apr", incidents: 1 },
  { month: "May", incidents: 3 }, { month: "Jun", incidents: 2 },
];

const attendanceTrend = [
  { month: "Jan", rate: 88 }, { month: "Feb", rate: 90 },
  { month: "Mar", rate: 87 }, { month: "Apr", rate: 92 },
  { month: "May", rate: 91 }, { month: "Jun", rate: 94 },
];

const admissionGrowth = [
  { month: "Jan", new: 3, withdrawn: 1 }, { month: "Feb", new: 4, withdrawn: 0 },
  { month: "Mar", new: 2, withdrawn: 1 }, { month: "Apr", new: 5, withdrawn: 0 },
  { month: "May", new: 3, withdrawn: 2 }, { month: "Jun", new: 4, withdrawn: 1 },
];

const activityPatterns = [
  { activity: "Arts & Crafts", completions: 48 },
  { activity: "Outdoor Play", completions: 55 },
  { activity: "Story Time", completions: 42 },
  { activity: "Music", completions: 38 },
  { activity: "Math Games", completions: 30 },
  { activity: "Science", completions: 25 },
];

const healthStats = [
  { name: "Healthy", value: 28 },
  { name: "Watch", value: 5 },
  { name: "On Medication", value: 4 },
  { name: "Allergy", value: 3 },
];

const transportUsage = [
  { month: "Jan", bus: 18, selfPickup: 12 }, { month: "Feb", bus: 20, selfPickup: 10 },
  { month: "Mar", bus: 19, selfPickup: 11 }, { month: "Apr", bus: 22, selfPickup: 8 },
  { month: "May", bus: 21, selfPickup: 9 }, { month: "Jun", bus: 23, selfPickup: 7 },
];

const REPORT_PERIODS = ["This Month", "Last Month", "Last 3 Months", "Last 6 Months", "This Year"];

type ReportTab = "overview" | "attendance" | "financial" | "health" | "activities" | "transport";

const TABS: { id: ReportTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "attendance", label: "Attendance" },
  { id: "financial", label: "Financial" },
  { id: "health", label: "Health" },
  { id: "activities", label: "Activities" },
  { id: "transport", label: "Transport" },
];

function exportToast(type: string) {
  alert(`Exporting ${type} report... In production this would download a file.`);
}

export function Analytics() {
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [period, setPeriod] = useState("This Month");
  const [showPeriod, setShowPeriod] = useState(false);

  const kpis = [
    { label: "Total Children", value: "32", sub: "+4 this month", color: "text-indigo-600", icon: <Users size={20} className="text-indigo-500" />, bg: "bg-indigo-50" },
    { label: "Attendance Rate", value: "94%", sub: "+3% vs last month", color: "text-green-600", icon: <TrendingUp size={20} className="text-green-500" />, bg: "bg-green-50" },
    { label: "Monthly Revenue", value: "$30.6K", sub: "+4% vs May", color: "text-blue-600", icon: <DollarSign size={20} className="text-blue-500" />, bg: "bg-blue-50" },
    { label: "Transport Usage", value: "72%", sub: "23 of 32 children", color: "text-cyan-600", icon: <Bus size={20} className="text-cyan-500" />, bg: "bg-cyan-50" },
    { label: "Parent Satisfaction", value: "4.7/5", sub: "Based on 28 reviews", color: "text-yellow-600", icon: <Star size={20} className="text-yellow-500" />, bg: "bg-yellow-50" },
    { label: "Staff Performance", value: "91%", sub: "Avg. score this month", color: "text-purple-600", icon: <Award size={20} className="text-purple-500" />, bg: "bg-purple-50" },
  ];

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive daycare performance insights"
        action={
          <div className="flex gap-2 items-center">
            {/* Period selector */}
            <div className="relative">
              <button onClick={() => setShowPeriod(p => !p)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <RefreshCw size={14} /> {period} <ChevronDown size={14} />
              </button>
              {showPeriod && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44">
                  {REPORT_PERIODS.map(p => (
                    <button key={p} onClick={() => { setPeriod(p); setShowPeriod(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${period === p ? "text-indigo-600" : "text-gray-700"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Btn variant="secondary" size="sm" onClick={() => exportToast("PDF")}>
              <FileText size={14} /> PDF
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => exportToast("Excel")}>
              <Download size={14} /> Excel
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => exportToast("Print")}>
              <Printer size={14} /> Print
            </Btn>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map(k => (
          <Card key={k.label} className="p-4">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
              {k.icon}
            </div>
            <p className={`text-2xl ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
              activeTab === t.id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Enrollment Trend (6 months)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area key="ov-enrolled" type="monotone" dataKey="enrolled" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Monthly Billing vs Collections</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyBilling}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                  <Legend />
                  <Bar key="ov-billing-collected" dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
                  <Bar key="ov-billing-pending" dataKey="pending" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Age Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={ageDistribution} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                    {ageDistribution.map((_entry, i) => <Cell key={`an-overview-age-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Staff Roles</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={staffDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value"
                    label={({ name }) => name} fontSize={11}>
                    {staffDistribution.map((_entry, i) => <Cell key={`an-overview-staff-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Monthly Incidents</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={incidentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line key="ov-incidents" type="monotone" dataKey="incidents" stroke="#f87171" strokeWidth={2} dot={{ fill: "#f87171" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="text-gray-700 mb-4">Weekly Attendance Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar key="ov-week-present" dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present" />
                <Bar key="ov-week-absent" dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Avg. Daily Attendance", value: "94%", sub: "30 of 32 children daily", color: "text-green-600" },
              { label: "Perfect Attendance", value: "12", sub: "Children this month", color: "text-indigo-600" },
              { label: "Chronic Absenteeism", value: "2", sub: "Below 80% attendance", color: "text-red-600" },
            ].map(k => (
              <Card key={k.label} className="p-5">
                <p className="text-gray-500 text-sm">{k.label}</p>
                <p className={`text-2xl mt-1 ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="text-gray-700 mb-4">Attendance Rate Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Area key="att-rate" type="monotone" dataKey="rate" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} name="Attendance Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="text-gray-700 mb-4">Daily Attendance This Week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar key="att-week-present" dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present" />
                <Bar key="att-week-absent" dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeTab === "financial" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: "$30.6K", sub: "June 2026", color: "text-green-600" },
              { label: "Outstanding", value: "$4.4K", sub: "14% of total", color: "text-red-600" },
              { label: "Collection Rate", value: "87%", sub: "+2% vs last month", color: "text-blue-600" },
              { label: "Avg. Invoice", value: "$822", sub: "Per family/month", color: "text-purple-600" },
            ].map(k => (
              <Card key={k.label} className="p-5">
                <p className="text-gray-500 text-sm">{k.label}</p>
                <p className={`text-2xl mt-1 ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="text-gray-700 mb-4">Revenue Report (6 months)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyBilling}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Legend />
                <Area key="fin-collected" type="monotone" dataKey="collected" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} name="Collected" />
                <Area key="fin-pending" type="monotone" dataKey="pending" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.2} strokeWidth={2} name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700">Revenue Summary</h3>
              <Btn variant="secondary" size="sm" onClick={() => exportToast("Financial Summary")}>
                <Download size={14} /> Export
              </Btn>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2">Month</th>
                  <th className="pb-2 text-right">Collected</th>
                  <th className="pb-2 text-right">Pending</th>
                  <th className="pb-2 text-right">Total</th>
                  <th className="pb-2 text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyBilling.map(row => {
                  const total = row.collected + row.pending;
                  const rate = Math.round((row.collected / total) * 100);
                  return (
                    <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5">{row.month} 2026</td>
                      <td className="py-2.5 text-right text-green-600">${row.collected.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-amber-600">${row.pending.toLocaleString()}</td>
                      <td className="py-2.5 text-right">${total.toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${rate >= 90 ? "bg-green-100 text-green-700" : rate >= 80 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {activeTab === "health" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Healthy Children", value: "28", sub: "87.5% of total", color: "text-green-600" },
              { label: "Under Watch", value: "5", sub: "Temperature/Allergy", color: "text-yellow-600" },
              { label: "On Medication", value: "4", sub: "Active prescriptions", color: "text-blue-600" },
              { label: "Vaccinations Due", value: "3", sub: "Due this month", color: "text-red-600" },
            ].map(k => (
              <Card key={k.label} className="p-5">
                <p className="text-gray-500 text-sm">{k.label}</p>
                <p className={`text-2xl mt-1 ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Health Status Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={healthStats} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                    {healthStats.map((_entry, i) => <Cell key={`an-health-pie-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Health Incidents Trend</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={incidentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line key="health-incidents" type="monotone" dataKey="incidents" stroke="#f87171" strokeWidth={2} dot={{ fill: "#f87171", r: 5 }} name="Incidents" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="text-gray-700 mb-4">Common Health Issues This Month</h3>
            <div className="space-y-3">
              {[
                { issue: "Fever / Temperature", count: 5, pct: 60 },
                { issue: "Food Allergy Reaction", count: 2, pct: 24 },
                { issue: "Minor Injury (Fall)", count: 3, pct: 36 },
                { issue: "Cold / Runny Nose", count: 4, pct: 48 },
                { issue: "Asthma Episode", count: 1, pct: 12 },
              ].map(h => (
                <div key={h.issue} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-48 shrink-0">{h.issue}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${h.pct}%` }} />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{h.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Activities Completed", value: "238", sub: "This month", color: "text-indigo-600" },
              { label: "Avg. Per Child", value: "7.4", sub: "Activities/day", color: "text-green-600" },
              { label: "Most Popular", value: "Outdoor Play", sub: "55 completions", color: "text-blue-600" },
            ].map(k => (
              <Card key={k.label} className="p-5">
                <p className="text-gray-500 text-sm">{k.label}</p>
                <p className={`text-2xl mt-1 ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="text-gray-700 mb-4">Activity Completions by Type</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={activityPatterns} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="activity" tick={{ fontSize: 12 }} width={110} />
                <Tooltip />
                <Bar key="act-completions" dataKey="completions" fill="#6366f1" radius={[0, 4, 4, 0]} name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Mood Tracking (Monthly)</h3>
              <div className="space-y-3">
                {[
                  { mood: "😊 Happy", pct: 62, color: "bg-green-400" },
                  { mood: "😐 Neutral", pct: 22, color: "bg-yellow-400" },
                  { mood: "😢 Sad", pct: 9, color: "bg-blue-400" },
                  { mood: "😤 Frustrated", pct: 7, color: "bg-red-400" },
                ].map(m => (
                  <div key={m.mood} className="flex items-center gap-3">
                    <span className="text-sm w-32 shrink-0">{m.mood}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{m.pct}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Meal Consumption Rates</h3>
              <div className="space-y-3">
                {[
                  { meal: "Breakfast", rate: 92 },
                  { meal: "Morning Snack", rate: 85 },
                  { meal: "Lunch", rate: 78 },
                  { meal: "Afternoon Snack", rate: 90 },
                  { meal: "Dinner", rate: 70 },
                ].map(m => (
                  <div key={m.meal} className="flex items-center gap-3">
                    <span className="text-sm w-36 shrink-0">{m.meal}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${m.rate}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{m.rate}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "transport" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Bus Users", value: "23", sub: "72% of children", color: "text-blue-600" },
              { label: "Routes Active", value: "3", sub: "Morning & Evening", color: "text-green-600" },
              { label: "On-Time Rate", value: "94%", sub: "This month", color: "text-indigo-600" },
              { label: "Avg. Delay", value: "4 min", sub: "When delayed", color: "text-orange-600" },
            ].map(k => (
              <Card key={k.label} className="p-5">
                <p className="text-gray-500 text-sm">{k.label}</p>
                <p className={`text-2xl mt-1 ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="text-gray-700 mb-4">Bus vs Self-Pickup Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={transportUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar key="tr-bus" dataKey="bus" fill="#6366f1" radius={[4, 4, 0, 0]} name="Bus" />
                <Bar key="tr-selfpickup" dataKey="selfPickup" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Self Pickup" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Vehicle Utilization</h3>
              <div className="space-y-3">
                {[
                  { vehicle: "VH-101 (Bus A)", capacity: 15, used: 12, status: "Active" },
                  { vehicle: "VH-102 (Van B)", capacity: 10, used: 8, status: "Active" },
                  { vehicle: "VH-103 (Mini Van)", capacity: 8, used: 3, status: "Maintenance" },
                ].map(v => (
                  <div key={v.vehicle} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{v.vehicle}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${v.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {v.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(v.used / v.capacity) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{v.used}/{v.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-gray-700 mb-4">Pickup Confirmation Rate</h3>
              <div className="space-y-2">
                {[
                  { day: "Monday", confirmed: 22, total: 23 },
                  { day: "Tuesday", confirmed: 21, total: 23 },
                  { day: "Wednesday", confirmed: 23, total: 23 },
                  { day: "Thursday", confirmed: 20, total: 23 },
                  { day: "Friday", confirmed: 22, total: 23 },
                ].map(d => {
                  const pct = Math.round((d.confirmed / d.total) * 100);
                  return (
                    <div key={d.day} className="flex items-center gap-3">
                      <span className="text-sm w-24 text-gray-600">{d.day}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-16 text-right">{d.confirmed}/{d.total} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  Baby, Users, UserCheck, AlertTriangle, TrendingUp, Calendar,
  CreditCard, Bus, Plus, UserPlus, UserCog, Monitor, Upload,
  Bell, X, CheckCircle, Clock, Pill, MapPin, MessageSquare,
  ChevronRight, Activity, Utensils, Moon, Car, Siren
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Card, PageHeader, StatusBadge, Modal, Btn, Avatar } from "./ui";
import {
  mockChildren, mockStaff, mockAdmissions, mockNotifications,
  enrollmentTrend, attendanceData, ageDistribution, revenueData
} from "./mockData";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];

// ── Recent activities feed ─────────────────────────────────────────────────
const initialActivities = [
  { id: "ra1", icon: <UserPlus size={14} />, color: "bg-indigo-100 text-indigo-600", title: "New admission: Lucas Moore", sub: "Application submitted by Anna Moore", time: "10 min ago", type: "admission" },
  { id: "ra2", icon: <MessageSquare size={14} />, color: "bg-blue-100 text-blue-600", title: "Message from Sarah Johnson", sub: "\"Is Emma eating well today?\"", time: "32 min ago", type: "message" },
  { id: "ra3", icon: <UserCheck size={14} />, color: "bg-green-100 text-green-600", title: "Staff attendance logged", sub: "Jennifer Clark checked in at 07:45 AM", time: "1 hr ago", type: "staff" },
  { id: "ra4", icon: <Utensils size={14} />, color: "bg-orange-100 text-orange-600", title: "Lunch served — Sunflower group", sub: "Meal: Chicken soup, fruit salad, juice", time: "2 hrs ago", type: "meal" },
  { id: "ra5", icon: <Moon size={14} />, color: "bg-purple-100 text-purple-600", title: "Nap time — Rainbow group", sub: "12 children sleeping, 2 staff supervising", time: "2 hrs ago", type: "sleep" },
  { id: "ra6", icon: <Car size={14} />, color: "bg-teal-100 text-teal-600", title: "Bus A departed — North Route", sub: "12 children on board, ETA 35 mins", time: "3 hrs ago", type: "vehicle" },
  { id: "ra7", icon: <Siren size={14} />, color: "bg-red-100 text-red-600", title: "Emergency alert resolved", sub: "Emma J. allergic reaction — treated & stable", time: "4 hrs ago", type: "emergency" },
  { id: "ra8", icon: <Baby size={14} />, color: "bg-pink-100 text-pink-600", title: "Activity completed: Finger Painting", sub: "Sunflower group — 5 children participated", time: "5 hrs ago", type: "activity" },
];

// ── Upcoming events ────────────────────────────────────────────────────────
const initialEvents = [
  { id: "e1", date: "Jun 5", day: "Thu", title: "Parent-Teacher Meeting", type: "meeting", time: "10:00 AM", color: "border-l-indigo-500" },
  { id: "e2", date: "Jun 6", day: "Fri", title: "Vaccination Day (MMR)", type: "health", time: "09:00 AM", color: "border-l-red-500" },
  { id: "e3", date: "Jun 7", day: "Sat", title: "Payment Deadline — June", type: "payment", time: "All day", color: "border-l-yellow-500" },
  { id: "e4", date: "Jun 10", day: "Tue", title: "Sports Day", type: "event", time: "08:30 AM", color: "border-l-green-500" },
  { id: "e5", date: "Jun 12", day: "Thu", title: "Staff Shift Review", type: "staff", time: "02:00 PM", color: "border-l-purple-500" },
  { id: "e6", date: "Jun 15", day: "Sun", title: "End-of-month Reports Due", type: "admin", time: "All day", color: "border-l-gray-500" },
];

const eventTypeIcon: Record<string, React.ReactNode> = {
  meeting: <Users size={13} className="text-indigo-600" />,
  health: <Pill size={13} className="text-red-500" />,
  payment: <CreditCard size={13} className="text-yellow-600" />,
  event: <Calendar size={13} className="text-green-600" />,
  staff: <UserCog size={13} className="text-purple-600" />,
  admin: <Activity size={13} className="text-gray-500" />,
};

// ── Live notifications ──────────────────────────────────────────────────────
const initialLiveNotifs = [
  { id: "ln1", type: "pickup", icon: <Car size={14} />, bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500", title: "Pickup Reminder", desc: "Noah Davis scheduled pickup at 3:30 PM — 45 mins", time: "Now" },
  { id: "ln2", type: "medicine", icon: <Pill size={14} />, bg: "bg-orange-50 border-orange-200", dot: "bg-orange-500", title: "Medicine Reminder", desc: "Mason Anderson — cough syrup due at 2:00 PM", time: "In 15 min" },
  { id: "ln3", type: "emergency", icon: <Siren size={14} />, bg: "bg-red-50 border-red-200", dot: "bg-red-500", title: "Emergency Alert", desc: "Emma Johnson allergic reaction — antihistamine given", time: "10 min ago" },
  { id: "ln4", type: "cctv", icon: <Monitor size={14} />, bg: "bg-purple-50 border-purple-200", dot: "bg-purple-500", title: "CCTV Alert", desc: "Unrecognized person at entrance — resolved", time: "25 min ago" },
  { id: "ln5", type: "payment", icon: <CreditCard size={14} />, bg: "bg-yellow-50 border-yellow-200", dot: "bg-yellow-500", title: "Payment Alert", desc: "Robert Davis invoice overdue — $850 pending", time: "1 hr ago" },
  { id: "ln6", type: "message", icon: <MessageSquare size={14} />, bg: "bg-green-50 border-green-200", dot: "bg-green-500", title: "Parent Message", desc: "Michael Smith: \"Thanks for the update!\"", time: "2 hrs ago" },
];

type QuickAction = { id: string; label: string; icon: React.ReactNode; color: string; action: () => void };

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [events, setEvents] = useState(initialEvents);
  const [liveNotifs, setLiveNotifs] = useState(initialLiveNotifs);
  const [activityFilter, setActivityFilter] = useState("all");
  const [quickModal, setQuickModal] = useState<string | null>(null);
  const [newEventForm, setNewEventForm] = useState({ date: "", title: "", type: "meeting", time: "" });
  const [notifModal, setNotifModal] = useState<typeof initialLiveNotifs[0] | null>(null);

  // ── Quick action handlers ────────────────────────────────────────────────
  const quickActions: QuickAction[] = [
    { id: "add-child", label: "Add Child", icon: <Baby size={18} />, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100", action: () => setQuickModal("add-child") },
    { id: "new-admission", label: "New Admission", icon: <UserPlus size={18} />, color: "bg-blue-50 text-blue-600 hover:bg-blue-100", action: () => setQuickModal("new-admission") },
    { id: "add-staff", label: "Add Staff", icon: <UserCog size={18} />, color: "bg-purple-50 text-purple-600 hover:bg-purple-100", action: () => setQuickModal("add-staff") },
    { id: "open-cctv", label: "Open CCTV", icon: <Monitor size={18} />, color: "bg-teal-50 text-teal-600 hover:bg-teal-100", action: () => onNavigate?.("live-monitoring") },
    { id: "track-vehicle", label: "Track Vehicle", icon: <Bus size={18} />, color: "bg-green-50 text-green-600 hover:bg-green-100", action: () => onNavigate?.("transportation") },
    { id: "upload-activity", label: "Upload Activity", icon: <Upload size={18} />, color: "bg-orange-50 text-orange-600 hover:bg-orange-100", action: () => setQuickModal("upload-activity") },
    { id: "send-notification", label: "Send Notification", icon: <Bell size={18} />, color: "bg-pink-50 text-pink-600 hover:bg-pink-100", action: () => setQuickModal("send-notification") },
  ];

  const activeChildren = mockChildren.filter(c => c.status === "Active").length;
  const activeStaff = mockStaff.filter(s => s.status === "Active").length;
  const pendingAdmissions = mockAdmissions.filter(a => a.status === "Pending").length;
  const alerts = mockNotifications.filter(n => !n.read).length;

  const stats = [
    { label: "Total Children", value: activeChildren, sub: "Enrolled", icon: <Baby size={18} />, color: "bg-indigo-500", light: "bg-indigo-50" },
    { label: "Present Today", value: 31, sub: "86% attendance", icon: <UserCheck size={18} />, color: "bg-green-500", light: "bg-green-50" },
    { label: "Absent Today", value: 5, sub: "With notifications", icon: <Users size={18} />, color: "bg-red-500", light: "bg-red-50" },
    { label: "New Admissions", value: pendingAdmissions, sub: "Awaiting review", icon: <UserPlus size={18} />, color: "bg-blue-500", light: "bg-blue-50" },
    { label: "Pending Payments", value: 3, sub: "$2,350 outstanding", icon: <CreditCard size={18} />, color: "bg-yellow-500", light: "bg-yellow-50" },
    { label: "Active Staff", value: activeStaff, sub: "1 on leave today", icon: <UserCog size={18} />, color: "bg-purple-500", light: "bg-purple-50" },
    { label: "Vehicles Running", value: 2, sub: "1 en route now", icon: <Bus size={18} />, color: "bg-teal-500", light: "bg-teal-50" },
    { label: "Emergency Alerts", value: alerts > 0 ? 1 : 0, sub: alerts > 0 ? "Requires action" : "All clear", icon: <AlertTriangle size={18} />, color: alerts > 0 ? "bg-red-600" : "bg-gray-400", light: alerts > 0 ? "bg-red-50" : "bg-gray-50" },
  ];

  const filteredActivities = activityFilter === "all"
    ? activities
    : activities.filter(a => a.type === activityFilter);

  function dismissNotif(id: string) {
    setLiveNotifs(prev => prev.filter(n => n.id !== id));
  }

  function addEvent() {
    if (!newEventForm.title || !newEventForm.date) return;
    const [, month, day] = newEventForm.date.split("-");
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const d = new Date(newEventForm.date);
    setEvents(prev => [...prev, {
      id: `e${Date.now()}`,
      date: `${monthNames[parseInt(month)]} ${parseInt(day)}`,
      day: days[d.getDay() + 1] || "Mon",
      title: newEventForm.title,
      type: newEventForm.type,
      time: newEventForm.time || "TBD",
      color: "border-l-indigo-500",
    }]);
    setNewEventForm({ date: "", title: "", type: "meeting", time: "" });
    setQuickModal(null);
  }

  // Quick action form state
  const [qaForm, setQaForm] = useState<Record<string, string>>({});
  const qf = (k: string, v: string) => setQaForm(p => ({ ...p, [k]: v }));

  function submitQuickAction() {
    // Add to recent activities feed to show it "worked"
    const labels: Record<string, string> = {
      "add-child": `New child added: ${qaForm.name || "Unknown"}`,
      "new-admission": `Admission submitted: ${qaForm.name || "Unknown"}`,
      "add-staff": `Staff member added: ${qaForm.name || "Unknown"}`,
      "upload-activity": `Activity uploaded: ${qaForm.title || "Activity"}`,
      "send-notification": `Notification sent: ${qaForm.message || "Broadcast message"}`,
    };
    if (quickModal && labels[quickModal]) {
      setActivities(prev => [{
        id: `ra${Date.now()}`,
        icon: <Bell size={14} />,
        color: "bg-indigo-100 text-indigo-600",
        title: labels[quickModal!],
        sub: `Added just now by Dr. Patricia Lee`,
        time: "Just now",
        type: "activity",
      }, ...prev]);
    }
    setQaForm({});
    setQuickModal(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Overview" subtitle="Welcome back, Dr. Patricia Lee — Thursday, June 4, 2026" />

      {/* ── 8 KPI Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {stats.map(s => (
          <Card key={s.label} className={`p-3 cursor-default ${s.light} border-0`}>
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-white mb-2`}>
              {s.icon}
            </div>
            <p className="text-xl" style={{ fontWeight: 700 }}>{s.value}</p>
            <p className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <Card className="p-4">
        <h3 className="text-gray-700 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(qa => (
            <button
              key={qa.id}
              onClick={qa.action}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${qa.color}`}
              style={{ fontWeight: 500 }}
            >
              {qa.icon}
              {qa.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Main content grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Activities */}
        <div className="xl:col-span-2">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700">Recent Activities</h3>
              <div className="flex gap-1 flex-wrap">
                {["all", "admission", "message", "staff", "meal", "vehicle", "emergency"].map(f => (
                  <button key={f} onClick={() => setActivityFilter(f)}
                    className={`px-2.5 py-1 rounded-full text-xs capitalize transition-all ${
                      activityFilter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredActivities.map(a => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{a.sub}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{a.time}</span>
                </div>
              ))}
              {filteredActivities.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">No activities of this type</p>
              )}
            </div>
          </Card>
        </div>

        {/* Live Notification Panel */}
        <div>
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Alerts
              </h3>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {liveNotifs.length} active
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {liveNotifs.map(n => (
                <div key={n.id} className={`border rounded-xl p-3 ${n.bg} relative`}>
                  <button
                    onClick={() => dismissNotif(n.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                  <div className="flex items-start gap-2 pr-4">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-xs" style={{ fontWeight: 600 }}>{n.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{n.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              {liveNotifs.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle size={24} className="mx-auto mb-2 text-green-400" />
                  <p className="text-sm">All clear! No live alerts.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Charts row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-600" />
            <h3 className="text-gray-700">Enrollment Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="dash-colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="enrolled" stroke="#6366f1" fill="url(#dash-colorEnrolled)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-blue-600" />
            <h3 className="text-gray-700">Weekly Attendance</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Bottom row: Events + Age distribution + Revenue ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Upcoming Events */}
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700">Upcoming Events</h3>
            <button
              onClick={() => setQuickModal("add-event")}
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {events.map(e => (
              <div key={e.id} className={`flex items-start gap-3 p-3 rounded-xl bg-gray-50 border-l-4 ${e.color}`}>
                <div className="text-center shrink-0">
                  <p className="text-xs text-gray-400">{e.day}</p>
                  <p className="text-sm" style={{ fontWeight: 700 }}>{e.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    {eventTypeIcon[e.type]}
                    <p className="text-xs text-gray-800 truncate" style={{ fontWeight: 500 }}>{e.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {e.time}
                  </p>
                </div>
                <button onClick={() => setEvents(prev => prev.filter(ev => ev.id !== e.id))} className="text-gray-300 hover:text-red-400 shrink-0">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Age Distribution */}
        <Card className="p-5">
          <h3 className="text-gray-700 mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={ageDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {ageDistribution.map((entry, i) => (
                  <Cell key={`dash-age-${entry.name}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue */}
        <Card className="p-5">
          <h3 className="text-gray-700 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="dash-colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#dash-colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Groups + Admissions pipeline ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-gray-700 mb-4">Children by Group</h3>
          <div className="space-y-3">
            {["Sunflower", "Butterfly", "Rainbow", "Star"].map(group => {
              const count = mockChildren.filter(c => c.group === group && c.status === "Active").length;
              const capacity = 10;
              const pct = Math.round((count / capacity) * 100);
              return (
                <div key={group}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{group}</span>
                    <span className="text-xs text-gray-500">{count}/{capacity} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-gray-700 mb-3">Admissions Pipeline</h3>
          <div className="grid grid-cols-2 gap-3">
            {(["Pending", "Approved", "Waitlisted", "Rejected"] as const).map(s => (
              <div key={s} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl" style={{ fontWeight: 700 }}>{mockAdmissions.filter(a => a.status === s).length}</p>
                <div className="mt-1"><StatusBadge status={s} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Quick Action Modals ───────────────────────────────────────────── */}
      <Modal open={quickModal === "add-child"} onClose={() => setQuickModal(null)} title="Quick: Add Child">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Full Name</label><input value={qaForm.name || ""} onChange={e => qf("name", e.target.value)} placeholder="Child's name" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Date of Birth</label><input type="date" value={qaForm.dob || ""} onChange={e => qf("dob", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Parent Name</label><input value={qaForm.parent || ""} onChange={e => qf("parent", e.target.value)} placeholder="Parent / guardian" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Group</label>
              <select value={qaForm.group || "Sunflower"} onChange={e => qf("group", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {["Sunflower", "Butterfly", "Rainbow", "Star"].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <p className="text-xs text-indigo-600 bg-indigo-50 p-2 rounded-lg">Full profile can be completed in the Children section.</p>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Btn variant="secondary" onClick={() => setQuickModal(null)}>Cancel</Btn><Btn onClick={submitQuickAction}>Add Child</Btn></div>
      </Modal>

      <Modal open={quickModal === "new-admission"} onClose={() => setQuickModal(null)} title="Quick: New Admission">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Child Name</label><input value={qaForm.name || ""} onChange={e => qf("name", e.target.value)} placeholder="Child's full name" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">DOB</label><input type="date" value={qaForm.dob || ""} onChange={e => qf("dob", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Parent Name</label><input value={qaForm.parent || ""} onChange={e => qf("parent", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Parent Phone</label><input value={qaForm.phone || ""} onChange={e => qf("phone", e.target.value)} placeholder="+1 555-0000" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">Full application details available in Admissions section.</p>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Btn variant="secondary" onClick={() => setQuickModal(null)}>Cancel</Btn><Btn onClick={submitQuickAction}>Submit Admission</Btn></div>
      </Modal>

      <Modal open={quickModal === "add-staff"} onClose={() => setQuickModal(null)} title="Quick: Add Staff Member">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Full Name</label><input value={qaForm.name || ""} onChange={e => qf("name", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Role</label>
              <select value={qaForm.role || "Teacher"} onChange={e => qf("role", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {["Lead Teacher", "Assistant Teacher", "Nanny", "Driver", "Nurse"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Email</label><input type="email" value={qaForm.email || ""} onChange={e => qf("email", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Phone</label><input value={qaForm.phone || ""} onChange={e => qf("phone", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Btn variant="secondary" onClick={() => setQuickModal(null)}>Cancel</Btn><Btn onClick={submitQuickAction}>Add Staff</Btn></div>
      </Modal>

      <Modal open={quickModal === "upload-activity"} onClose={() => setQuickModal(null)} title="Quick: Upload Activity">
        <div className="space-y-3">
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Activity Title</label><input value={qaForm.title || ""} onChange={e => qf("title", e.target.value)} placeholder="e.g. Finger Painting" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Group</label>
              <select value={qaForm.group || "All"} onChange={e => qf("group", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {["All", "Sunflower", "Butterfly", "Rainbow", "Star"].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Type</label>
              <select value={qaForm.type || "Educational"} onChange={e => qf("type", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {["Educational", "Physical", "Arts", "Social", "Meal"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Notes</label><textarea rows={3} value={qaForm.notes || ""} onChange={e => qf("notes", e.target.value)} placeholder="Brief description…" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-300 transition-colors">
            <Upload size={20} className="mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-500">Click to upload photos/videos</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Btn variant="secondary" onClick={() => setQuickModal(null)}>Cancel</Btn><Btn onClick={submitQuickAction}>Upload Activity</Btn></div>
      </Modal>

      <Modal open={quickModal === "send-notification"} onClose={() => setQuickModal(null)} title="Send Notification">
        <div className="space-y-3">
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Recipients</label>
            <select value={qaForm.recipients || "All Parents"} onChange={e => qf("recipients", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {["All Parents", "All Staff", "Everyone", "Specific Group — Sunflower", "Specific Group — Butterfly"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Notification Type</label>
            <select value={qaForm.notifType || "Announcement"} onChange={e => qf("notifType", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {["Announcement", "Emergency", "Reminder", "Activity Update", "Payment Reminder"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Message</label><textarea rows={4} value={qaForm.message || ""} onChange={e => qf("message", e.target.value)} placeholder="Type your notification message…" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="send-sms" className="rounded" />
            <label htmlFor="send-sms" className="text-sm text-gray-600">Also send via SMS</label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Btn variant="secondary" onClick={() => setQuickModal(null)}>Cancel</Btn><Btn onClick={submitQuickAction}><Bell size={15} /> Send Notification</Btn></div>
      </Modal>

      <Modal open={quickModal === "add-event"} onClose={() => setQuickModal(null)} title="Add Upcoming Event">
        <div className="space-y-3">
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Event Title</label><input value={newEventForm.title} onChange={e => setNewEventForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Parent-Teacher Meeting" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Date</label><input type="date" value={newEventForm.date} onChange={e => setNewEventForm(p => ({ ...p, date: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Time</label><input value={newEventForm.time} onChange={e => setNewEventForm(p => ({ ...p, time: e.target.value }))} placeholder="10:00 AM" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Type</label>
            <select value={newEventForm.type} onChange={e => setNewEventForm(p => ({ ...p, type: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {["meeting", "health", "payment", "event", "staff", "admin"].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5"><Btn variant="secondary" onClick={() => setQuickModal(null)}>Cancel</Btn><Btn onClick={addEvent}>Add Event</Btn></div>
      </Modal>
    </div>
  );
}

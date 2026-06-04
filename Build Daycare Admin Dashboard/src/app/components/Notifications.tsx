import { useState } from "react";
import {
  Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle, Info, XCircle,
  Car, Pill, CreditCard, MessageCircle, Megaphone, Clock, X, Eye, Filter
} from "lucide-react";
import { Card, PageHeader, Btn, Modal, Badge } from "./ui";
import { mockNotifications as initial } from "./mockData";
import type { Notification } from "./types";

type NotifCategory = "All" | "Pickup" | "Medicine" | "Payment" | "Emergency" | "Parent Message" | "Staff Announcement";

interface NotifExt extends Notification {
  category: NotifCategory;
  details?: string;
  source?: string;
  actionRequired?: boolean;
}

const BASE_NOTIFS: NotifExt[] = [
  ...initial.map((n, i) => ({
    ...n,
    category: (["Pickup", "Medicine", "Payment", "Emergency", "Parent Message", "Staff Announcement"] as NotifCategory[])[i % 6],
    details: `${n.description} Additional detail about this notification including context and recommended action.`,
    source: ["Transport System", "Health Module", "Billing System", "Emergency Alert", "Parent Portal", "Staff Portal"][i % 6],
    actionRequired: i % 3 === 0,
  })),
  {
    id: "n-extra-1", title: "Child Pickup Confirmed", description: "Emma Johnson picked up by parent at 3:45 PM",
    type: "success", time: "5 min ago", read: false,
    category: "Pickup", details: "Emma Johnson (Group Butterfly) was picked up by mother Sarah Johnson (verified ID). Pickup confirmed at main entrance at 15:45.", source: "Transport System", actionRequired: false,
  },
  {
    id: "n-extra-2", title: "Medicine Due: Lucas Moore", description: "Amoxicillin 5ml due at 2:00 PM",
    type: "warning", time: "15 min ago", read: false,
    category: "Medicine", details: "Lucas Moore requires Amoxicillin 5ml at 14:00. Prescribed by Dr. Smith. Parent consent form on file. Please mark as administered after giving.", source: "Health Module", actionRequired: true,
  },
  {
    id: "n-extra-3", title: "Payment Overdue: Johnson Family", description: "Invoice INV-2025003 overdue by 5 days",
    type: "error", time: "1 hr ago", read: false,
    category: "Payment", details: "Invoice INV-2025003 for $850 (Monthly - Infant) is 5 days overdue. Three reminders sent. Consider contacting parent directly or applying late fee of $25.", source: "Billing System", actionRequired: true,
  },
  {
    id: "n-extra-4", title: "EMERGENCY: Child Injury Reported", description: "Minor fall reported in Playground - Liam Wilson",
    type: "error", time: "30 min ago", read: false,
    category: "Emergency", details: "Liam Wilson (Group Sunflower) had a minor fall in the playground area at 14:20. First aid applied by Nurse Jenny. Parents notified. Child is alert and stable. Incident report filed.", source: "Emergency Alert", actionRequired: true,
  },
  {
    id: "n-extra-5", title: "Parent Message: Olivia Davis", description: "Parent asking about field trip permission",
    type: "info", time: "2 hrs ago", read: true,
    category: "Parent Message", details: "Parent Michael Davis sent a message: 'Has the permission slip for the upcoming museum field trip been sent? I haven\'t received it yet. Please resend to michael.davis@email.com'. Requires response.", source: "Parent Portal", actionRequired: true,
  },
  {
    id: "n-extra-6", title: "Staff Meeting Tomorrow", description: "Monthly staff meeting scheduled for 7:30 AM",
    type: "info", time: "3 hrs ago", read: true,
    category: "Staff Announcement", details: "Reminder: Monthly all-staff meeting is scheduled for tomorrow (Friday) at 7:30 AM in Conference Room A. Agenda: Safety protocol review, curriculum updates, Q3 performance review. Attendance is mandatory.", source: "Staff Portal", actionRequired: false,
  },
  {
    id: "n-extra-7", title: "Bus Delayed", description: "Morning route delayed by 20 minutes due to traffic",
    type: "warning", time: "45 min ago", read: false,
    category: "Pickup", details: "Morning bus route (VH-101) is delayed by approximately 20 minutes due to traffic congestion on Highway 55. Estimated arrival: 8:50 AM. Affected children: Emma, Noah, Olivia, Liam. Parents have been notified via SMS.", source: "Transport System", actionRequired: false,
  },
];

const TYPE_ICON: Record<string, JSX.Element> = {
  warning: <AlertTriangle size={16} className="text-orange-500" />,
  success: <CheckCircle size={16} className="text-green-500" />,
  info: <Info size={16} className="text-blue-500" />,
  error: <XCircle size={16} className="text-red-500" />,
};

const CAT_ICON: Record<NotifCategory, JSX.Element> = {
  All: <Bell size={14} />,
  Pickup: <Car size={14} />,
  Medicine: <Pill size={14} />,
  Payment: <CreditCard size={14} />,
  Emergency: <AlertTriangle size={14} />,
  "Parent Message": <MessageCircle size={14} />,
  "Staff Announcement": <Megaphone size={14} />,
};

const TYPE_BG: Record<string, string> = {
  warning: "bg-orange-50 border-orange-100",
  success: "bg-green-50 border-green-100",
  info: "bg-blue-50 border-blue-100",
  error: "bg-red-50 border-red-100",
};

const CAT_COLORS: Record<NotifCategory, string> = {
  All: "bg-gray-100 text-gray-700",
  Pickup: "bg-blue-100 text-blue-700",
  Medicine: "bg-purple-100 text-purple-700",
  Payment: "bg-green-100 text-green-700",
  Emergency: "bg-red-100 text-red-700",
  "Parent Message": "bg-yellow-100 text-yellow-700",
  "Staff Announcement": "bg-indigo-100 text-indigo-700",
};

const CATEGORIES: NotifCategory[] = ["All", "Pickup", "Medicine", "Payment", "Emergency", "Parent Message", "Staff Announcement"];

export function Notifications() {
  const [notifs, setNotifs] = useState<NotifExt[]>(BASE_NOTIFS);
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [catFilter, setCatFilter] = useState<NotifCategory>("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "warning" | "success" | "info" | "error">("all");
  const [selected, setSelected] = useState<NotifExt | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const unreadCount = notifs.filter(n => !n.read).length;
  const actionCount = notifs.filter(n => !n.read && n.actionRequired).length;

  const displayed = notifs.filter(n => {
    if (readFilter === "unread" && n.read) return false;
    if (readFilter === "read" && !n.read) return false;
    if (catFilter !== "All" && n.category !== catFilter) return false;
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    return true;
  });

  const history = notifs.filter(n => n.read);

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  function remove(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function clearAll() {
    if (confirm("Clear all notifications?")) {
      setNotifs([]);
      setSelected(null);
    }
  }

  function viewDetails(n: NotifExt) {
    setSelected(n);
    if (!n.read) markRead(n.id);
  }

  return (
    <div>
      <PageHeader
        title="Notification Center"
        subtitle={`${unreadCount} unread · ${actionCount} require action`}
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm" onClick={() => setShowFilterPanel(p => !p)}>
              <Filter size={14} /> Filter
            </Btn>
            <Btn variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark All Read
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => setShowHistory(true)}>
              <Clock size={14} /> History
            </Btn>
            <Btn variant="danger" size="sm" onClick={clearAll}>
              <Trash2 size={14} /> Clear All
            </Btn>
          </div>
        }
      />

      {/* Summary KPI strip */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {(["Pickup", "Medicine", "Payment", "Emergency", "Parent Message", "Staff Announcement"] as NotifCategory[]).map(cat => {
          const cnt = notifs.filter(n => n.category === cat && !n.read).length;
          return (
            <button key={cat} onClick={() => setCatFilter(cat === catFilter ? "All" : cat)}
              className={`p-3 rounded-xl border text-left transition-all ${catFilter === cat ? "border-indigo-400 bg-indigo-50" : "bg-white border-gray-100 hover:bg-gray-50"}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`p-1 rounded-md ${CAT_COLORS[cat]}`}>{CAT_ICON[cat]}</span>
              </div>
              <p className="text-xs text-gray-500 leading-tight">{cat}</p>
              {cnt > 0 && <p className="text-sm text-indigo-600 mt-0.5" style={{ fontWeight: 700 }}>{cnt} new</p>}
            </button>
          );
        })}
      </div>

      {/* Filter panel */}
      {showFilterPanel && (
        <Card className="p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <p className="text-xs text-gray-500 mb-2">Read Status</p>
              <div className="flex gap-1">
                {(["all", "unread", "read"] as const).map(f => (
                  <button key={f} onClick={() => setReadFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${readFilter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {f === "all" ? "All" : f === "unread" ? `Unread (${unreadCount})` : `Read (${notifs.filter(n => n.read).length})`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Type</p>
              <div className="flex gap-1">
                {(["all", "error", "warning", "info", "success"] as const).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Category</p>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCatFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${catFilter === cat ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active category tab bar */}
      <div className="flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto">
        {CATEGORIES.map(cat => {
          const cnt = notifs.filter(n => n.category === cat && !n.read).length;
          return (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3 py-2 text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                catFilter === cat ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
              }`}>
              {CAT_ICON[cat]}
              {cat}
              {cnt > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cnt}</span>}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {displayed.map(n => (
          <div key={n.id}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
              n.read ? "bg-white border-gray-100 hover:bg-gray-50" : `${TYPE_BG[n.type]} border hover:opacity-90`
            }`}
            onClick={() => viewDetails(n)}
          >
            <div className="mt-0.5 shrink-0">{TYPE_ICON[n.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[n.category]}`}>{n.category}</span>
                  {n.actionRequired && !n.read && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Action Required</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
              {n.source && <p className="text-xs text-gray-400 mt-1">Source: {n.source}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
              <button onClick={() => viewDetails(n)} title="View Details"
                className="p-1.5 rounded hover:bg-white/80 text-gray-400 hover:text-indigo-600">
                <Eye size={14} />
              </button>
              {!n.read && (
                <button onClick={() => markRead(n.id)} title="Mark as read"
                  className="p-1.5 rounded hover:bg-white/80 text-gray-500">
                  <CheckCheck size={14} />
                </button>
              )}
              <button onClick={() => remove(n.id)}
                className="p-1.5 rounded hover:bg-white/80 text-gray-400 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
            {!n.read && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1.5" />}
          </div>
        ))}
        {displayed.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell size={32} className="mx-auto mb-2 opacity-40" />
            <p>No notifications match the current filter</p>
            <button onClick={() => { setCatFilter("All"); setReadFilter("all"); setTypeFilter("all"); }}
              className="mt-2 text-indigo-600 text-sm hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selected && (
        <Modal title="Notification Details" onClose={() => setSelected(null)} size="md">
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${TYPE_BG[selected.type]}`}>
              <div className="flex items-center gap-2 mb-2">
                {TYPE_ICON[selected.type]}
                <span className="text-sm" style={{ fontWeight: 600 }}>{selected.title}</span>
                {selected.actionRequired && <Badge color="red">Action Required</Badge>}
              </div>
              <p className="text-sm text-gray-600">{selected.details || selected.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Category</p>
                <div className="flex items-center gap-1.5">
                  {CAT_ICON[selected.category]}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[selected.category]}`}>{selected.category}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Time</p>
                <p className="text-sm text-gray-700">{selected.time}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Source</p>
                <p className="text-sm text-gray-700">{selected.source || "System"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${selected.read ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}`}>
                  {selected.read ? "Read" : "Unread"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {selected.actionRequired && (
                <Btn variant="primary" size="sm" onClick={() => {
                  alert(`Action taken for: ${selected.title}`);
                  setSelected(null);
                }}>
                  <CheckCircle size={14} /> Take Action
                </Btn>
              )}
              <Btn variant="danger" size="sm" onClick={() => { remove(selected.id); setSelected(null); }}>
                <Trash2 size={14} /> Dismiss
              </Btn>
              <Btn variant="secondary" size="sm" onClick={() => setSelected(null)}>
                <X size={14} /> Close
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* History Modal */}
      {showHistory && (
        <Modal title={`Notification History (${history.length} read)`} onClose={() => setShowHistory(false)} size="lg">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.length === 0 && (
              <p className="text-center text-gray-400 py-8">No read notifications in history</p>
            )}
            {history.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-0.5">{TYPE_ICON[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-gray-700">{n.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CAT_COLORS[n.category]}`}>{n.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{n.description}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{n.time}</p>
                </div>
                <button onClick={() => remove(n.id)} className="text-gray-300 hover:text-red-400 p-1">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          {history.length > 0 && (
            <div className="pt-3 border-t border-gray-100 mt-3">
              <Btn variant="danger" size="sm" onClick={() => {
                setNotifs(prev => prev.filter(n => !n.read));
                setShowHistory(false);
              }}>
                <Trash2 size={14} /> Clear History
              </Btn>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

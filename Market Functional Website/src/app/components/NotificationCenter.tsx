import { useState } from "react";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { Badge, Btn, PageHeader } from "./Modal";

type NotifType = "seller" | "product" | "order" | "refund" | "complaint" | "stock" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "high" | "medium" | "low";
}

const initNotifications: Notification[] = [
  { id: "N-001", type: "complaint", title: "Critical: Unsafe Product Report", message: "Product #P-449 (Baby Safety Gate) has been reported as unsafe by 3 customers. Immediate review required.", time: "2 min ago", read: false, priority: "high" },
  { id: "N-002", type: "seller", title: "New Seller Registration", message: "Tiny Tots Store has registered and submitted verification documents for approval.", time: "8 min ago", read: false, priority: "medium" },
  { id: "N-003", type: "stock", title: "Low Stock Alert: Soft Plush Bears", message: "Only 10 units remaining for 'Soft Plush Teddy Bear XL' by Tiny Tots Store.", time: "15 min ago", read: false, priority: "high" },
  { id: "N-004", type: "order", title: "High Value Order Alert", message: "Order #ORD-2891 placed for ৳2,700. Customer: Fatima Rahman. Seller: BabyWorld BD.", time: "32 min ago", read: true, priority: "low" },
  { id: "N-005", type: "refund", title: "Refund Request — ORD-2886", message: "Customer Jabbar Ali has requested a refund of ৳4,500 for Learning Tablet. Reason: Defective product.", time: "1 hr ago", read: false, priority: "high" },
  { id: "N-006", type: "product", title: "New Products Pending Review", message: "12 new products uploaded by BabyWorld BD are awaiting admin review and approval.", time: "2 hr ago", read: true, priority: "medium" },
  { id: "N-007", type: "stock", title: "Critical: Baby Diapers Nearly Out", message: "Only 5 units of 'Baby Diapers Pack 50' remaining. Auto-restock request sent to BabyWorld BD.", time: "3 hr ago", read: false, priority: "high" },
  { id: "N-008", type: "system", title: "Scheduled Maintenance", message: "System maintenance scheduled for Sunday 2:00 AM - 4:00 AM. All services will be temporarily unavailable.", time: "5 hr ago", read: true, priority: "low" },
  { id: "N-009", type: "seller", title: "Seller KidsCraft Verification Complete", message: "All verification documents for KidsCraft Ltd. have been verified. Account is now fully active.", time: "1 day ago", read: true, priority: "low" },
  { id: "N-010", type: "complaint", title: "Fraud Seller Complaint", message: "New Critical complaint CMP-005: Seller collected payment but never shipped. Investigation required.", time: "1 day ago", read: false, priority: "high" },
];

const typeColors: Record<NotifType, string> = {
  seller: "#0ea5e9", product: "#06b6d4", order: "#10b981", refund: "#f59e0b", complaint: "#ef4444", stock: "#f97316", system: "#8b5cf6"
};

const typeIcons: Record<NotifType, string> = {
  seller: "👤", product: "📦", order: "🛒", refund: "↩️", complaint: "⚠️", stock: "📊", system: "⚙️"
};

const filterOptions: { label: string; value: string }[] = [
  { label: "All", value: "all" }, { label: "Unread", value: "unread" },
  { label: "Seller", value: "seller" }, { label: "Product", value: "product" },
  { label: "Order", value: "order" }, { label: "Complaint", value: "complaint" },
  { label: "Stock", value: "stock" }, { label: "System", value: "system" },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(initNotifications);
  const [filter, setFilter] = useState("all");

  function markRead(id: string) {
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  }

  function markAllRead() {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  }

  function deleteNotification(id: string) {
    setNotifications(n => n.filter(x => x.id !== id));
  }

  function clearAll() {
    setNotifications([]);
  }

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader
        title="Notification Center"
        subtitle={`${unreadCount} unread notifications`}
        actions={
          <div className="flex gap-2">
            <Btn size="sm" variant="secondary" onClick={markAllRead}><CheckCheck size={13} /> Mark All Read</Btn>
            <Btn size="sm" variant="ghost" onClick={clearAll}><Trash2 size={13} /> Clear All</Btn>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={13} style={{ color: "var(--muted-foreground)" }} />
        {filterOptions.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} className="px-2.5 py-1.5 rounded text-xs transition-colors"
            style={{ background: filter === f.value ? "var(--primary)" : "var(--muted)", color: filter === f.value ? "#fff" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Bell size={32} style={{ color: "var(--muted-foreground)" }} />
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>No notifications found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className="flex items-start gap-3 rounded p-3 cursor-pointer transition-colors group"
              style={{
                background: notif.read ? "var(--card)" : `${typeColors[notif.type]}12`,
                border: `1px solid ${notif.read ? "var(--border)" : `${typeColors[notif.type]}40`}`,
              }}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-lg" style={{ background: `${typeColors[notif.type]}20` }}>
                {typeIcons[notif.type]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13, fontWeight: notif.read ? 500 : 700, color: "var(--foreground)" }}>{notif.title}</span>
                    {!notif.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColors[notif.type] }} />}
                    {notif.priority === "high" && <Badge label="HIGH" color="red" />}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span style={{ fontSize: 11, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{notif.time}</span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                      style={{ color: "#ef4444" }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

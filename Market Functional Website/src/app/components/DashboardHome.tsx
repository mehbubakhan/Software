import { useState } from "react";
import { Users, Package, ShoppingCart, Truck, AlertTriangle, DollarSign, TrendingUp, Archive, CheckCircle, Clock, Plus, Eye, Bell, Search } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { StatCard, Badge, Btn, PageHeader, Modal, Input } from "./Modal";

const salesData = [
  { month: "Jan", revenue: 42000, orders: 380, refunds: 12 },
  { month: "Feb", revenue: 58000, orders: 520, refunds: 18 },
  { month: "Mar", revenue: 51000, orders: 460, refunds: 14 },
  { month: "Apr", revenue: 67000, orders: 610, refunds: 22 },
  { month: "May", revenue: 75000, orders: 690, refunds: 19 },
  { month: "Jun", revenue: 82000, orders: 740, refunds: 25 },
];

const stockItems = [
  { name: "Toy Cars Set", added: 500, sold: 350, remaining: 150 },
  { name: "Baby Bottles", added: 800, sold: 640, remaining: 160 },
  { name: "Kids Backpacks", added: 300, sold: 210, remaining: 90 },
  { name: "Learning Blocks", added: 600, sold: 480, remaining: 120 },
  { name: "Soft Plush Bears", added: 400, sold: 390, remaining: 10 },
];

const activities = [
  { id: 1, type: "seller", text: "New seller registered: Tiny Tots Store", time: "2 min ago", color: "blue" },
  { id: 2, type: "product", text: "12 new products uploaded by BabyWorld BD", time: "8 min ago", color: "cyan" },
  { id: 3, type: "order", text: "Order #ORD-2891 placed — ৳4,200", time: "15 min ago", color: "green" },
  { id: 4, type: "refund", text: "Refund request for Order #ORD-2744", time: "32 min ago", color: "yellow" },
  { id: 5, type: "complaint", text: "URGENT: Unsafe product report — Product #P-449", time: "1 hr ago", color: "red" },
  { id: 6, type: "seller", text: "KidsCraft Ltd. verification documents submitted", time: "2 hr ago", color: "blue" },
];

export function DashboardHome({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [notifyModal, setNotifyModal] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");
  const [notifySent, setNotifySent] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState(["Toys", "Baby Care", "Clothing", "Books", "Safety Gear"]);

  function sendNotification() {
    if (notifyMsg.trim()) {
      setNotifySent(true);
      setTimeout(() => { setNotifySent(false); setNotifyModal(false); setNotifyMsg(""); }, 1500);
    }
  }

  function addCategory() {
    if (newCategory.trim()) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader
        title="Marketplace Dashboard"
        subtitle="KidsMarket Bangladesh — Full control center"
        actions={
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <Search size={13} style={{ color: "var(--muted-foreground)" }} />
              <input placeholder="Search..." className="outline-none bg-transparent" style={{ fontSize: 12, color: "var(--foreground)", width: 140 }} />
            </div>
            <Btn size="sm" onClick={() => setNotifyModal(true)}><Bell size={13} /> Send Notification</Btn>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        <StatCard label="Total Sellers" value="247" sub="+5 pending" color="#0ea5e9" icon={<Users size={15} />} />
        <StatCard label="Pending Approvals" value="5" sub="Requires review" color="#f59e0b" icon={<Clock size={15} />} />
        <StatCard label="Total Products" value="3,841" sub="Across all sellers" color="#06b6d4" icon={<Package size={15} />} />
        <StatCard label="In Stock" value="3,204" sub="83% available" color="#10b981" icon={<CheckCircle size={15} />} />
        <StatCard label="Out of Stock" value="637" sub="16.5% depleted" color="#ef4444" icon={<Archive size={15} />} />
        <StatCard label="Total Orders" value="8,920" sub="All time" color="#8b5cf6" icon={<ShoppingCart size={15} />} />
        <StatCard label="Pending Delivery" value="184" sub="In transit" color="#f97316" icon={<Truck size={15} />} />
        <StatCard label="Revenue Today" value="৳82,400" sub="+12% vs yesterday" color="#10b981" icon={<DollarSign size={15} />} />
        <StatCard label="Complaints" value="23" sub="3 urgent" color="#ef4444" icon={<AlertTriangle size={15} />} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Revenue & Orders — Last 6 Months</h3>
            <TrendingUp size={14} style={{ color: "var(--primary)" }} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#141d35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="url(#revGrad)" strokeWidth={2} name="Revenue (৳)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Product Stock Overview</h3>
          <div className="flex flex-col gap-2">
            {stockItems.map((item) => {
              const pct = Math.round((item.remaining / item.added) * 100);
              const low = pct < 20;
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-0.5">
                    <span style={{ fontSize: 11, color: "var(--foreground)" }}>{item.name}</span>
                    <span style={{ fontSize: 11, color: low ? "#ef4444" : "var(--muted-foreground)", fontFamily: "monospace" }}>
                      {item.remaining}/{item.added}
                    </span>
                  </div>
                  <div className="rounded-full h-1.5 w-full" style={{ background: "var(--muted)" }}>
                    <div
                      className="rounded-full h-1.5"
                      style={{ width: `${pct}%`, background: low ? "#ef4444" : "#0ea5e9" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Quick Actions */}
        <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Approve Seller", color: "#10b981", page: "sellers" },
              { label: "Add Category", color: "#0ea5e9", action: () => setCategoryModal(true) },
              { label: "Verify Product", color: "#06b6d4", page: "products" },
              { label: "View Orders", color: "#8b5cf6", page: "orders" },
              { label: "Send Notification", color: "#f59e0b", action: () => setNotifyModal(true) },
              { label: "View Complaints", color: "#ef4444", page: "complaints" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => a.action ? a.action() : a.page && onNavigate(a.page)}
                className="rounded p-2.5 flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                style={{ background: `${a.color}20`, border: `1px solid ${a.color}40` }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: a.color }}>
                  <Plus size={12} color="#fff" />
                </div>
                <span style={{ fontSize: 10, color: a.color, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Recent Activities</h3>
          <div className="flex flex-col gap-2.5">
            {activities.map((a) => {
              const dotColors: Record<string, string> = { blue: "#0ea5e9", cyan: "#06b6d4", green: "#10b981", yellow: "#f59e0b", red: "#ef4444" };
              return (
                <div key={a.id} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColors[a.color] }} />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 12, color: "var(--foreground)" }}>{a.text}</p>
                    <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications Widget */}
      <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>System Notifications</h3>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {[
            { icon: "⚠️", text: "5 sellers pending verification", type: "warning" },
            { icon: "📦", text: "Soft Plush Bears — only 10 units left", type: "danger" },
            { icon: "🚚", text: "18 deliveries due today", type: "info" },
            { icon: "📢", text: "System maintenance scheduled Sun 2am", type: "info" },
          ].map((n, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 14 }}>{n.icon}</span>
              <span style={{ fontSize: 12, color: "var(--foreground)" }}>{n.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Send Notification Modal */}
      <Modal open={notifyModal} onClose={() => setNotifyModal(false)} title="Send Notification">
        <div className="flex flex-col gap-3">
          <Input label="Notification Title" placeholder="e.g. System Maintenance Alert" />
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Message</label>
            <textarea
              rows={4} value={notifyMsg} onChange={(e) => setNotifyMsg(e.target.value)}
              placeholder="Enter notification message..."
              className="px-3 py-2 rounded outline-none resize-none"
              style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13 }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Send To</label>
            <div className="flex gap-2 flex-wrap">
              {["All Users", "Sellers Only", "Customers Only", "Admins"].map(t => (
                <button key={t} className="px-3 py-1 rounded border transition-colors" style={{ fontSize: 12, background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {notifySent ? (
            <div className="px-3 py-2 rounded text-center" style={{ background: "#10b98120", color: "#10b981", fontSize: 13 }}>
              ✓ Notification sent successfully!
            </div>
          ) : (
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setNotifyModal(false)}>Cancel</Btn>
              <Btn onClick={sendNotification}><Bell size={13} /> Send Notification</Btn>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal open={categoryModal} onClose={() => setCategoryModal(false)} title="Manage Categories">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name..."
              className="flex-1 px-3 py-2 rounded outline-none"
              style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13 }}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <Btn onClick={addCategory}><Plus size={13} /> Add</Btn>
          </div>
          <div className="flex flex-col gap-1">
            {categories.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--foreground)" }}>{c}</span>
                <button
                  onClick={() => setCategories(prev => prev.filter((_, j) => j !== i))}
                  style={{ fontSize: 11, color: "#ef4444" }}
                >Remove</button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

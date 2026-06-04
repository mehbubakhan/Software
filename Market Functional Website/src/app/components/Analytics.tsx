import { useState } from "react";
import { Download, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { Btn, PageHeader, StatCard } from "./Modal";

const monthlySales = [
  { month: "Jan", orders: 380, revenue: 42000, refunds: 12 },
  { month: "Feb", orders: 520, revenue: 58000, refunds: 18 },
  { month: "Mar", orders: 460, revenue: 51000, refunds: 14 },
  { month: "Apr", orders: 610, revenue: 67000, refunds: 22 },
  { month: "May", orders: 690, revenue: 75000, refunds: 19 },
  { month: "Jun", orders: 740, revenue: 82000, refunds: 25 },
];

const topSellers = [
  { name: "KidGear Emporium", revenue: 521000, orders: 1890 },
  { name: "BabyWorld BD", revenue: 284000, orders: 1204 },
  { name: "KidsCraft Ltd.", revenue: 112500, orders: 643 },
  { name: "Tiny Tots Store", revenue: 67200, orders: 398 },
  { name: "SafeBaby Shop", revenue: 44800, orders: 210 },
];

const topProducts = [
  { name: "Galaxy Backpack", sold: 210 },
  { name: "Baby Bottle Set", sold: 156 },
  { name: "Toy Car Collection", sold: 350 },
  { name: "Plush Teddy Bear", sold: 390 },
  { name: "Learning Blocks", sold: 156 },
];

const categoryData = [
  { name: "Toys", value: 35, color: "#0ea5e9" },
  { name: "Baby Care", value: 28, color: "#06b6d4" },
  { name: "Clothing", value: 20, color: "#8b5cf6" },
  { name: "Educational", value: 12, color: "#10b981" },
  { name: "Safety", value: 5, color: "#f59e0b" },
];

const deliverySuccessData = [
  { month: "Jan", success: 94, failed: 6 },
  { month: "Feb", success: 96, failed: 4 },
  { month: "Mar", success: 93, failed: 7 },
  { month: "Apr", success: 97, failed: 3 },
  { month: "May", success: 98, failed: 2 },
  { month: "Jun", success: 95, failed: 5 },
];

const tooltipStyle = { background: "#141d35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12 };

export function Analytics() {
  const [period, setPeriod] = useState("6M");
  const [exporting, setExporting] = useState(false);

  function exportData(type: "PDF" | "Excel") {
    setExporting(true);
    setTimeout(() => setExporting(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Marketplace performance insights"
        actions={
          <div className="flex items-center gap-2">
            {["3M", "6M", "1Y"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className="px-2.5 py-1 rounded text-xs"
                style={{ background: period === p ? "var(--primary)" : "var(--muted)", color: period === p ? "#fff" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                {p}
              </button>
            ))}
            <Btn size="sm" variant="secondary" onClick={() => exportData("PDF")}><Download size={13} /> {exporting ? "Exporting..." : "Export PDF"}</Btn>
            <Btn size="sm" variant="ghost" onClick={() => exportData("Excel")}><Download size={13} /> Excel</Btn>
          </div>
        }
      />

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <StatCard label="Total Revenue" value="৳8,24,000" sub="+18% vs last period" color="#10b981" icon={<TrendingUp size={14} />} />
        <StatCard label="Total Orders" value="3,400" sub="+24% growth" color="#0ea5e9" />
        <StatCard label="Products Sold" value="12,840" sub="Across all categories" color="#06b6d4" />
        <StatCard label="Refund Rate" value="3.2%" sub="-0.4% improved" color="#f59e0b" />
        <StatCard label="Delivery Success" value="96.4%" sub="+1.2% vs last month" color="#10b981" />
      </div>

      {/* Revenue + Orders Chart */}
      <div className="rounded p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Monthly Revenue & Orders</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlySales}>
            <defs>
              <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#rev2)" strokeWidth={2} name="Revenue (৳)" />
            <Area type="monotone" dataKey="orders" stroke="#0ea5e9" fill="transparent" strokeWidth={2} strokeDasharray="4 2" name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Top Sellers Bar Chart */}
        <div className="rounded p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Top Sellers by Revenue</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topSellers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `৳${(v as number).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 3, 3, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="rounded p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Sales by Category</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span style={{ fontSize: 11, color: "var(--foreground)" }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: c.color, fontFamily: "monospace", marginLeft: "auto" }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Top Products */}
        <div className="rounded p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Top Products by Units Sold</h3>
          <div className="flex flex-col gap-2">
            {topProducts.sort((a, b) => b.sold - a.sold).map((p, i) => (
              <div key={p.name} className="flex items-center gap-2">
                <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "monospace", width: 14, textAlign: "right" }}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span style={{ fontSize: 12, color: "var(--foreground)" }}>{p.name}</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#0ea5e9" }}>{p.sold}</span>
                  </div>
                  <div className="h-1.5 rounded-full w-full" style={{ background: "var(--muted)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(p.sold / 400) * 100}%`, background: "#0ea5e9" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Success Rate */}
        <div className="rounded p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Delivery Success Rate (%)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={deliverySuccessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[88, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} name="Success %" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} name="Failed %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seller Performance Table */}
      <div className="rounded p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Seller Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 12, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Seller", "Total Orders", "Revenue", "Avg Rating", "Complaint Ratio", "Delivery Success", "Performance"].map(h => (
                  <th key={h} className="text-left py-2 px-3" style={{ color: "var(--muted-foreground)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "KidGear Emporium", orders: 1890, revenue: "৳5,21,000", rating: 4.7, complaintRatio: "0.8%", delivery: "98%", perf: 95 },
                { name: "BabyWorld BD", orders: 1204, revenue: "৳2,84,000", rating: 4.5, complaintRatio: "1.2%", delivery: "96%", perf: 88 },
                { name: "KidsCraft Ltd.", orders: 643, revenue: "৳1,12,500", rating: 4.8, complaintRatio: "0.3%", delivery: "99%", perf: 97 },
                { name: "Tiny Tots Store", orders: 398, revenue: "৳67,200", rating: 3.9, complaintRatio: "3.1%", delivery: "91%", perf: 72 },
              ].map(s => (
                <tr key={s.name} className="hover:bg-white/5 transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2.5 px-3" style={{ fontWeight: 600, color: "var(--foreground)" }}>{s.name}</td>
                  <td className="py-2.5 px-3" style={{ fontFamily: "monospace" }}>{s.orders}</td>
                  <td className="py-2.5 px-3" style={{ fontFamily: "monospace", color: "#10b981" }}>{s.revenue}</td>
                  <td className="py-2.5 px-3" style={{ color: "#f59e0b", fontFamily: "monospace" }}>★ {s.rating}</td>
                  <td className="py-2.5 px-3" style={{ fontFamily: "monospace", color: parseFloat(s.complaintRatio) > 2 ? "#ef4444" : "#94a3b8" }}>{s.complaintRatio}</td>
                  <td className="py-2.5 px-3" style={{ fontFamily: "monospace" }}>{s.delivery}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${s.perf}%`, background: s.perf > 90 ? "#10b981" : s.perf > 75 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted-foreground)" }}>{s.perf}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

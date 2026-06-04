import { useState } from "react";
import { Camera, Save, CheckCircle } from "lucide-react";
import { Btn, Input, PageHeader } from "./Modal";

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  time: string;
  type: "approve" | "reject" | "suspend" | "update" | "delete" | "login";
}

const activityLogs: ActivityLog[] = [
  { id: "L-001", action: "Approved Seller", details: "KidsCraft Ltd. — Seller ID: S-003", time: "Today 10:35 AM", type: "approve" },
  { id: "L-002", action: "Approved Product", details: "Wooden Learning Blocks Set — P-001", time: "Today 10:20 AM", type: "approve" },
  { id: "L-003", action: "Suspended Seller", details: "SafeBaby Shop — S-004 (Unsafe product)", time: "Today 09:45 AM", type: "suspend" },
  { id: "L-004", action: "Processed Withdrawal", details: "KidsCraft Ltd. — ৳12,200 via Nagad", time: "Yesterday 4:12 PM", type: "update" },
  { id: "L-005", action: "Rejected Product", details: "Unknown Brand Toy Set — Fake product", time: "Yesterday 2:30 PM", type: "reject" },
  { id: "L-006", action: "Login", details: "Chrome · 103.47.18.xxx", time: "Yesterday 9:00 AM", type: "login" },
  { id: "L-007", action: "Deleted Review", details: "Spam review on Learning Blocks by bot_user_999", time: "2 days ago", type: "delete" },
  { id: "L-008", action: "Updated Commission", details: "Commission rate changed: 8% → 10%", time: "2 days ago", type: "update" },
];

const logColors: Record<string, string> = {
  approve: "#10b981", reject: "#ef4444", suspend: "#f59e0b", update: "#0ea5e9", delete: "#ef4444", login: "#94a3b8"
};

const logIcons: Record<string, string> = {
  approve: "✓", reject: "✗", suspend: "⏸", update: "↻", delete: "🗑", login: "🔑"
};

export function ProfilePage() {
  const [name, setName] = useState("Super Admin");
  const [email, setEmail] = useState("admin@kidsmarket.bd");
  const [phone, setPhone] = useState("+880-1711-000000");
  const [role] = useState("Super Administrator");
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Profile" subtitle="Manage your admin account" />

      <div className="grid gap-4" style={{ gridTemplateColumns: "320px 1fr" }}>
        {/* Profile Card */}
        <div className="flex flex-col gap-4">
          <div className="rounded p-4 flex flex-col gap-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--primary)" }}>
                  <span style={{ fontSize: 24, color: "#fff", fontWeight: 700 }}>SA</span>
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                  style={{ background: "#0f1629", border: "2px solid var(--border)" }}>
                  <Camera size={12} style={{ color: "var(--primary)" }} />
                </button>
              </div>
              <div className="text-center">
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>{name}</p>
                <p style={{ fontSize: 12, color: "var(--primary)" }}>{role}</p>
                <div className="flex items-center gap-1 justify-center mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                  <span style={{ fontSize: 11, color: "#10b981" }}>Active</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              {[
                { label: "Approved", value: "1,240" },
                { label: "Rejected", value: "89" },
                { label: "Sessions", value: "2" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", fontFamily: "monospace" }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded p-4 flex flex-col gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Account Information</h3>
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Role</label>
              <div className="px-3 py-2 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--primary)", fontSize: 13, fontWeight: 500 }}>
                {role}
              </div>
            </div>
            {saved ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "#10b98120", color: "#10b981", fontSize: 13 }}>
                <CheckCircle size={14} /> Profile saved!
              </div>
            ) : (
              <Btn onClick={saveProfile}><Save size={13} /> Save Profile</Btn>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="rounded p-4 flex flex-col gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Activity Log</h3>
            <div className="px-2 py-0.5 rounded" style={{ background: "var(--muted)", fontSize: 11, color: "var(--muted-foreground)" }}>
              Last 7 days
            </div>
          </div>
          <div className="flex flex-col">
            {activityLogs.map((log, i) => (
              <div key={log.id} className="flex items-start gap-3 py-3" style={{ borderBottom: i < activityLogs.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm" style={{ background: `${logColors[log.type]}20` }}>
                  {logIcons[log.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 13, fontWeight: 600, color: logColors[log.type] }}>{log.action}</span>
                    <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{log.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

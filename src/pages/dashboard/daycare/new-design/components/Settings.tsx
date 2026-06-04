import { useState, useRef } from "react";
import {
  Save, Building2, DollarSign, Clock, Bell, Shield, Users,
  Camera, Eye, EyeOff, Key, Smartphone, Monitor, LogOut,
  Mail, MessageSquare, Globe, CheckCircle, Upload, Trash2
} from "lucide-react";
import { Card, Input, Btn, PageHeader, Modal, Badge } from "./ui";

const TABS = [
  { id: "general", label: "General", icon: <Building2 size={16} /> },
  { id: "fees", label: "Fees & Billing", icon: <DollarSign size={16} /> },
  { id: "schedule", label: "Schedule", icon: <Clock size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "security", label: "Security", icon: <Shield size={16} /> },
  { id: "groups", label: "Groups & Rooms", icon: <Users size={16} /> },
];

interface LoginSession {
  id: string;
  device: string;
  location: string;
  time: string;
  current: boolean;
}

const MOCK_SESSIONS: LoginSession[] = [
  { id: "s1", device: "Chrome · Windows 11", location: "Springfield, IL", time: "Now", current: true },
  { id: "s2", device: "Safari · iPhone 14", location: "Springfield, IL", time: "2 hrs ago", current: false },
  { id: "s3", device: "Firefox · macOS", location: "Chicago, IL", time: "Yesterday, 9:30 AM", current: false },
];

const LOGIN_HISTORY = [
  { device: "Chrome · Windows 11", ip: "192.168.1.10", time: "Today, 08:22 AM", success: true },
  { device: "Safari · iPhone 14", ip: "192.168.1.22", time: "Today, 06:45 AM", success: true },
  { device: "Unknown Browser", ip: "74.125.0.1", time: "Yesterday, 11:50 PM", success: false },
  { device: "Firefox · macOS", ip: "192.168.2.5", time: "Yesterday, 09:30 AM", success: true },
  { device: "Chrome · Windows 11", ip: "192.168.1.10", time: "2 days ago, 08:10 AM", success: true },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`relative w-10 h-6 rounded-full transition-colors ${on ? "bg-indigo-600" : "bg-gray-300"}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "left-5" : "left-1"}`} />
    </button>
  );
}

export function Settings() {
  const [tab, setTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [general, setGeneral] = useState({
    name: "TinySteps Daycare Center",
    email: "admin@tinysteps.com",
    phone: "+1 555-0001",
    address: "500 Learning Lane, Springfield, IL 62701",
    capacity: "40",
    licenseNo: "DYC-2024-001",
    website: "www.tinysteps.com",
    description: "A nurturing daycare center providing quality early childhood education in a safe environment.",
  });

  const [fees, setFees] = useState({
    monthlyInfant: "850",
    monthlyToddler: "800",
    monthlyPreschool: "750",
    registrationFee: "150",
    lateFee: "25",
    transportFee: "80",
  });

  const [schedule, setSchedule] = useState({
    openTime: "07:00",
    closeTime: "18:00",
    morningShift: "07:00 - 13:00",
    afternoonShift: "13:00 - 18:00",
    fullDay: "07:00 - 18:00",
    daysOpen: "Monday - Friday",
  });

  // Notification settings — email, SMS, push per category
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true, smsAlerts: true, pushAlerts: true,
    healthAlerts: true, healthSMS: true, healthPush: true,
    paymentReminders: true, paymentSMS: false, paymentPush: true,
    activityUpdates: false, activitySMS: false, activityPush: true,
    reportEmails: true, reportSMS: false, reportPush: false,
    emergencyAlerts: true, emergencySMS: true, emergencyPush: true,
    pickupAlerts: true, pickupSMS: true, pickupPush: true,
  });

  // Security
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [twoFA, setTwoFA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [activityLog, setActivityLog] = useState(true);
  const [cctvAdmin, setCctvAdmin] = useState(true);
  const [cctvParent, setCctvParent] = useState(false);
  const [cctvStaff, setCctvStaff] = useState(true);
  const [sessions, setSessions] = useState<LoginSession[]>(MOCK_SESSIONS);
  const [showHistory, setShowHistory] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const gf = (k: keyof typeof general, v: string) => setGeneral(p => ({ ...p, [k]: v }));
  const ff = (k: keyof typeof fees, v: string) => setFees(p => ({ ...p, [k]: v }));
  const sf = (k: keyof typeof schedule, v: string) => setSchedule(p => ({ ...p, [k]: v }));
  const nf = (k: keyof typeof notifSettings) => setNotifSettings(p => ({ ...p, [k]: !p[k] }));

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function changePassword() {
    if (!pwForm.current) { alert("Enter your current password."); return; }
    if (pwForm.newPw.length < 8) { alert("New password must be at least 8 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { alert("Passwords do not match."); return; }
    setPwSuccess(true);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 3000);
  }

  function revokeSession(id: string) {
    setSessions(prev => prev.filter(s => s.id === id && s.current ? true : s.id !== id));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure your daycare center preferences"
        action={
          <Btn onClick={save} variant={saved ? "success" : "primary"}>
            <Save size={15} /> {saved ? "Saved!" : "Save Changes"}
          </Btn>
        }
      />

      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <Card className="p-2">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                  tab === t.id ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                }`}>
                {t.icon}<span>{t.label}</span>
              </button>
            ))}
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          {/* GENERAL / DAYCARE PROFILE */}
          {tab === "general" && (
            <Card className="p-6">
              <h3 className="text-gray-800 mb-5">Daycare Profile</h3>

              {/* Logo upload */}
              <div className="flex items-center gap-5 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-20 h-20 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200">
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    : <span className="text-indigo-700 text-2xl" style={{ fontWeight: 700 }}>TS</span>
                  }
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>Daycare Logo</p>
                  <div className="flex gap-2">
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <Btn variant="secondary" size="sm" onClick={() => logoInputRef.current?.click()}>
                      <Upload size={14} /> Upload Logo
                    </Btn>
                    {logoPreview && (
                      <Btn variant="danger" size="sm" onClick={() => setLogoPreview(null)}>
                        <Trash2 size={14} /> Remove
                      </Btn>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input label="Daycare Name" value={general.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => gf("name", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 block mb-1">Description</label>
                  <textarea value={general.description} onChange={(e: any) => gf("description", e.target.value)} rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>
                <Input label="Email" type="email" value={general.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => gf("email", e.target.value)} />
                <Input label="Phone" value={general.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => gf("phone", e.target.value)} />
                <div className="col-span-2">
                  <Input label="Address" value={general.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => gf("address", e.target.value)} />
                </div>
                <Input label="Website" value={general.website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => gf("website", e.target.value)} />
                <Input label="License Number" value={general.licenseNo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => gf("licenseNo", e.target.value)} />
                <Input label="Max Capacity" type="number" value={general.capacity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => gf("capacity", e.target.value)} />
              </div>
            </Card>
          )}

          {/* FEES */}
          {tab === "fees" && (
            <Card className="p-6">
              <h3 className="text-gray-800 mb-5">Fees & Billing</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Infant Monthly Fee ($)" type="number" value={fees.monthlyInfant} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ff("monthlyInfant", e.target.value)} />
                <Input label="Toddler Monthly Fee ($)" type="number" value={fees.monthlyToddler} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ff("monthlyToddler", e.target.value)} />
                <Input label="Preschool Monthly Fee ($)" type="number" value={fees.monthlyPreschool} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ff("monthlyPreschool", e.target.value)} />
                <Input label="Registration Fee ($)" type="number" value={fees.registrationFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ff("registrationFee", e.target.value)} />
                <Input label="Late Payment Fee ($)" type="number" value={fees.lateFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ff("lateFee", e.target.value)} />
                <Input label="Transportation Fee ($)" type="number" value={fees.transportFee} onChange={(e: React.ChangeEvent<HTMLInputElement>) => ff("transportFee", e.target.value)} />
              </div>
            </Card>
          )}

          {/* SCHEDULE */}
          {tab === "schedule" && (
            <Card className="p-6">
              <h3 className="text-gray-800 mb-5">Operating Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Opening Time" type="time" value={schedule.openTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sf("openTime", e.target.value)} />
                <Input label="Closing Time" type="time" value={schedule.closeTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sf("closeTime", e.target.value)} />
                <Input label="Morning Shift" value={schedule.morningShift} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sf("morningShift", e.target.value)} />
                <Input label="Afternoon Shift" value={schedule.afternoonShift} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sf("afternoonShift", e.target.value)} />
                <Input label="Full Day" value={schedule.fullDay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sf("fullDay", e.target.value)} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Days Open</label>
                  <select value={schedule.daysOpen} onChange={(e: any) => sf("daysOpen", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Monday - Friday</option>
                    <option>Monday - Saturday</option>
                    <option>All Week</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {/* NOTIFICATIONS */}
          {tab === "notifications" && (
            <Card className="p-6">
              <h3 className="text-gray-800 mb-2">Notification Settings</h3>
              <p className="text-sm text-gray-400 mb-5">Choose how you receive notifications for each category</p>

              {/* Channel toggles header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center mb-3 px-4">
                <span className="text-xs text-gray-400">Notification Type</span>
                <div className="flex items-center gap-1 text-xs text-gray-400"><Mail size={12} /> Email</div>
                <div className="flex items-center gap-1 text-xs text-gray-400"><MessageSquare size={12} /> SMS</div>
                <div className="flex items-center gap-1 text-xs text-gray-400"><Smartphone size={12} /> Push</div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Health Alerts", desc: "Fever, injury, and emergency alerts", emailK: "healthAlerts" as const, smsK: "healthSMS" as const, pushK: "healthPush" as const, urgent: true },
                  { label: "Emergency Alerts", desc: "Critical safety and emergency situations", emailK: "emergencyAlerts" as const, smsK: "emergencySMS" as const, pushK: "emergencyPush" as const, urgent: true },
                  { label: "Pickup Alerts", desc: "Child pickup and drop-off confirmations", emailK: "pickupAlerts" as const, smsK: "pickupSMS" as const, pushK: "pickupPush" as const, urgent: false },
                  { label: "Payment Reminders", desc: "Overdue invoice reminders", emailK: "paymentReminders" as const, smsK: "paymentSMS" as const, pushK: "paymentPush" as const, urgent: false },
                  { label: "Activity Updates", desc: "Daily activity completion summaries", emailK: "activityUpdates" as const, smsK: "activitySMS" as const, pushK: "activityPush" as const, urgent: false },
                  { label: "Weekly Reports", desc: "Weekly summary reports", emailK: "reportEmails" as const, smsK: "reportSMS" as const, pushK: "reportPush" as const, urgent: false },
                ].map(n => (
                  <div key={n.label} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm" style={{ fontWeight: 500 }}>{n.label}</p>
                        {n.urgent && <Badge color="red" label="Critical" />}
                      </div>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                    <Toggle on={notifSettings[n.emailK]} onToggle={() => nf(n.emailK)} />
                    <Toggle on={notifSettings[n.smsK]} onToggle={() => nf(n.smsK)} />
                    <Toggle on={notifSettings[n.pushK]} onToggle={() => nf(n.pushK)} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <>
              {/* Change Password */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Key size={18} className="text-indigo-600" />
                  <h3 className="text-gray-800">Change Password</h3>
                </div>
                {pwSuccess && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                    <CheckCircle size={16} /> Password changed successfully!
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {([
                    { key: "current" as const, label: "Current Password" },
                    { key: "newPw" as const, label: "New Password" },
                  ] as const).map(f => (
                    <div key={f.key} className="relative">
                      <label className="text-sm text-gray-600 block mb-1">{f.label}</label>
                      <div className="relative">
                        <input
                          type={showPw[f.key] ? "text" : "password"}
                          value={pwForm[f.key]}
                          onChange={(e: any) => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder="••••••••"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={() => setShowPw(p => ({ ...p, [f.key]: !p[f.key] }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPw[f.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 relative">
                    <label className="text-sm text-gray-600 block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPw.confirm ? "text" : "password"}
                        value={pwForm.confirm}
                        onChange={(e: any) => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPw.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Btn variant="primary" size="sm" onClick={changePassword}>
                    <Key size={14} /> Update Password
                  </Btn>
                </div>
              </Card>

              {/* 2FA & Security Toggles */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Smartphone size={18} className="text-indigo-600" />
                  <h3 className="text-gray-800">Security Options</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Two-Factor Authentication (2FA)", desc: "Require OTP for every admin login", state: twoFA, toggle: () => setTwoFA(p => !p) },
                    { label: "Session Timeout", desc: "Auto logout after 30 minutes of inactivity", state: sessionTimeout, toggle: () => setSessionTimeout(p => !p) },
                    { label: "Activity Logging", desc: "Log all admin actions for audit trail", state: activityLog, toggle: () => setActivityLog(p => !p) },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm" style={{ fontWeight: 500 }}>{s.label}</p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                      <Toggle on={s.state} onToggle={s.toggle} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* CCTV Permissions */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Monitor size={18} className="text-indigo-600" />
                  <h3 className="text-gray-800">CCTV Access Permissions</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Admin Access", desc: "Full CCTV access for all admin accounts", state: cctvAdmin, toggle: () => setCctvAdmin(p => !p) },
                    { label: "Parent Access", desc: "Allow parents to view their child's classroom camera", state: cctvParent, toggle: () => setCctvParent(p => !p) },
                    { label: "Staff Access", desc: "Allow staff to view cameras in their assigned areas", state: cctvStaff, toggle: () => setCctvStaff(p => !p) },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm" style={{ fontWeight: 500 }}>{s.label}</p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </div>
                      <Toggle on={s.state} onToggle={s.toggle} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Sessions */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-indigo-600" />
                    <h3 className="text-gray-800">Active Sessions</h3>
                  </div>
                  <Btn variant="secondary" size="sm" onClick={() => setShowHistory(true)}>
                    <Clock size={14} /> Login History
                  </Btn>
                </div>
                <div className="space-y-3">
                  {sessions.map(s => (
                    <div key={s.id} className={`flex items-center gap-4 p-4 rounded-xl border ${s.current ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-100"}`}>
                      <Monitor size={18} className={s.current ? "text-indigo-600" : "text-gray-400"} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm" style={{ fontWeight: 500 }}>{s.device}</p>
                          {s.current && <Badge color="green" label="Current" />}
                        </div>
                        <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <Btn variant="danger" size="sm" onClick={() => revokeSession(s.id)}>
                          <LogOut size={13} /> Revoke
                        </Btn>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* GROUPS */}
          {tab === "groups" && (
            <Card className="p-6">
              <h3 className="text-gray-800 mb-5">Groups & Room Configuration</h3>
              <div className="space-y-3">
                {[
                  { name: "Rainbow", age: "1-2 years", capacity: 8, current: 3, room: "Room 101" },
                  { name: "Sunflower", age: "2-3 years", capacity: 10, current: 5, room: "Room 102" },
                  { name: "Butterfly", age: "3-4 years", capacity: 10, current: 4, room: "Room 103" },
                  { name: "Star", age: "4-5 years", capacity: 10, current: 4, room: "Room 104" },
                ].map(g => (
                  <div key={g.name} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-700 text-sm" style={{ fontWeight: 700 }}>{g.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ fontWeight: 600 }}>{g.name} Group</p>
                      <p className="text-xs text-gray-400">{g.age} · {g.room}</p>
                    </div>
                    <div className="text-sm text-gray-600">{g.current}/{g.capacity} enrolled</div>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(g.current / g.capacity) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Login History Modal */}
      {showHistory && (
        <Modal title="Login History" onClose={() => setShowHistory(false)} size="lg">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {LOGIN_HISTORY.map((h, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${h.success ? "bg-gray-50" : "bg-red-50"}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${h.success ? "bg-green-500" : "bg-red-500"}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{h.device}</p>
                  <p className="text-xs text-gray-400">{h.ip} · {h.time}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${h.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {h.success ? "Success" : "Failed"}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

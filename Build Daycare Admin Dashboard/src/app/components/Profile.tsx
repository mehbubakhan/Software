import { useState, useRef } from "react";
import { Camera, Save, Award, Clock, Users, Key, Eye, EyeOff, LogOut, Edit3, CheckCircle, Shield, Activity, Smartphone, Monitor, Mail } from "lucide-react";
import { Card, Input, Btn, PageHeader, Modal, Badge } from "./ui";

interface ActivityLog {
  id: string;
  action: string;
  module: string;
  time: string;
  ip: string;
}

const ACTIVITY_LOGS: ActivityLog[] = [
  { id: "a1", action: "Approved admission for Lucas Moore", module: "Admissions", time: "Today, 10:30 AM", ip: "192.168.1.10" },
  { id: "a2", action: "Added health record for Emma Johnson", module: "Health", time: "Today, 09:15 AM", ip: "192.168.1.10" },
  { id: "a3", action: "Updated billing invoice INV-2025003", module: "Billing", time: "Yesterday, 4:00 PM", ip: "192.168.1.10" },
  { id: "a4", action: "Resolved complaint CMP-2025001", module: "Complaints", time: "Yesterday, 2:45 PM", ip: "192.168.1.10" },
  { id: "a5", action: "Added new staff member Tom Robinson", module: "Staff", time: "3 days ago, 11:20 AM", ip: "192.168.1.10" },
  { id: "a6", action: "Changed notification settings", module: "Settings", time: "3 days ago, 10:00 AM", ip: "192.168.1.10" },
  { id: "a7", action: "Generated payroll report", module: "Staff", time: "5 days ago, 3:30 PM", ip: "192.168.1.10" },
  { id: "a8", action: "Sent payment reminder to Johnson family", module: "Billing", time: "1 week ago, 9:00 AM", ip: "192.168.1.10" },
  { id: "a9", action: "Updated daily activities for Rainbow group", module: "Activities", time: "1 week ago, 2:15 PM", ip: "192.168.1.10" },
  { id: "a10", action: "Verified vaccination records", module: "Health", time: "2 weeks ago, 11:40 AM", ip: "192.168.1.10" },
];

const MODULE_COLORS: Record<string, string> = {
  Admissions: "bg-blue-100 text-blue-700",
  Health: "bg-green-100 text-green-700",
  Billing: "bg-yellow-100 text-yellow-700",
  Complaints: "bg-red-100 text-red-700",
  Staff: "bg-purple-100 text-purple-700",
  Settings: "bg-gray-100 text-gray-700",
  Activities: "bg-indigo-100 text-indigo-700",
};

export function Profile() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [showPwModal, setShowPwModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState<"info" | "activity" | "security">("info");

  const [profile, setProfile] = useState({
    name: "Dr. Patricia Lee",
    title: "Daycare Director",
    email: "p.lee@tinysteps.com",
    phone: "+1 555-0201",
    dob: "1978-04-22",
    address: "789 Director Ave, Springfield, IL",
    bio: "Experienced early childhood educator with over 15 years in daycare management. Passionate about creating safe, nurturing environments for children's development.",
    joinDate: "January 15, 2018",
    qualifications: "PhD in Early Childhood Education, Certified Childcare Director",
    emergencyContact: "Dr. James Lee · +1 555-0202",
  });

  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwSuccess, setPwSuccess] = useState(false);
  const [activityFilter, setActivityFilter] = useState("All");

  const p = (k: keyof typeof profile, v: string) => setProfile(prev => ({ ...prev, [k]: v }));

  function save() {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }

  function changePassword() {
    if (!pwForm.current) { alert("Enter current password."); return; }
    if (pwForm.newPw.length < 8) { alert("New password must be at least 8 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { alert("Passwords do not match."); return; }
    setPwSuccess(true);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => { setPwSuccess(false); setShowPwModal(false); }, 2500);
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  const modules = ["All", ...Array.from(new Set(ACTIVITY_LOGS.map(a => a.module)))];
  const filteredLogs = activityFilter === "All" ? ACTIVITY_LOGS : ACTIVITY_LOGS.filter(a => a.module === activityFilter);

  const stats = [
    { label: "Years Experience", value: "15+", icon: <Award size={18} className="text-indigo-600" /> },
    { label: "Children Managed", value: "200+", icon: <Users size={18} className="text-blue-600" /> },
    { label: "Staff Supervised", value: "7", icon: <Shield size={18} className="text-green-600" /> },
    { label: "Joined", value: "2018", icon: <Clock size={18} className="text-orange-600" /> },
  ];

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your admin profile and account"
        action={
          <div className="flex gap-2">
            {editing
              ? <>
                  <Btn variant="secondary" onClick={() => setEditing(false)}>Cancel</Btn>
                  <Btn onClick={save}><Save size={15} /> Save Changes</Btn>
                </>
              : <>
                  <Btn variant="secondary" onClick={() => setEditing(true)}><Edit3 size={15} /> Edit Profile</Btn>
                  <Btn variant="secondary" onClick={() => setShowPwModal(true)}><Key size={15} /> Change Password</Btn>
                  <Btn variant="danger" onClick={() => setShowLogoutConfirm(true)}><LogOut size={15} /> Logout</Btn>
                </>
            }
          </div>
        }
      />

      {saved && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          <CheckCircle size={16} /> Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <Card className="p-6 text-center">
            <div className="relative inline-block mb-4">
              {avatarPreview
                ? <img src={avatarPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-2xl" style={{ fontWeight: 700 }}>PL</span>
                  </div>
                )
              }
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <button onClick={() => avatarRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow hover:bg-indigo-700 transition-colors">
                <Camera size={13} />
              </button>
            </div>
            <h2 className="text-gray-900">{profile.name}</h2>
            <p className="text-indigo-600 text-sm mt-0.5">{profile.title}</p>
            <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
            <div className="mt-3 flex justify-center">
              <Badge color="green">Active</Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Member since {profile.joinDate}</p>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-gray-700 mb-3">Stats & Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map(s => (
                <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <p style={{ fontWeight: 700 }} className="text-lg">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setEditing(true)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-sm text-left">
                <Edit3 size={15} /> Edit Profile
              </button>
              <button onClick={() => setShowPwModal(true)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-sm text-left">
                <Key size={15} /> Change Password
              </button>
              <button onClick={() => setActiveSection("activity")}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-sm text-left">
                <Activity size={15} /> View Activity Log
              </button>
              <button onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 text-red-600 transition-colors text-sm text-left">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {([
              { id: "info", label: "Personal Info" },
              { id: "activity", label: "Activity Log" },
              { id: "security", label: "Security Info" },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setActiveSection(t.id)}
                className={`px-4 py-2.5 text-sm transition-colors ${
                  activeSection === t.id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {activeSection === "info" && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">Personal Information</h3>
                {!editing && (
                  <Btn variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    <Edit3 size={14} /> Edit
                  </Btn>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" value={profile.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("name", e.target.value)} disabled={!editing} />
                <Input label="Title / Role" value={profile.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("title", e.target.value)} disabled={!editing} />
                <Input label="Email" type="email" value={profile.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("email", e.target.value)} disabled={!editing} />
                <Input label="Phone" value={profile.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("phone", e.target.value)} disabled={!editing} />
                <Input label="Date of Birth" type="date" value={profile.dob} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("dob", e.target.value)} disabled={!editing} />
                <Input label="Emergency Contact" value={profile.emergencyContact} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("emergencyContact", e.target.value)} disabled={!editing} />
                <div className="col-span-2">
                  <Input label="Address" value={profile.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("address", e.target.value)} disabled={!editing} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 block mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={e => p("bio", e.target.value)}
                    disabled={!editing}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-60"
                  />
                </div>
                <div className="col-span-2">
                  <Input label="Qualifications & Certifications" value={profile.qualifications} onChange={(e: React.ChangeEvent<HTMLInputElement>) => p("qualifications", e.target.value)} disabled={!editing} />
                </div>
              </div>
              {editing && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Btn onClick={save}><Save size={15} /> Save Changes</Btn>
                  <Btn variant="secondary" onClick={() => setEditing(false)}>Cancel</Btn>
                </div>
              )}
            </Card>
          )}

          {activeSection === "activity" && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">Activity Log</h3>
                <p className="text-xs text-gray-400">{filteredLogs.length} entries</p>
              </div>

              {/* Module filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {modules.map(m => (
                  <button key={m} onClick={() => setActivityFilter(m)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      activityFilter === m ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLogs.map(a => (
                  <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-gray-700">{a.action}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${MODULE_COLORS[a.module] ?? "bg-gray-100 text-gray-600"}`}>
                          {a.module}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs text-gray-400">{a.time}</p>
                        <p className="text-xs text-gray-300">IP: {a.ip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === "security" && (
            <Card className="p-6">
              <h3 className="text-gray-800 mb-4">Security Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Account Type", value: "Super Admin", icon: <Shield size={16} className="text-indigo-600" /> },
                    { label: "Last Login", value: "Today, 08:22 AM", icon: <Clock size={16} className="text-green-600" /> },
                    { label: "2FA Status", value: "Enabled", icon: <Smartphone size={16} className="text-blue-600" /> },
                    { label: "Active Sessions", value: "3 devices", icon: <Monitor size={16} className="text-orange-600" /> },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        {s.icon}
                        <span className="text-xs text-gray-400">{s.label}</span>
                      </div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700" style={{ fontWeight: 500 }}>Account Security Score</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-3 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "82%" }} />
                    </div>
                    <span className="text-sm text-blue-700" style={{ fontWeight: 700 }}>82/100</span>
                  </div>
                  <p className="text-xs text-blue-500 mt-1">Enable recovery email to improve your score</p>
                </div>

                <div className="flex gap-2">
                  <Btn variant="secondary" size="sm" onClick={() => setShowPwModal(true)}>
                    <Key size={14} /> Change Password
                  </Btn>
                  <Btn variant="secondary" size="sm" onClick={() => alert("Recovery email setup — feature coming soon.")}>
                    <Mail size={14} /> Setup Recovery Email
                  </Btn>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPwModal && (
        <Modal title="Change Password" onClose={() => { setShowPwModal(false); setPwForm({ current: "", newPw: "", confirm: "" }); }} size="sm">
          <div className="space-y-4">
            {pwSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                <CheckCircle size={16} /> Password changed successfully!
              </div>
            )}
            {([
              { key: "current" as const, label: "Current Password" },
              { key: "newPw" as const, label: "New Password" },
              { key: "confirm" as const, label: "Confirm New Password" },
            ]).map(f => (
              <div key={f.key}>
                <label className="text-sm text-gray-600 block mb-1">{f.label}</label>
                <div className="relative">
                  <input
                    type={showPw[f.key] ? "text" : "password"}
                    value={pwForm[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="button" onClick={() => setShowPw(p => ({ ...p, [f.key]: !p[f.key] }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw[f.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {f.key === "confirm" && pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Btn variant="primary" onClick={changePassword}><Key size={14} /> Update Password</Btn>
              <Btn variant="secondary" onClick={() => setShowPwModal(false)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <Modal title="Confirm Logout" onClose={() => setShowLogoutConfirm(false)} size="sm">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Are you sure you want to logout? Any unsaved changes will be lost.</p>
            <div className="flex gap-2">
              <Btn variant="danger" onClick={() => alert("Logging out... (In production this would clear the session and redirect to login)")}>
                <LogOut size={14} /> Yes, Logout
              </Btn>
              <Btn variant="secondary" onClick={() => setShowLogoutConfirm(false)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


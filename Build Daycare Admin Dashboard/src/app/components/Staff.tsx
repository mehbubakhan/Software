import { useState } from "react";
import {
  Plus, Eye, Pencil, Trash2, QrCode, Scan, Hand, Fingerprint,
  Clock, AlertCircle, DollarSign, UserCheck, UserX, Bell, Shield,
  ChevronDown, CheckCircle, XCircle, X, Calendar, Users
} from "lucide-react";
import {
  Card, StatusBadge, Modal, Input, Select, Textarea, Btn,
  PageHeader, SearchBar, Avatar, Badge, StatCard
} from "./ui";
import { mockStaff as initial } from "./mockData";
import type { Staff } from "./types";

// ── Extended types ──────────────────────────────────────────────
interface AttendanceLog {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  method: "Face Recognition" | "QR Code" | "Manual" | "Biometric";
  status: "Present" | "Late" | "Absent" | "Half Day";
  hoursWorked: number;
}

interface PayrollRecord {
  id: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  net: number;
  status: "Paid" | "Pending" | "Processing";
  paidDate?: string;
}

interface DutyAssignment {
  group: string;
  classroom: string;
  date: string;
  notes: string;
}

interface StaffExt extends Staff {
  staffId: string;
  experience: string;
  certifications: string[];
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  nationality: string;
  dateOfBirth: string;
  shiftType: "Morning" | "Evening" | "Night" | "Emergency";
  assignedChildrenCount: number;
  assignedGroup: string;
  attendanceStatus: "Present" | "Late" | "Absent" | "On Leave";
  attendanceLogs: AttendanceLog[];
  payrollRecords: PayrollRecord[];
  dutyAssignment?: DutyAssignment;
  salary: number;
  suspended: boolean;
  suspendReason?: string;
  alertHistory: { date: string; message: string }[];
}

// ── Constants ───────────────────────────────────────────────────
const ROLES = ["Director", "Lead Teacher", "Assistant Teacher", "Nanny", "Driver", "Nurse", "Admin"];
const SHIFT_TYPES = ["Morning", "Evening", "Night", "Emergency"] as const;
const GROUPS = ["Sunflower", "Butterfly", "Rainbow", "Star", "Transport", "Health", "Admin"];
const CLASSROOMS = ["Room A", "Room B", "Room C", "Room D", "Hall", "Playground", "Medical Bay"];
const ATTENDANCE_METHODS = ["Face Recognition", "QR Code", "Manual", "Biometric"] as const;

const SHIFT_COLORS: Record<string, string> = {
  Morning: "bg-amber-100 text-amber-700",
  Evening: "bg-purple-100 text-purple-700",
  Night: "bg-indigo-100 text-indigo-700",
  Emergency: "bg-red-100 text-red-700",
};

const ATT_COLORS: Record<string, string> = {
  Present: "bg-green-100 text-green-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-red-100 text-red-700",
  "On Leave": "bg-blue-100 text-blue-700",
};

const METHOD_ICONS: Record<string, JSX.Element> = {
  "Face Recognition": <Scan size={14} />,
  "QR Code": <QrCode size={14} />,
  "Manual": <Hand size={14} />,
  "Biometric": <Fingerprint size={14} />,
};

// ── Enrich ──────────────────────────────────────────────────────
const CERTS = [
  ["CPR Certified", "Child Development Associate", "First Aid"],
  ["Early Childhood Education", "Montessori Training", "Nutrition Care"],
  ["Child Psychology", "Special Needs Education", "CPR Certified"],
  ["Nursing License", "Pediatric Care", "First Aid"],
  ["Driver License", "Safe Transport Certification"],
  ["Admin Management", "Child Safeguarding"],
  ["Lead Teacher Certification", "Behavior Management"],
];

const ATT_STATUSES: StaffExt["attendanceStatus"][] = ["Present", "Present", "Present", "Late", "Absent", "On Leave", "Present"];

function enrichStaff(s: Staff, idx: number): StaffExt {
  const num = idx + 1;
  const salary = [3200, 2800, 2600, 2400, 2200, 3500, 2900][idx] ?? 2500;
  const logs: AttendanceLog[] = Array.from({ length: 7 }, (_, d) => {
    const method = ATTENDANCE_METHODS[d % 4];
    const late = d === 2;
    return {
      id: `al-${s.id}-${d}`,
      date: new Date(Date.now() - d * 86400000).toISOString().split("T")[0],
      checkIn: late ? "09:18" : "08:00",
      checkOut: "17:00",
      method,
      status: late ? "Late" : "Present",
      hoursWorked: late ? 7.7 : 9,
    };
  });
  const payroll: PayrollRecord[] = ["May 2025", "Apr 2025", "Mar 2025"].map((month, i) => ({
    id: `pr-${s.id}-${i}`,
    month,
    baseSalary: salary,
    bonus: i === 0 ? 200 : 0,
    deductions: 150,
    net: salary + (i === 0 ? 200 : 0) - 150,
    status: i === 0 ? "Pending" : "Paid",
    paidDate: i > 0 ? `2025-0${5 - i}-28` : undefined,
  }));
  return {
    ...s,
    staffId: `STF-${1000 + num}`,
    experience: ["2 years", "5 years", "3 years", "8 years", "1 year", "4 years", "6 years"][idx] ?? "1 year",
    certifications: CERTS[idx] ?? ["CPR Certified"],
    emergencyContact: ["John " + s.name.split(" ")[1], "Sarah " + s.name.split(" ")[1]][idx % 2] ?? "N/A",
    emergencyPhone: `+1 (555) 4${num}0-${1000 + num * 7}`,
    address: `${num * 12} Oak Street, City`,
    nationality: ["American", "British", "Canadian", "Australian", "Filipino"][idx % 5],
    dateOfBirth: `198${(idx % 9) + 1}-0${(idx % 9) + 1}-15`,
    shiftType: SHIFT_TYPES[idx % 4],
    assignedChildrenCount: [4, 6, 5, 0, 0, 8, 3][idx] ?? 0,
    assignedGroup: GROUPS[idx % GROUPS.length],
    attendanceStatus: ATT_STATUSES[idx],
    attendanceLogs: logs,
    payrollRecords: payroll,
    salary,
    suspended: idx === 5,
    suspendReason: idx === 5 ? "Policy violation under review" : undefined,
    alertHistory: [{ date: "2025-05-10", message: "Reminder: certification renewal due" }],
    dutyAssignment: idx < 4 ? {
      group: GROUPS[idx],
      classroom: CLASSROOMS[idx],
      date: "2025-06-04",
      notes: "Regular duty",
    } : undefined,
  };
}

// ── Component ───────────────────────────────────────────────────
type ModalType = "add" | "edit" | "view" | "attendance" | "duty" | "payroll" | "alert" | "suspend" | null;
type ProfileTab = "info" | "attendance" | "payroll" | "duty";

const emptyForm = {
  name: "", role: "Assistant Teacher", email: "", phone: "",
  shift: "Morning", group: "Sunflower", status: "Active", joinDate: "",
  shiftType: "Morning" as StaffExt["shiftType"],
  experience: "", certifications: [] as string[], salary: 2500,
  emergencyContact: "", emergencyPhone: "", address: "", nationality: "",
};

export function StaffNannies() {
  const [staff, setStaff] = useState<StaffExt[]>(() => initial.map(enrichStaff));
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterShift, setFilterShift] = useState("All");
  const [filterAtt, setFilterAtt] = useState("All");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<StaffExt | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>("info");
  const [form, setForm] = useState(emptyForm);
  const [certInput, setCertInput] = useState("");
  const [attMethod, setAttMethod] = useState<typeof ATTENDANCE_METHODS[number]>("QR Code");
  const [attSimState, setAttSimState] = useState<"idle" | "scanning" | "done">("idle");
  const [dutyForm, setDutyForm] = useState({ group: "Sunflower", classroom: "Room A", date: "", notes: "" });
  const [payrollMonth, setPayrollMonth] = useState("June 2025");
  const [alertMsg, setAlertMsg] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  const filtered = staff.filter(s => {
    const m = s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.staffId.toLowerCase().includes(search.toLowerCase());
    const r = filterRole === "All" || s.role === filterRole;
    const sh = filterShift === "All" || s.shiftType === filterShift;
    const at = filterAtt === "All" || s.attendanceStatus === filterAtt;
    return m && r && sh && at;
  });

  const activeCount = staff.filter(s => s.status === "Active" && !s.suspended).length;
  const presentCount = staff.filter(s => s.attendanceStatus === "Present").length;
  const absentCount = staff.filter(s => s.attendanceStatus === "Absent").length;
  const suspendedCount = staff.filter(s => s.suspended).length;

  function openView(s: StaffExt, tab: ProfileTab = "info") {
    setSelected(s); setProfileTab(tab); setModal("view");
  }

  function save() {
    if (modal === "add") {
      const newS: StaffExt = {
        ...form, id: `s${Date.now()}`, staffId: `STF-${1000 + staff.length + 1}`,
        certifications: form.certifications, salary: Number(form.salary),
        assignedChildrenCount: 0, assignedGroup: form.group,
        attendanceStatus: "Absent", attendanceLogs: [], payrollRecords: [],
        suspended: false, alertHistory: [], dateOfBirth: "", nationality: form.nationality,
        address: form.address, emergencyContact: form.emergencyContact, emergencyPhone: form.emergencyPhone,
      };
      setStaff(prev => [...prev, newS]);
    } else if (modal === "edit" && selected) {
      setStaff(prev => prev.map(s => s.id === selected.id ? { ...s, ...form, salary: Number(form.salary), certifications: form.certifications } : s));
    }
    setModal(null);
  }

  function simulateAttendance() {
    if (!selected) return;
    setAttSimState("scanning");
    setTimeout(() => {
      setAttSimState("done");
      const log: AttendanceLog = {
        id: `al-${Date.now()}`, date: new Date().toISOString().split("T")[0],
        checkIn: new Date().toTimeString().slice(0, 5), checkOut: "--:--",
        method: attMethod, status: "Present", hoursWorked: 0,
      };
      setStaff(prev => prev.map(s => s.id === selected.id ? {
        ...s, attendanceStatus: "Present",
        attendanceLogs: [log, ...s.attendanceLogs],
      } : s));
      setSelected(prev => prev ? { ...prev, attendanceStatus: "Present", attendanceLogs: [log, ...prev.attendanceLogs] } : prev);
      setTimeout(() => setAttSimState("idle"), 2000);
    }, 1800);
  }

  function assignDuty() {
    if (!selected) return;
    setStaff(prev => prev.map(s => s.id === selected.id ? { ...s, dutyAssignment: { ...dutyForm } } : s));
    setModal(null);
  }

  function generatePayroll() {
    if (!selected) return;
    const record: PayrollRecord = {
      id: `pr-${Date.now()}`, month: payrollMonth,
      baseSalary: selected.salary, bonus: 0, deductions: 150,
      net: selected.salary - 150, status: "Processing",
    };
    setStaff(prev => prev.map(s => s.id === selected.id ? { ...s, payrollRecords: [record, ...s.payrollRecords] } : s));
    setModal(null);
  }

  function sendAlert() {
    if (!selected || !alertMsg.trim()) return;
    const entry = { date: new Date().toISOString().split("T")[0], message: alertMsg };
    setStaff(prev => prev.map(s => s.id === selected.id ? { ...s, alertHistory: [entry, ...s.alertHistory] } : s));
    setAlertMsg(""); setModal(null);
  }

  function doSuspend() {
    if (!selected) return;
    setStaff(prev => prev.map(s => s.id === selected.id ? { ...s, suspended: true, suspendReason, status: "Inactive" } : s));
    setModal(null);
  }

  function unsuspend(id: string) {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, suspended: false, suspendReason: undefined, status: "Active" } : s));
  }

  function remove(id: string) {
    if (confirm("Remove this staff member?")) setStaff(prev => prev.filter(s => s.id !== id));
  }

  const f = (k: keyof typeof form, v: string | number) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader
        title="Staff & Nanny Management"
        subtitle={`${activeCount} active · ${presentCount} present today`}
        action={<Btn onClick={() => { setForm(emptyForm); setCertInput(""); setModal("add"); }}><Plus size={16} /> Add Staff</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Staff" value={staff.length} color="indigo" icon={<Users size={20} />} />
        <StatCard label="Present Today" value={presentCount} color="green" icon={<CheckCircle size={20} />} />
        <StatCard label="Absent" value={absentCount} color="red" icon={<XCircle size={20} />} />
        <StatCard label="Suspended" value={suspendedCount} color="amber" icon={<Shield size={20} />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, role, ID…" />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Roles</option>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterShift} onChange={e => setFilterShift(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Shifts</option>
          {SHIFT_TYPES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterAtt} onChange={e => setFilterAtt(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Attendance</option>
          {["Present", "Late", "Absent", "On Leave"].map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-600">Staff ID</th>
                <th className="text-left px-4 py-3 text-gray-600">Staff Member</th>
                <th className="text-left px-4 py-3 text-gray-600">Role</th>
                <th className="text-left px-4 py-3 text-gray-600">Shift</th>
                <th className="text-left px-4 py-3 text-gray-600">Attendance</th>
                <th className="text-left px-4 py-3 text-gray-600">Assigned</th>
                <th className="text-left px-4 py-3 text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${s.suspended ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs text-indigo-700">{s.staffId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p style={{ fontWeight: 500 }}>{s.name}</p>
                        <p className="text-xs text-gray-400">{s.experience} exp.</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${SHIFT_COLORS[s.shiftType]}`}>{s.shiftType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${ATT_COLORS[s.attendanceStatus]}`}>{s.attendanceStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                      <Users size={12} />{s.assignedChildrenCount} children
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.suspended
                      ? <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">Suspended</span>
                      : <StatusBadge status={s.status} />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button onClick={() => openView(s)} title="View Profile"
                        className="p-1.5 rounded hover:bg-indigo-50 text-indigo-600 transition-colors"><Eye size={14} /></button>
                      <button onClick={() => { setSelected(s); setForm({ ...emptyForm, name: s.name, role: s.role, email: s.email, phone: s.phone, shift: s.shift, group: s.group, status: s.status, joinDate: s.joinDate, shiftType: s.shiftType, experience: s.experience, certifications: s.certifications, salary: s.salary, emergencyContact: s.emergencyContact, emergencyPhone: s.emergencyPhone, address: s.address, nationality: s.nationality }); setModal("edit"); }}
                        title="Edit" className="p-1.5 rounded hover:bg-amber-50 text-amber-600 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => openView(s, "attendance")} title="Track Attendance"
                        className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"><Clock size={14} /></button>
                      <button onClick={() => { setSelected(s); setDutyForm({ group: s.assignedGroup, classroom: CLASSROOMS[0], date: new Date().toISOString().split("T")[0], notes: "" }); setModal("duty"); }}
                        title="Assign Duty" className="p-1.5 rounded hover:bg-purple-50 text-purple-600 transition-colors"><UserCheck size={14} /></button>
                      <button onClick={() => { setSelected(s); setModal("payroll"); setPayrollMonth("June 2025"); }}
                        title="Generate Payroll" className="p-1.5 rounded hover:bg-teal-50 text-teal-600 transition-colors"><DollarSign size={14} /></button>
                      <button onClick={() => { setSelected(s); setAlertMsg(""); setModal("alert"); }}
                        title="Send Alert" className="p-1.5 rounded hover:bg-orange-50 text-orange-600 transition-colors"><Bell size={14} /></button>
                      {s.suspended
                        ? <button onClick={() => unsuspend(s.id)} title="Unsuspend" className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"><CheckCircle size={14} /></button>
                        : <button onClick={() => { setSelected(s); setSuspendReason(""); setModal("suspend"); }} title="Suspend" className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"><UserX size={14} /></button>}
                      <button onClick={() => remove(s.id)} title="Delete" className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No staff found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Add / Edit Modal ── */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Staff Member" : "Edit Staff Member"} onClose={() => setModal(null)} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={v => f("name", v)} />
            <Select label="Role" value={form.role} onChange={v => f("role", v)} options={ROLES} />
            <Input label="Email" value={form.email} onChange={v => f("email", v)} />
            <Input label="Phone" value={form.phone} onChange={v => f("phone", v)} />
            <Select label="Shift Type" value={form.shiftType} onChange={v => f("shiftType", v)} options={[...SHIFT_TYPES]} />
            <Select label="Assigned Group" value={form.group} onChange={v => f("group", v)} options={GROUPS} />
            <Input label="Join Date" type="date" value={form.joinDate} onChange={v => f("joinDate", v)} />
            <Input label="Experience" value={form.experience} onChange={v => f("experience", v)} placeholder="e.g. 3 years" />
            <Input label="Monthly Salary ($)" type="number" value={String(form.salary)} onChange={v => f("salary", Number(v))} />
            <Select label="Status" value={form.status} onChange={v => f("status", v)} options={["Active", "Inactive"]} />
            <Input label="Emergency Contact" value={form.emergencyContact} onChange={v => f("emergencyContact", v)} />
            <Input label="Emergency Phone" value={form.emergencyPhone} onChange={v => f("emergencyPhone", v)} />
            <div className="col-span-2">
              <Input label="Address" value={form.address} onChange={v => f("address", v)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Certifications</label>
              <div className="flex gap-2 mb-2">
                <input value={certInput} onChange={e => setCertInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && certInput.trim()) { setForm(p => ({ ...p, certifications: [...p.certifications, certInput.trim()] })); setCertInput(""); e.preventDefault(); } }}
                  placeholder="Add certification and press Enter"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex flex-wrap gap-2">
                {form.certifications.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    {c}
                    <button onClick={() => setForm(p => ({ ...p, certifications: p.certifications.filter((_, j) => j !== i) }))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}

      {/* ── View Profile Modal ── */}
      {modal === "view" && selected && (
        <Modal title={`${selected.name} — Staff Profile`} onClose={() => setModal(null)} size="xl">
          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
            <Avatar name={selected.name} size="lg" />
            <div>
              <h3 style={{ fontWeight: 600 }} className="text-lg">{selected.name}</h3>
              <p className="text-sm text-gray-500">{selected.role} · <span className="font-mono text-indigo-600 text-xs">{selected.staffId}</span></p>
              <div className="flex gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs ${SHIFT_COLORS[selected.shiftType]}`}>{selected.shiftType} Shift</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${ATT_COLORS[selected.attendanceStatus]}`}>{selected.attendanceStatus}</span>
                {selected.suspended && <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">Suspended</span>}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-5 gap-1">
            {(["info", "attendance", "payroll", "duty"] as ProfileTab[]).map(t => (
              <button key={t} onClick={() => setProfileTab(t)}
                className={`px-4 py-2 text-sm capitalize transition-colors ${profileTab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
                {t === "duty" ? "Duty Assignment" : t}
              </button>
            ))}
          </div>

          {profileTab === "info" && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                ["Email", selected.email], ["Phone", selected.phone],
                ["Experience", selected.experience], ["Nationality", selected.nationality],
                ["Group", selected.assignedGroup], ["Assigned Children", String(selected.assignedChildrenCount)],
                ["Emergency Contact", selected.emergencyContact], ["Emergency Phone", selected.emergencyPhone],
                ["Address", selected.address], ["Join Date", selected.joinDate],
                ["Salary", `$${selected.salary.toLocaleString()}/mo`], ["Status", selected.suspended ? "Suspended" : selected.status],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p style={{ fontWeight: 500 }}>{val || "—"}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-1">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {selected.certifications.length ? selected.certifications.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">{c}</span>
                  )) : <span className="text-gray-400 text-xs">None</span>}
                </div>
              </div>
              {selected.suspended && (
                <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600"><strong>Suspend Reason:</strong> {selected.suspendReason}</p>
                </div>
              )}
            </div>
          )}

          {profileTab === "attendance" && (
            <div>
              {/* Check-in simulator */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: 500 }}>Mark Attendance</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {ATTENDANCE_METHODS.map(method => (
                    <button key={method} onClick={() => setAttMethod(method)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs transition-all ${attMethod === method ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-gray-300"}`}>
                      <span className="text-lg">{method === "Face Recognition" ? "🤳" : method === "QR Code" ? "📱" : method === "Manual" ? "✋" : "👆"}</span>
                      {method}
                    </button>
                  ))}
                </div>
                <button onClick={simulateAttendance} disabled={attSimState === "scanning"}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${attSimState === "scanning" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : attSimState === "done" ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                  {attSimState === "idle" ? `Check In via ${attMethod}` : attSimState === "scanning" ? "⏳ Processing…" : "✅ Checked In!"}
                </button>
              </div>
              {/* Log */}
              <p className="text-sm text-gray-600 mb-2" style={{ fontWeight: 500 }}>Attendance Log</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selected.attendanceLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{METHOD_ICONS[log.method]}</span>
                      <span className="text-gray-700">{log.date}</span>
                      <span className="text-gray-400 text-xs">{log.method}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs">{log.checkIn} – {log.checkOut}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${ATT_COLORS[log.status]}`}>{log.status}</span>
                    </div>
                  </div>
                ))}
                {selected.attendanceLogs.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No attendance records.</p>}
              </div>
            </div>
          )}

          {profileTab === "payroll" && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-indigo-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-indigo-500">Base Salary</p>
                  <p className="text-lg text-indigo-700" style={{ fontWeight: 700 }}>${selected.salary.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-green-500">Last Month Net</p>
                  <p className="text-lg text-green-700" style={{ fontWeight: 700 }}>${(selected.payrollRecords[0]?.net ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-500">Pending</p>
                  <p className="text-lg text-amber-700" style={{ fontWeight: 700 }}>{selected.payrollRecords.filter(p => p.status === "Pending").length}</p>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selected.payrollRecords.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <div>
                      <p style={{ fontWeight: 500 }}>{p.month}</p>
                      <p className="text-xs text-gray-400">Base ${p.baseSalary} + ${p.bonus} bonus − ${p.deductions} deductions</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontWeight: 600 }}>${p.net.toLocaleString()}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === "Paid" ? "bg-green-100 text-green-700" : p.status === "Processing" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                    </div>
                  </div>
                ))}
                {selected.payrollRecords.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No payroll records.</p>}
              </div>
            </div>
          )}

          {profileTab === "duty" && (
            <div>
              {selected.dutyAssignment ? (
                <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                  <p className="text-sm mb-3" style={{ fontWeight: 600 }}>Current Duty Assignment</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[["Group", selected.dutyAssignment.group], ["Classroom", selected.dutyAssignment.classroom],
                      ["Date", selected.dutyAssignment.date], ["Notes", selected.dutyAssignment.notes]].map(([k, v]) => (
                        <div key={k}><p className="text-xs text-gray-400">{k}</p><p style={{ fontWeight: 500 }}>{v || "—"}</p></div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center text-gray-400 text-sm">No duty assigned yet.</div>
              )}
              <div className="flex gap-2 justify-end">
                <Btn onClick={() => { setDutyForm({ group: selected.assignedGroup, classroom: CLASSROOMS[0], date: new Date().toISOString().split("T")[0], notes: "" }); setModal("duty"); }}>
                  <UserCheck size={14} /> Assign Duty
                </Btn>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ── Assign Duty Modal ── */}
      {modal === "duty" && selected && (
        <Modal title={`Assign Duty — ${selected.name}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Group</label>
              <div className="grid grid-cols-4 gap-2">
                {GROUPS.map(g => (
                  <button key={g} onClick={() => setDutyForm(p => ({ ...p, group: g }))}
                    className={`p-2 rounded-lg border text-xs text-center transition-all ${dutyForm.group === g ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-gray-300"}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Classroom</label>
              <div className="grid grid-cols-4 gap-2">
                {CLASSROOMS.map(c => (
                  <button key={c} onClick={() => setDutyForm(p => ({ ...p, classroom: c }))}
                    className={`p-2 rounded-lg border text-xs text-center transition-all ${dutyForm.classroom === c ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 hover:border-gray-300"}`}>{c}</button>
                ))}
              </div>
            </div>
            <Input label="Duty Date" type="date" value={dutyForm.date} onChange={v => setDutyForm(p => ({ ...p, date: v }))} />
            <Textarea label="Notes" value={dutyForm.notes} onChange={v => setDutyForm(p => ({ ...p, notes: v }))} placeholder="Any special instructions…" rows={2} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={assignDuty}><UserCheck size={14} /> Assign</Btn>
          </div>
        </Modal>
      )}

      {/* ── Generate Payroll Modal ── */}
      {modal === "payroll" && selected && (
        <Modal title={`Generate Payroll — ${selected.name}`} onClose={() => setModal(null)}>
          <div className="bg-indigo-50 rounded-xl p-4 mb-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-400">Base Salary</p><p style={{ fontWeight: 600 }}>${selected.salary.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-400">Deductions</p><p style={{ fontWeight: 600 }}>$150</p></div>
              <div><p className="text-xs text-gray-400">Bonus</p><p style={{ fontWeight: 600 }}>$0</p></div>
              <div><p className="text-xs text-gray-400">Net Pay</p><p style={{ fontWeight: 700 }} className="text-indigo-700">${(selected.salary - 150).toLocaleString()}</p></div>
            </div>
          </div>
          <Select label="Payroll Month" value={payrollMonth} onChange={setPayrollMonth}
            options={["June 2025", "July 2025", "August 2025"]} />
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={generatePayroll}><DollarSign size={14} /> Generate</Btn>
          </div>
        </Modal>
      )}

      {/* ── Send Alert Modal ── */}
      {modal === "alert" && selected && (
        <Modal title={`Send Alert — ${selected.name}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {["Certification renewal due", "Schedule change", "Meeting reminder", "Policy update", "Emergency contact needed"].map(t => (
                <button key={t} onClick={() => setAlertMsg(t)}
                  className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">{t}</button>
              ))}
            </div>
            <Textarea label="Alert Message" value={alertMsg} onChange={setAlertMsg} rows={3} placeholder="Enter alert message…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={sendAlert} disabled={!alertMsg.trim()}><Bell size={14} /> Send Alert</Btn>
          </div>
        </Modal>
      )}

      {/* ── Suspend Modal ── */}
      {modal === "suspend" && selected && (
        <Modal title={`Suspend Staff — ${selected.name}`} onClose={() => setModal(null)}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
            Suspending a staff member will mark them as inactive and restrict their access.
          </div>
          <Textarea label="Suspension Reason" value={suspendReason} onChange={setSuspendReason} rows={3} placeholder="Describe the reason for suspension…" />
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={doSuspend} disabled={!suspendReason.trim()}><UserX size={14} /> Suspend</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSocket } from "../../../../../context/SocketContext";
import api from "../../../../../services/api";
import {
  Plus, Search, Eye, Pencil, Trash2, CheckCircle, XCircle,
  Clock, Download, Filter, ChevronDown, RefreshCw, CalendarCheck,
  UserCheck, UserPlus, Info, Ban, Users, Send, Printer,
  BookOpen, Heart, Baby, Phone, MapPin, Briefcase
} from "lucide-react";
import { Card, StatusBadge, Modal, Btn, Avatar, PageHeader } from "./ui";
import { mockAdmissions as initial } from "./mockData";
import type { Admission } from "./types";

// ── Extended admission type ───────────────────────────────────────────────
interface AdmissionExt extends Omit<Admission, "status"> {
  status: AdmissionStatus;
  admissionId: string;
  // Parent extra
  parentPhone: string;
  parentOccupation: string;
  parentAddress: string;
  parentRelationship: string;
  parentEmail: string;
  // Child extra
  childAge: number;
  childMedicalHistory: string;
  childAllergies: string;
  childSpecialNeeds: boolean;
  childVaccination: "Up to date" | "Partial" | "Not vaccinated";
  // Package
  package: PackageOption;
  packageStart: string;
  packageEnd: string;
  // Assignment
  assignedClassroom: string;
  assignedNanny: string;
  // Visit
  visitDate: string;
  visitTime: string;
  visitScheduled: boolean;
  // Trial
  isTrial: boolean;
  // Extra
  moreInfoRequested: boolean;
  moreInfoNote: string;
  suspendReason: string;
}

type PackageOption = "1 Day" | "1 Week" | "15 Days" | "1 Month" | "6 Months" | "1 Year" | "Trial";
type AdmissionStatus = "Pending" | "Approved" | "Rejected" | "Waitlisted" | "Suspended" | "Info Requested";

const PACKAGES: PackageOption[] = ["1 Day", "1 Week", "15 Days", "1 Month", "6 Months", "1 Year", "Trial"];
const CLASSROOMS = ["Sunflower Room", "Butterfly Room", "Rainbow Room", "Star Room", "Nursery A", "Nursery B"];
const NANNIES = ["Amanda White", "Jennifer Clark", "Marcus Thompson", "Tom Robinson"];

const PACKAGE_PRICES: Record<PackageOption, string> = {
  "1 Day": "$45", "1 Week": "$200", "15 Days": "$380", "1 Month": "$750",
  "6 Months": "$4,200", "1 Year": "$7,800", "Trial": "Free",
};

function calcEnd(start: string, pkg: PackageOption): string {
  if (!start) return "";
  const d = new Date(start);
  const map: Record<PackageOption, number> = {
    "1 Day": 1, "1 Week": 7, "15 Days": 15, "1 Month": 30,
    "6 Months": 180, "1 Year": 365, "Trial": 3,
  };
  d.setDate(d.getDate() + (map[pkg] || 0));
  return d.toISOString().split("T")[0];
}

// ── Seed from mock ────────────────────────────────────────────────────────
function enrich(a: Admission, i: number): AdmissionExt {
  const pkgs: PackageOption[] = ["1 Month", "6 Months", "1 Year", "Trial", "15 Days"];
  const pkg = pkgs[i % pkgs.length];
  return {
    ...a,
    admissionId: `ADM-${2024 + i}`,
    parentPhone: a.parentPhone || `+1 555-03${10 + i}`,
    parentOccupation: ["Teacher", "Engineer", "Doctor", "Nurse", "Designer"][i % 5],
    parentAddress: `${100 + i * 10} Main St, Springfield`,
    parentRelationship: "Parent",
    parentEmail: a.parentEmail,
    childAge: [1, 2, 3, 4, 2][i % 5],
    childMedicalHistory: i % 3 === 0 ? "Mild asthma history" : "None",
    childAllergies: ["None", "Peanuts", "Dairy", "None", "Gluten"][i % 5],
    childSpecialNeeds: i % 4 === 0,
    childVaccination: (["Up to date", "Partial", "Up to date", "Up to date", "Not vaccinated"][i % 5]) as AdmissionExt["childVaccination"],
    package: pkg,
    packageStart: a.requestDate,
    packageEnd: calcEnd(a.requestDate, pkg),
    assignedClassroom: a.status === "Approved" ? CLASSROOMS[i % CLASSROOMS.length] : "",
    assignedNanny: a.status === "Approved" ? NANNIES[i % NANNIES.length] : "",
    visitDate: i % 2 === 0 ? "2026-06-10" : "",
    visitTime: i % 2 === 0 ? "10:00 AM" : "",
    visitScheduled: i % 2 === 0,
    isTrial: pkg === "Trial",
    moreInfoRequested: false,
    moreInfoNote: "",
    suspendReason: "",
  };
}

const INITIAL: AdmissionExt[] = initial.map(enrich);

const EMPTY: Omit<AdmissionExt, "id" | "admissionId"> = {
  childName: "", parentName: "", parentEmail: "", parentPhone: "",
  parentOccupation: "", parentAddress: "", parentRelationship: "Parent",
  dob: "", requestDate: "2026-06-04", status: "Pending", notes: "",
  childAge: 2, childMedicalHistory: "", childAllergies: "None",
  childSpecialNeeds: false, childVaccination: "Up to date",
  package: "1 Month", packageStart: "2026-06-04", packageEnd: "2026-07-04",
  assignedClassroom: "", assignedNanny: "",
  visitDate: "", visitTime: "", visitScheduled: false,
  isTrial: false, moreInfoRequested: false, moreInfoNote: "", suspendReason: "",
};

type ModalType = "add" | "edit" | "view" | "visit" | "assign" | "moreinfo" | "suspend" | "trial" | null;
type DetailTab = "parent" | "child" | "package" | "visit";

// ═════════════════════════════════════════════════════════════════════════
export function Applications() {
  const [admissions, setAdmissions] = useState<AdmissionExt[]>([]);
  const { socket } = useSocket() || {};

  useEffect(() => {
    fetchAdmissions();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewApplication = (app: any) => {
      const newApp = {
        ...EMPTY,
        id: app.id.toString(),
        admissionId: `ADM-${app.id}`,
        childName: app.child_name,
        parentName: app.parent_name,
        package: app.package_type || 'Full-Time',
        status: 'Pending' as any,
        requestDate: new Date().toISOString().split('T')[0]
      };
      setAdmissions(prev => [newApp, ...prev]);
      alert(`New admission application received for ${app.child_name}!`);
    };

    socket.on('new_application', handleNewApplication);
    return () => {
      socket.off('new_application', handleNewApplication);
    };
  }, [socket]);

  const fetchAdmissions = async () => {
    try {
      const res = await api.get('/daycare/portal/applications');
      const mapped = res.data.map((p: any, i: number) => ({
        ...EMPTY,
        id: p.id ? p.id.toString() : `ADM-${i}`,
        admissionId: `ADM-${p.id || 2024 + i}`,
        childName: p.child_name || "Unknown Child",
        childAge: p.child_age || 0,
        parentName: p.parent_name || "Unknown Parent",
        parentPhone: p.parent_phone || "+1 555-0000",
        parentEmail: p.parent_email || "",
        status: (p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : "Pending") as any,
        package: p.package_type || "1 Month",
        requestDate: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : "2026-06-04",
      }));
      setAdmissions(mapped);
    } catch (error) {
      console.error(error);
    }
  };

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ status: "All", package: "All", trial: "All", classroom: "All" });
  const [selected, setSelected] = useState<AdmissionExt | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("parent");
  const [modal, setModal] = useState<ModalType>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visitForm, setVisitForm] = useState({ date: "", time: "", note: "" });
  const [assignForm, setAssignForm] = useState({ classroom: "", nanny: "" });
  const [moreInfoNote, setMoreInfoNote] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [trialForm, setTrialForm] = useState({ parentName: "", parentPhone: "", childName: "", childAge: "", visitDate: "", note: "" });

  // ── Filtering ─────────────────────────────────────────────────────────
  const filtered = admissions.filter(a => {
    const m = a.childName.toLowerCase().includes(search.toLowerCase()) ||
      a.parentName.toLowerCase().includes(search.toLowerCase()) ||
      a.admissionId.toLowerCase().includes(search.toLowerCase());
    const s = filters.status === "All" || a.status === filters.status;
    const p = filters.package === "All" || a.package === filters.package;
    const t = filters.trial === "All" || (filters.trial === "Trial" ? a.isTrial : !a.isTrial);
    const c = filters.classroom === "All" || a.assignedClassroom === filters.classroom;
    return m && s && p && t && c;
  });

  // ── Counts ─────────────────────────────────────────────────────────────
  const counts = {
    Pending: admissions.filter(a => a.status === "Pending").length,
    Approved: admissions.filter(a => a.status === "Approved").length,
    Waitlisted: admissions.filter(a => a.status === "Waitlisted").length,
    Rejected: admissions.filter(a => a.status === "Rejected").length,
    Suspended: admissions.filter(a => a.status === "Suspended").length,
    "Info Requested": admissions.filter(a => a.status === "Info Requested").length,
  };

  // ── Mutations ─────────────────────────────────────────────────────────
  function setStatus(id: string, status: AdmissionStatus) {
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function bulkApprove() {
    setAdmissions(prev => prev.map(a =>
      selectedIds.has(a.id) && a.status === "Pending" ? { ...a, status: "Approved" } : a
    ));
    setSelectedIds(new Set());
  }

  async function save() {
    try {
      if (modal === "add") {
        await api.post('/daycare/portal/applications', {
          childName: form.childName,
          childAge: form.childAge,
          parentName: form.parentName,
          parentEmail: form.parentEmail,
          parentPhone: form.parentPhone,
          status: form.status,
          package: form.package,
        });
      } else if (modal === "edit" && selected) {
        await api.put(`/daycare/portal/applications/${selected.id}`, { status: form.status });
      }
      await fetchAdmissions();
      setModal(null);
    } catch (err) {
      console.error("Error saving admission:", err);
      alert("Error saving admission");
    }
  }

  function confirmVisit() {
    if (!selected) return;
    setAdmissions(prev => prev.map(a => a.id === selected.id
      ? { ...a, visitDate: visitForm.date, visitTime: visitForm.time, visitScheduled: true }
      : a
    ));
    setModal(null);
  }

  function confirmAssign() {
    if (!selected) return;
    setAdmissions(prev => prev.map(a => a.id === selected.id
      ? { ...a, assignedClassroom: assignForm.classroom, assignedNanny: assignForm.nanny, status: "Approved" }
      : a
    ));
    setModal(null);
  }

  function confirmMoreInfo() {
    if (!selected) return;
    setAdmissions(prev => prev.map(a => a.id === selected.id
      ? { ...a, status: "Info Requested", moreInfoRequested: true, moreInfoNote }
      : a
    ));
    setModal(null);
  }

  function confirmSuspend() {
    if (!selected) return;
    setAdmissions(prev => prev.map(a => a.id === selected.id
      ? { ...a, status: "Suspended", suspendReason }
      : a
    ));
    setModal(null);
  }

  function bookTrial() {
    const id = `ADM-TRIAL-${Date.now()}`;
    setAdmissions(prev => [{
      ...EMPTY, id: `a${Date.now()}`, admissionId: id,
      parentName: trialForm.parentName, parentPhone: trialForm.parentPhone,
      childName: trialForm.childName, childAge: Number(trialForm.childAge),
      package: "Trial", isTrial: true, status: "Pending",
      visitDate: trialForm.visitDate, visitScheduled: !!trialForm.visitDate,
      notes: trialForm.note, requestDate: "2026-06-04",
    }, ...prev]);
    setTrialForm({ parentName: "", parentPhone: "", childName: "", childAge: "", visitDate: "", note: "" });
    setModal(null);
  }

  function removeAdmission(id: string) {
    if (confirm("Remove this admission record?")) setAdmissions(prev => prev.filter(a => a.id !== id));
  }

  const ff = (k: keyof typeof form, v: string | boolean | number) => setForm(p => ({ ...p, [k]: v }));
  const filt = (k: keyof typeof filters, v: string) => setFilters(p => ({ ...p, [k]: v }));

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(a => a.id)));
  }

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Waitlisted: "bg-orange-100 text-orange-700",
    Suspended: "bg-gray-200 text-gray-600",
    "Info Requested": "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <PageHeader
        title="Admission Management"
        subtitle="Manage incoming enrollment applications and packages"
      />

      {/* ── Summary Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {Object.entries(counts).map(([status, count]) => (
          <Card key={status} className="p-3 text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => filt("status", filters.status === status ? "All" : status)}>
            <p className="text-xl" style={{ fontWeight: 700 }}>{count}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${statusColor[status] ?? "bg-gray-100 text-gray-600"}`}>{status}</span>
          </Card>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e: any) => setSearch(e.target.value)}
            placeholder="Search by name, ID or parent…"
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white w-60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
        </div>
        <Btn onClick={() => { setForm(EMPTY); setModal("add"); }}><Plus size={15} /> New Admission</Btn>
        <Btn variant="secondary" onClick={() => setModal("trial")}><Baby size={15} /> Trial / Visit</Btn>
        <Btn variant="secondary" onClick={() => setShowFilter(!showFilter)}>
          <Filter size={15} /> Filter <ChevronDown size={13} className={showFilter ? "rotate-180" : ""} />
        </Btn>
        {selectedIds.size > 0 && (
          <Btn variant="success" onClick={bulkApprove}>
            <CheckCircle size={15} /> Bulk Approve ({selectedIds.size})
          </Btn>
        )}
        <Btn variant="secondary"><Download size={15} /> Export</Btn>
      </div>

      {/* ── Filter Panel ────────────────────────────────────────────────── */}
      {showFilter && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-gray-700">Filter Admissions</h4>
            <button onClick={() => setFilters({ status: "All", package: "All", trial: "All", classroom: "All" })}
              className="text-xs text-fuchsia-600 hover:underline flex items-center gap-1"><RefreshCw size={12} /> Reset</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { key: "status", label: "Status", opts: ["All", "Pending", "Approved", "Rejected", "Waitlisted", "Suspended", "Info Requested"] },
              { key: "package", label: "Package", opts: ["All", ...PACKAGES] },
              { key: "trial", label: "Type", opts: ["All", "Trial", "Regular"] },
              { key: "classroom", label: "Classroom", opts: ["All", ...CLASSROOMS] },
            ] as const).map(f => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{f.label}</label>
                <select value={(filters as any)[f.key]} onChange={(e: any) => filt(f.key as any, e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Package Quick Filter Chips ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PACKAGES.map(p => (
          <button key={p}
            onClick={() => filt("package", filters.package === p ? "All" : p)}
            className={`px-3 py-1 rounded-full text-xs border transition-all ${
              filters.package === p ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white text-gray-600 border-gray-200 hover:border-fuchsia-300"
            }`}>
            {p} · <span className="opacity-70">{PACKAGE_PRICES[p]}</span>
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll} className="rounded" />
                </th>
                {["Admission ID", "Child", "Parent", "Package", "Admission Date", "Classroom", "Status", "Visit", "Actions"]
                  .map(h => <th key={h} className="text-left px-4 py-3 text-gray-600 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedIds.has(a.id) ? "bg-fuchsia-50" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(a.id)} onChange={() => toggleSelect(a.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{a.admissionId}</span>
                      {a.isTrial && <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded">Trial</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={a.childName} size="sm" />
                      <div>
                        <p style={{ fontWeight: 500 }}>{a.childName}</p>
                        <p className="text-xs text-gray-400">{a.childAge} yrs · {a.dob}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p style={{ fontWeight: 500 }}>{a.parentName}</p>
                    <p className="text-xs text-gray-400">{a.parentPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-fuchsia-50 text-fuchsia-700 text-xs px-2 py-0.5 rounded-full">{a.package}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{PACKAGE_PRICES[a.package]}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.requestDate}</td>
                  <td className="px-4 py-3">
                    {a.assignedClassroom
                      ? <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">{a.assignedClassroom}</span>
                      : <span className="text-xs text-gray-400">Unassigned</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[a.status] ?? "bg-gray-100"}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {a.visitScheduled
                      ? <div className="text-xs text-green-600"><CheckCircle size={12} className="inline mr-1" />{a.visitDate}</div>
                      : <span className="text-xs text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <button title="View Details" onClick={() => { setSelected(a); setDetailTab("parent"); setModal("view"); }} className="p-1.5 rounded hover:bg-fuchsia-50 text-fuchsia-500"><Eye size={14} /></button>
                      <button title="Edit" onClick={() => { setSelected(a); setForm({ ...a }); setModal("edit"); }} className="p-1.5 rounded hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                      {a.status === "Pending" && <>
                        <button title="Approve" onClick={() => setStatus(a.id, "Approved")} className="p-1.5 rounded hover:bg-green-50 text-green-600"><CheckCircle size={14} /></button>
                        <button title="Reject" onClick={() => setStatus(a.id, "Rejected")} className="p-1.5 rounded hover:bg-red-50 text-red-500"><XCircle size={14} /></button>
                        <button title="Waitlist" onClick={() => setStatus(a.id, "Waitlisted")} className="p-1.5 rounded hover:bg-orange-50 text-orange-500"><Clock size={14} /></button>
                      </>}
                      <button title="Schedule Visit" onClick={() => { setSelected(a); setVisitForm({ date: a.visitDate, time: a.visitTime, note: "" }); setModal("visit"); }} className="p-1.5 rounded hover:bg-purple-50 text-purple-500"><CalendarCheck size={14} /></button>
                      <button title="Assign" onClick={() => { setSelected(a); setAssignForm({ classroom: a.assignedClassroom, nanny: a.assignedNanny }); setModal("assign"); }} className="p-1.5 rounded hover:bg-teal-50 text-teal-600"><UserCheck size={14} /></button>
                      <button title="Request Info" onClick={() => { setSelected(a); setMoreInfoNote(a.moreInfoNote); setModal("moreinfo"); }} className="p-1.5 rounded hover:bg-blue-50 text-blue-500"><Info size={14} /></button>
                      <button title="Suspend" onClick={() => { setSelected(a); setSuspendReason(a.suspendReason); setModal("suspend"); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Ban size={14} /></button>
                      <button title="Delete" onClick={() => removeAdmission(a.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="text-center py-12 text-gray-400">
                  <UserPlus size={28} className="mx-auto mb-2 opacity-30" />No admissions found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Showing {filtered.length} of {admissions.length} admissions</span>
          {selectedIds.size > 0 && <span className="text-fuchsia-600">{selectedIds.size} selected</span>}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: View Admission Details
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "view"} onClose={() => setModal(null)}
        title="" width="max-w-2xl">
        {selected && (
          <div>
            {/* Header */}
            <div className="flex items-start gap-4 pb-4 mb-4 border-b border-gray-100">
              <Avatar name={selected.childName} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-gray-900">{selected.childName}</h2>
                  <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{selected.admissionId}</span>
                  {selected.isTrial && <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">Trial</span>}
                </div>
                <p className="text-sm text-gray-500">Parent: {selected.parentName} · {selected.package} Package</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[selected.status] ?? "bg-gray-100"}`}>{selected.status}</span>
                  {selected.visitScheduled && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Visit: {selected.visitDate}</span>}
                </div>
              </div>
              {/* Action strip */}
              <div className="flex flex-col gap-1 shrink-0">
                {selected.status === "Pending" && <>
                  <Btn variant="success" size="sm" onClick={() => { setStatus(selected.id, "Approved"); setModal(null); }}><CheckCircle size={13} /> Approve</Btn>
                  <Btn variant="danger" size="sm" onClick={() => { setStatus(selected.id, "Rejected"); setModal(null); }}><XCircle size={13} /> Reject</Btn>
                </>}
                <Btn variant="secondary" size="sm" onClick={() => { setAssignForm({ classroom: selected.assignedClassroom, nanny: selected.assignedNanny }); setModal("assign"); }}><UserCheck size={13} /> Assign</Btn>
                <Btn variant="secondary" size="sm" onClick={() => { setVisitForm({ date: selected.visitDate, time: selected.visitTime, note: "" }); setModal("visit"); }}><CalendarCheck size={13} /> Visit</Btn>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0.5 border-b border-gray-200 mb-5">
              {(["parent", "child", "package", "visit"] as DetailTab[]).map(t => (
                <button key={t} onClick={() => setDetailTab(t)}
                  className={`px-4 py-2 text-sm capitalize transition-colors ${detailTab === t ? "text-fuchsia-600 border-b-2 border-fuchsia-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {t === "parent" ? "Parent Info" : t === "child" ? "Child Info" : t === "package" ? "Package" : "Visit"}
                </button>
              ))}
            </div>

            {detailTab === "parent" && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Full Name", selected.parentName], ["Email", selected.parentEmail],
                  ["Phone", selected.parentPhone], ["Occupation", selected.parentOccupation],
                  ["Address", selected.parentAddress], ["Relationship", selected.parentRelationship],
                  ["Emergency Contact", selected.parentName], ["Request Date", selected.requestDate],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p style={{ fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            {detailTab === "child" && (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Child Name", selected.childName], ["Age", `${selected.childAge} years`],
                    ["Date of Birth", selected.dob], ["Allergies", selected.childAllergies],
                    ["Special Needs", selected.childSpecialNeeds ? "Yes" : "No"],
                    ["Vaccination", selected.childVaccination],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">{k}</p>
                      <p style={{ fontWeight: 500 }}>{String(v)}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Medical History</p>
                  <p style={{ fontWeight: 500 }}>{selected.childMedicalHistory || "None"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Notes</p>
                  <p style={{ fontWeight: 500 }}>{selected.notes || "—"}</p>
                </div>
                {selected.moreInfoRequested && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-600" style={{ fontWeight: 600 }}>More Info Requested</p>
                    <p className="text-xs text-blue-700 mt-1">{selected.moreInfoNote}</p>
                  </div>
                )}
              </div>
            )}

            {detailTab === "package" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {PACKAGES.map(p => (
                    <div key={p} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${selected.package === p ? "border-fuchsia-500 bg-fuchsia-50" : "border-gray-200 bg-gray-50"}`}>
                      <p className="text-sm" style={{ fontWeight: 700 }}>{p}</p>
                      <p className="text-lg text-fuchsia-600 mt-1" style={{ fontWeight: 700 }}>{PACKAGE_PRICES[p]}</p>
                      {p === "Trial" && <p className="text-xs text-gray-400 mt-0.5">3 days</p>}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Selected Package</p><p style={{ fontWeight: 600 }}>{selected.package}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Price</p><p style={{ fontWeight: 600 }}>{PACKAGE_PRICES[selected.package]}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Start Date</p><p style={{ fontWeight: 500 }}>{selected.packageStart}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">End Date</p><p style={{ fontWeight: 500 }}>{selected.packageEnd || "—"}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Assigned Classroom</p><p style={{ fontWeight: 500 }}>{selected.assignedClassroom || "Not assigned"}</p></div>
                  <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Assigned Nanny</p><p style={{ fontWeight: 500 }}>{selected.assignedNanny || "Not assigned"}</p></div>
                </div>
              </div>
            )}

            {detailTab === "visit" && (
              <div className="space-y-4">
                {selected.visitScheduled ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm text-green-800" style={{ fontWeight: 600 }}>Visit Scheduled</p>
                      <p className="text-sm text-green-700">{selected.visitDate} at {selected.visitTime}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400">
                    <CalendarCheck size={24} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No visit scheduled yet</p>
                    <Btn size="sm" className="mt-3" onClick={() => { setVisitForm({ date: "", time: "", note: "" }); setModal("visit"); }}>
                      <CalendarCheck size={13} /> Schedule Visit
                    </Btn>
                  </div>
                )}
                {selected.suspendReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-xs text-red-600" style={{ fontWeight: 600 }}>Suspension Reason</p>
                    <p className="text-sm text-red-700 mt-1">{selected.suspendReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Add / Edit Admission
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)}
        title={modal === "add" ? "New Admission Application" : `Edit — ${selected?.childName}`} width="max-w-2xl">
        <div className="space-y-5">
          {/* Parent */}
          <section>
            <h4 className="text-gray-700 mb-3 pb-1 border-b border-gray-100 flex items-center gap-2"><Users size={15} /> Parent Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <F label="Parent Full Name"><input value={form.parentName} onChange={(e: any) => ff("parentName", e.target.value)} className={INP} /></F>
              <F label="Parent Email"><input type="email" value={form.parentEmail} onChange={(e: any) => ff("parentEmail", e.target.value)} className={INP} /></F>
              <F label="Phone"><input value={form.parentPhone} onChange={(e: any) => ff("parentPhone", e.target.value)} className={INP} /></F>
              <F label="Occupation"><input value={form.parentOccupation} onChange={(e: any) => ff("parentOccupation", e.target.value)} className={INP} /></F>
              <div className="col-span-2"><F label="Address"><input value={form.parentAddress} onChange={(e: any) => ff("parentAddress", e.target.value)} className={INP} /></F></div>
              <F label="Relationship"><select value={form.parentRelationship} onChange={(e: any) => ff("parentRelationship", e.target.value)} className={SEL}>
                {["Parent", "Guardian", "Grandparent", "Relative"].map(r => <option key={r}>{r}</option>)}
              </select></F>
            </div>
          </section>
          {/* Child */}
          <section>
            <h4 className="text-gray-700 mb-3 pb-1 border-b border-gray-100 flex items-center gap-2"><Baby size={15} /> Child Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <F label="Child Name"><input value={form.childName} onChange={(e: any) => ff("childName", e.target.value)} className={INP} /></F>
              <F label="Date of Birth"><input type="date" value={form.dob} onChange={(e: any) => ff("dob", e.target.value)} className={INP} /></F>
              <F label="Age"><input type="number" value={form.childAge} onChange={(e: any) => ff("childAge", Number(e.target.value))} className={INP} min={0} max={10} /></F>
              <F label="Allergies"><input value={form.childAllergies} onChange={(e: any) => ff("childAllergies", e.target.value)} placeholder="None / Peanuts…" className={INP} /></F>
              <F label="Vaccination"><select value={form.childVaccination} onChange={(e: any) => ff("childVaccination", e.target.value)} className={SEL}>
                <option>Up to date</option><option>Partial</option><option>Not vaccinated</option>
              </select></F>
              <F label="Special Needs"><div className="flex items-center gap-2 h-10"><input type="checkbox" checked={form.childSpecialNeeds} onChange={(e: any) => ff("childSpecialNeeds", e.target.checked)} className="w-4 h-4" /><span className="text-sm text-gray-600">Has special needs</span></div></F>
              <div className="col-span-2"><F label="Medical History"><textarea rows={2} value={form.childMedicalHistory} onChange={(e: any) => ff("childMedicalHistory", e.target.value)} className={`${INP} resize-none`} /></F></div>
            </div>
          </section>
          {/* Package */}
          <section>
            <h4 className="text-gray-700 mb-3 pb-1 border-b border-gray-100 flex items-center gap-2"><BookOpen size={15} /> Package Information</h4>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {PACKAGES.map(p => (
                <div key={p} onClick={() => { ff("package", p); ff("packageEnd", calcEnd(form.packageStart, p)); ff("isTrial", p === "Trial"); }}
                  className={`border-2 rounded-xl p-3 text-center cursor-pointer transition-all ${form.package === p ? "border-fuchsia-500 bg-fuchsia-50" : "border-gray-200 hover:border-fuchsia-300"}`}>
                  <p className="text-sm" style={{ fontWeight: 600 }}>{p}</p>
                  <p className="text-xs text-fuchsia-600">{PACKAGE_PRICES[p]}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Start Date"><input type="date" value={form.packageStart} onChange={(e: any) => { ff("packageStart", e.target.value); ff("packageEnd", calcEnd(e.target.value, form.package)); }} className={INP} /></F>
              <F label="End Date (auto)"><input value={form.packageEnd} readOnly className={`${INP} bg-gray-100 cursor-not-allowed`} /></F>
              <F label="Status"><select value={form.status} onChange={(e: any) => ff("status", e.target.value)} className={SEL}>
                {["Pending", "Approved", "Waitlisted", "Rejected", "Suspended", "Info Requested"].map(s => <option key={s}>{s}</option>)}
              </select></F>
              <F label="Request Date"><input type="date" value={form.requestDate} onChange={(e: any) => ff("requestDate", e.target.value)} className={INP} /></F>
              <div className="col-span-2"><F label="Notes"><textarea rows={2} value={form.notes} onChange={(e: any) => ff("notes", e.target.value)} className={`${INP} resize-none`} /></F></div>
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn onClick={save}>{modal === "add" ? "Submit Application" : "Save Changes"}</Btn>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Schedule Visit
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "visit"} onClose={() => setModal(null)} title={`Schedule Visit — ${selected?.childName}`}>
        <div className="space-y-3">
          <div className="bg-fuchsia-50 rounded-xl p-3 text-sm text-fuchsia-700">
            Scheduling a daycare visit for <strong>{selected?.parentName}</strong> to tour the facility with their child.
          </div>
          <F label="Visit Date"><input type="date" value={visitForm.date} onChange={(e: any) => setVisitForm(p => ({ ...p, date: e.target.value }))} className={INP} /></F>
          <F label="Visit Time"><input value={visitForm.time} onChange={(e: any) => setVisitForm(p => ({ ...p, time: e.target.value }))} placeholder="e.g. 10:00 AM" className={INP} /></F>
          <F label="Note for Parent"><textarea rows={3} value={visitForm.note} onChange={(e: any) => setVisitForm(p => ({ ...p, note: e.target.value }))} placeholder="Any instructions or details…" className={`${INP} resize-none`} /></F>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn onClick={confirmVisit}><CalendarCheck size={14} /> Schedule Visit</Btn>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Assign Classroom & Nanny
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "assign"} onClose={() => setModal(null)} title={`Assign — ${selected?.childName}`}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Select Classroom</p>
            <div className="grid grid-cols-2 gap-2">
              {CLASSROOMS.map(c => (
                <div key={c} onClick={() => setAssignForm(p => ({ ...p, classroom: c }))}
                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all text-sm ${assignForm.classroom === c ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700" : "border-gray-200 hover:border-fuchsia-300"}`} style={{ fontWeight: assignForm.classroom === c ? 600 : 400 }}>
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Assign Nanny / Teacher</p>
            <div className="grid grid-cols-2 gap-2">
              {NANNIES.map(n => (
                <div key={n} onClick={() => setAssignForm(p => ({ ...p, nanny: n }))}
                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all text-sm flex items-center gap-2 ${assignForm.nanny === n ? "border-fuchsia-500 bg-fuchsia-50" : "border-gray-200 hover:border-fuchsia-300"}`}>
                  <Avatar name={n} size="sm" />
                  <span style={{ fontWeight: assignForm.nanny === n ? 600 : 400 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn onClick={confirmAssign}><UserCheck size={14} /> Assign & Approve</Btn>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Request More Information
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "moreinfo"} onClose={() => setModal(null)} title={`Request Info — ${selected?.childName}`}>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Specify what additional information is needed from the parent:</p>
          <textarea rows={5} value={moreInfoNote} onChange={(e: any) => setMoreInfoNote(e.target.value)}
            placeholder="e.g. Please provide updated vaccination records and doctor's note for the medical condition…"
            className={`${INP} resize-none w-full`} />
          <div className="flex flex-wrap gap-2">
            {["Vaccination records", "Medical certificate", "Birth certificate", "Previous daycare records", "Doctor's note"].map(t => (
              <button key={t} onClick={() => setMoreInfoNote(p => p ? `${p}, ${t}` : t)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-fuchsia-50 hover:text-fuchsia-600 rounded-full transition-colors">{t}</button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn onClick={confirmMoreInfo}><Send size={14} /> Send Request</Btn>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Suspend Admission
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "suspend"} onClose={() => setModal(null)} title={`Suspend Admission — ${selected?.childName}`}>
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            Suspending this admission will put it on hold. You can reactivate it at any time.
          </div>
          <F label="Reason for Suspension">
            <textarea rows={4} value={suspendReason} onChange={(e: any) => setSuspendReason(e.target.value)}
              placeholder="Explain the reason for suspension…" className={`${INP} resize-none w-full`} />
          </F>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={confirmSuspend}><Ban size={14} /> Suspend Admission</Btn>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Trial Admission / Book Visit
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "trial"} onClose={() => setModal(null)} title="Book Trial Admission / Daycare Visit" width="max-w-lg">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
            <p style={{ fontWeight: 600 }}>Free 3-Day Trial</p>
            <p className="text-xs mt-0.5">Parents can trial the daycare before committing. Also use this form to schedule a facility tour.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Parent Name"><input value={trialForm.parentName} onChange={(e: any) => setTrialForm(p => ({ ...p, parentName: e.target.value }))} className={INP} /></F>
            <F label="Parent Phone"><input value={trialForm.parentPhone} onChange={(e: any) => setTrialForm(p => ({ ...p, parentPhone: e.target.value }))} className={INP} /></F>
            <F label="Child Name"><input value={trialForm.childName} onChange={(e: any) => setTrialForm(p => ({ ...p, childName: e.target.value }))} className={INP} /></F>
            <F label="Child Age"><input type="number" value={trialForm.childAge} onChange={(e: any) => setTrialForm(p => ({ ...p, childAge: e.target.value }))} className={INP} min={0} max={10} /></F>
            <F label="Preferred Visit/Start Date"><input type="date" value={trialForm.visitDate} onChange={(e: any) => setTrialForm(p => ({ ...p, visitDate: e.target.value }))} className={INP} /></F>
          </div>
          <F label="Notes / Special Requests"><textarea rows={3} value={trialForm.note} onChange={(e: any) => setTrialForm(p => ({ ...p, note: e.target.value }))} placeholder="Any special requirements…" className={`${INP} resize-none w-full`} /></F>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn onClick={bookTrial}><Baby size={14} /> Book Trial / Visit</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────
const INP = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-full";
const SEL = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-full";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      {children}
    </div>
  );
}

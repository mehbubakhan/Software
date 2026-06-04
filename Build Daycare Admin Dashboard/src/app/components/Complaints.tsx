import { useState } from "react";
import {
  Plus, Eye, Pencil, Trash2, CheckCircle, AlertTriangle, Shield,
  UserX, Forward, Search as SearchIcon, FileText, Bell, Camera,
  Clock, Flag, MessageSquare, X, ChevronRight, Zap, Lock
} from "lucide-react";
import { Card, Modal, Input, Select, Textarea, Btn, PageHeader, SearchBar, Avatar, StatCard } from "./ui";
import { mockComplaints as initial } from "./mockData";
import type { Complaint } from "./types";

// ── Types ──────────────────────────────────────────────────────
type ComplaintType = "Staff Misconduct" | "Child Safety Concern" | "Transport Complaint" | "Billing Complaint" | "Parent Dispute" | "Facility Issue" | "Other";
type Priority = "Low" | "Medium" | "High" | "Critical";

interface Evidence {
  id: string;
  type: "Photo" | "CCTV Reference" | "Document" | "Statement";
  description: string;
  reference?: string;
  addedDate: string;
}

interface StaffNote {
  id: string;
  author: string;
  note: string;
  date: string;
}

interface ComplaintAction {
  id: string;
  action: string;
  by: string;
  date: string;
}

interface ComplaintExt extends Complaint {
  complaintId: string;
  complaintType: ComplaintType;
  childName?: string;
  staffInvolved?: string;
  evidence: Evidence[];
  staffNotes: StaffNote[];
  actionHistory: ComplaintAction[];
  warnIssued: boolean;
  accessSuspended: boolean;
  forwardedToAdmin: boolean;
  investigationRequested: boolean;
  escalated: boolean;
  reporterPhone?: string;
  cctvRef?: string;
}

// ── Constants ─────────────────────────────────────────────────
const COMPLAINT_TYPES: ComplaintType[] = [
  "Staff Misconduct", "Child Safety Concern", "Transport Complaint",
  "Billing Complaint", "Parent Dispute", "Facility Issue", "Other"
];

const TYPE_COLORS: Record<ComplaintType, string> = {
  "Staff Misconduct": "bg-red-100 text-red-700",
  "Child Safety Concern": "bg-orange-100 text-orange-700",
  "Transport Complaint": "bg-blue-100 text-blue-700",
  "Billing Complaint": "bg-purple-100 text-purple-700",
  "Parent Dispute": "bg-pink-100 text-pink-700",
  "Facility Issue": "bg-teal-100 text-teal-700",
  "Other": "bg-gray-100 text-gray-600",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-500",
};

// ── Seed / Enrich ──────────────────────────────────────────────
const TYPES_SEED: ComplaintType[] = ["Staff Misconduct", "Child Safety Concern", "Transport Complaint", "Billing Complaint"];
const CCTV_REFS = ["CAM-04 @ 10:35 AM", "CAM-01 @ 09:20 AM", "Bus-CAM @ 08:15 AM", undefined];
const CHILDREN_SEED = ["Emma Wilson", "Liam Brown", undefined, undefined];
const STAFF_SEED = ["Ms. Rachel Green", undefined, "Driver Mike", undefined];

function enrichComplaint(c: Complaint, idx: number): ComplaintExt {
  const evidence: Evidence[] = idx < 2 ? [
    { id: `ev-${c.id}-1`, type: "CCTV Reference", description: "Camera footage shows the incident", reference: CCTV_REFS[idx] ?? "CAM-01", addedDate: c.date },
    { id: `ev-${c.id}-2`, type: "Statement", description: "Parent verbal statement on file", addedDate: c.date },
  ] : [];
  const staffNotes: StaffNote[] = [
    { id: `sn-${c.id}-1`, author: "Admin Patricia", note: "Received complaint. Initial review started.", date: c.date },
  ];
  const actionHistory: ComplaintAction[] = c.status !== "Open" ? [
    { id: `ah-${c.id}-1`, action: "Status changed to In Progress", by: "Admin Patricia", date: c.date },
  ] : [];
  return {
    ...c,
    complaintId: `CMP-${2025001 + idx}`,
    complaintType: TYPES_SEED[idx % TYPES_SEED.length],
    childName: CHILDREN_SEED[idx % CHILDREN_SEED.length] ?? undefined,
    staffInvolved: STAFF_SEED[idx % STAFF_SEED.length] ?? undefined,
    evidence,
    staffNotes,
    actionHistory,
    warnIssued: false,
    accessSuspended: false,
    forwardedToAdmin: idx === 0,
    investigationRequested: false,
    escalated: (c.priority as string) === "High",
    reporterPhone: `+1 (555) ${idx + 1}23-${4000 + idx}`,
    cctvRef: CCTV_REFS[idx % CCTV_REFS.length],
  };
}

// ── Component ─────────────────────────────────────────────────
type ModalType = "add" | "edit" | "view" | "warn" | "suspend" | "forward" | "investigate" | "escalate" | "addEvidence" | null;
type ViewTab = "details" | "evidence" | "notes" | "actions";

const emptyForm = {
  parentName: "", subject: "", description: "", date: "2026-06-04",
  status: "Open" as Complaint["status"], priority: "Medium" as Priority,
  assignedTo: "", complaintType: "Other" as ComplaintType,
  childName: "", staffInvolved: "", reporterPhone: "", cctvRef: "",
};

export function Complaints() {
  const [complaints, setComplaints] = useState<ComplaintExt[]>(() => initial.map(enrichComplaint));
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<ComplaintExt | null>(null);
  const [viewTab, setViewTab] = useState<ViewTab>("details");
  const [form, setForm] = useState(emptyForm);
  const [noteText, setNoteText] = useState("");
  const [evidenceForm, setEvidenceForm] = useState({ type: "Statement" as Evidence["type"], description: "", reference: "" });
  const [warnReason, setWarnReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [forwardNote, setForwardNote] = useState("");
  const [investigateNote, setInvestigateNote] = useState("");

  const filtered = complaints.filter(c => {
    const m = c.parentName.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase()) || c.complaintId.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "All" || c.status === filterStatus;
    const t = filterType === "All" || c.complaintType === filterType;
    const p = filterPriority === "All" || c.priority === filterPriority;
    return m && s && t && p;
  });

  function updateComplaint(id: string, update: Partial<ComplaintExt>) {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...update } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...update } : prev);
  }

  function addAction(id: string, action: string) {
    const entry: ComplaintAction = { id: `ah-${Date.now()}`, action, by: "Admin Patricia", date: new Date().toISOString().split("T")[0] };
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, actionHistory: [...c.actionHistory, entry] } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, actionHistory: [...prev.actionHistory, entry] } : prev);
  }

  function save() {
    if (modal === "add") {
      const newC: ComplaintExt = {
        ...form, id: `comp${Date.now()}`,
        complaintId: `CMP-${Date.now()}`,
        evidence: [], staffNotes: [], actionHistory: [],
        warnIssued: false, accessSuspended: false,
        forwardedToAdmin: false, investigationRequested: false, escalated: false,
      };
      setComplaints(prev => [...prev, newC]);
    } else if (modal === "edit" && selected) {
      updateComplaint(selected.id, { ...form });
    }
    setModal(null);
  }

  function updateStatus(id: string, status: Complaint["status"]) {
    updateComplaint(id, { status });
    addAction(id, `Status changed to ${status}`);
  }

  function addNote() {
    if (!selected || !noteText.trim()) return;
    const note: StaffNote = { id: `sn-${Date.now()}`, author: "Admin Patricia", note: noteText, date: new Date().toISOString().split("T")[0] };
    updateComplaint(selected.id, { staffNotes: [...selected.staffNotes, note] });
    setNoteText("");
  }

  function addEvidence() {
    if (!selected) return;
    const ev: Evidence = { id: `ev-${Date.now()}`, ...evidenceForm, addedDate: new Date().toISOString().split("T")[0] };
    updateComplaint(selected.id, { evidence: [...selected.evidence, ev] });
    setModal("view");
  }

  function issueWarning() {
    if (!selected) return;
    updateComplaint(selected.id, { warnIssued: true });
    addAction(selected.id, `Warning issued: ${warnReason}`);
    setModal("view");
  }

  function suspendAccess() {
    if (!selected) return;
    updateComplaint(selected.id, { accessSuspended: true });
    addAction(selected.id, `Access suspended: ${suspendReason}`);
    setModal("view");
  }

  function forwardToAdmin() {
    if (!selected) return;
    updateComplaint(selected.id, { forwardedToAdmin: true });
    addAction(selected.id, `Forwarded to Admin: ${forwardNote}`);
    setModal("view");
  }

  function requestInvestigation() {
    if (!selected) return;
    updateComplaint(selected.id, { investigationRequested: true });
    addAction(selected.id, `Investigation requested: ${investigateNote}`);
    setModal("view");
  }

  function escalate(id: string) {
    updateComplaint(id, { escalated: true, priority: "Critical" });
    addAction(id, "Emergency escalation triggered");
  }

  function remove(id: string) { if (confirm("Remove complaint?")) setComplaints(prev => prev.filter(c => c.id !== id)); }

  const openCount = complaints.filter(c => c.status === "Open").length;
  const criticalCount = complaints.filter(c => c.priority === "Critical" || c.escalated).length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;
  const pendingCount = complaints.filter(c => c.status === "In Progress").length;

  return (
    <div>
      <PageHeader
        title="Complaints & Reports"
        subtitle="Manage parent complaints, safety concerns, and resolutions"
        action={<Btn onClick={() => { setForm(emptyForm); setModal("add"); }}><Plus size={16} /> New Complaint</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Open" value={openCount} color="blue" icon={<Flag size={20} />} />
        <StatCard label="In Progress" value={pendingCount} color="amber" icon={<Clock size={20} />} />
        <StatCard label="Resolved" value={resolvedCount} color="green" icon={<CheckCircle size={20} />} />
        <StatCard label="Critical / Escalated" value={criticalCount} color="red" icon={<Zap size={20} />} />
      </div>

      {/* Escalation banner */}
      {criticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm text-red-800" style={{ fontWeight: 600 }}>Critical Complaints Require Immediate Attention</p>
            <p className="text-xs text-red-600 mt-0.5">{complaints.filter(c => c.escalated || c.priority === "Critical").map(c => c.subject).join(", ")}</p>
          </div>
        </div>
      )}

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilterType("All")}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${filterType === "All" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200"}`}>
          All Types
        </button>
        {COMPLAINT_TYPES.map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${filterType === t ? "bg-indigo-600 text-white border-indigo-600" : `${TYPE_COLORS[t]} border-transparent hover:opacity-80`}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, subject, ID…" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Status</option>
          {["Open", "In Progress", "Resolved", "Closed"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Priority</option>
          {["Low", "Medium", "High", "Critical"].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Complaints list */}
      <div className="space-y-3">
        {filtered.map(c => (
          <Card key={c.id} className={`p-4 ${c.escalated ? "border-l-4 border-l-red-400" : c.priority === "High" ? "border-l-4 border-l-orange-400" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Avatar name={c.parentName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p style={{ fontWeight: 600 }} className="text-sm">{c.subject}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${TYPE_COLORS[c.complaintType]}`}>{c.complaintType}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${PRIORITY_COLORS[c.priority as Priority]}`}>{c.priority}</span>
                    {c.escalated && <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 animate-pulse">🚨 Escalated</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{c.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="font-mono text-indigo-600">{c.complaintId}</span>
                    <span>From: {c.parentName}</span>
                    {c.childName && <span>Child: {c.childName}</span>}
                    {c.staffInvolved && <span>Staff: {c.staffInvolved}</span>}
                    <span>{c.date}</span>
                    {c.evidence.length > 0 && <span className="text-indigo-500"><Camera size={10} className="inline" /> {c.evidence.length} evidence</span>}
                    {c.cctvRef && <span className="text-purple-500"><Camera size={10} className="inline" /> {c.cctvRef}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {c.warnIssued && <span className="px-1.5 py-0.5 rounded text-xs bg-amber-100 text-amber-700">⚠️ Warned</span>}
                    {c.accessSuspended && <span className="px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700"><Lock size={9} className="inline" /> Access Suspended</span>}
                    {c.forwardedToAdmin && <span className="px-1.5 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">→ Admin</span>}
                    {c.investigationRequested && <span className="px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-700">🔍 Under Investigation</span>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                <div className="flex items-center gap-1">
                  {c.status === "Open" && <Btn variant="secondary" size="sm" onClick={() => updateStatus(c.id, "In Progress")}>Work on it</Btn>}
                  {c.status === "In Progress" && <Btn variant="success" size="sm" onClick={() => updateStatus(c.id, "Resolved")}><CheckCircle size={12} /> Resolve</Btn>}
                  <button onClick={() => { setSelected(c); setViewTab("details"); setModal("view"); }} className="p-1.5 rounded hover:bg-gray-100 text-indigo-500"><Eye size={14} /></button>
                  <button onClick={() => { setSelected(c); setForm({ ...emptyForm, parentName: c.parentName, subject: c.subject, description: c.description, date: c.date, status: c.status, priority: c.priority as Priority, assignedTo: c.assignedTo ?? "", complaintType: c.complaintType, childName: c.childName ?? "", staffInvolved: c.staffInvolved ?? "", reporterPhone: c.reporterPhone ?? "", cctvRef: c.cctvRef ?? "" }); setModal("edit"); }} className="p-1.5 rounded hover:bg-gray-100 text-blue-500"><Pencil size={14} /></button>
                  {!c.escalated && <button onClick={() => escalate(c.id)} title="Emergency Escalation" className="p-1.5 rounded hover:bg-red-50 text-red-500"><Zap size={14} /></button>}
                  <button onClick={() => remove(c.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400"><Flag size={32} className="mx-auto mb-2 opacity-30" /><p>No complaints found</p></div>
        )}
      </div>

      {/* ── View Complaint Modal ── */}
      {modal === "view" && selected && (
        <Modal title={`${selected.complaintId} — ${selected.subject}`} onClose={() => setModal(null)} size="xl">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <Avatar name={selected.parentName} size="md" />
            <div className="flex-1">
              <p style={{ fontWeight: 600 }}>{selected.parentName}</p>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                <span className={`px-2 py-0.5 rounded-full text-xs ${TYPE_COLORS[selected.complaintType]}`}>{selected.complaintType}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${PRIORITY_COLORS[selected.priority as Priority]}`}>{selected.priority}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
              </div>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-100">
            <Btn size="sm" variant="secondary" onClick={() => { setWarnReason(""); setModal("warn"); }} disabled={selected.warnIssued}>
              <AlertTriangle size={12} /> {selected.warnIssued ? "Warned ✓" : "Warn Staff"}
            </Btn>
            <Btn size="sm" variant="secondary" onClick={() => { setSuspendReason(""); setModal("suspend"); }} disabled={selected.accessSuspended}>
              <Lock size={12} /> {selected.accessSuspended ? "Suspended ✓" : "Suspend Access"}
            </Btn>
            <Btn size="sm" variant="secondary" onClick={() => { setForwardNote(""); setModal("forward"); }} disabled={selected.forwardedToAdmin}>
              <Forward size={12} /> {selected.forwardedToAdmin ? "Forwarded ✓" : "Forward to Admin"}
            </Btn>
            <Btn size="sm" variant="secondary" onClick={() => { setInvestigateNote(""); setModal("investigate"); }} disabled={selected.investigationRequested}>
              <SearchIcon size={12} /> {selected.investigationRequested ? "Investigation ✓" : "Request Investigation"}
            </Btn>
            {selected.status === "In Progress" && (
              <Btn size="sm" variant="success" onClick={() => updateStatus(selected.id, "Resolved")}><CheckCircle size={12} /> Resolve</Btn>
            )}
            {!selected.escalated && (
              <Btn size="sm" variant="danger" onClick={() => escalate(selected.id)}><Zap size={12} /> Escalate Emergency</Btn>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-gray-200">
            {([["details", "Details"], ["evidence", `Evidence (${selected.evidence.length})`], ["notes", `Staff Notes (${selected.staffNotes.length})`], ["actions", `Action History (${selected.actionHistory.length})`]] as [ViewTab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setViewTab(t)}
                className={`px-3 py-1.5 text-xs transition-colors ${viewTab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
                {label}
              </button>
            ))}
          </div>

          {viewTab === "details" && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Reporter", selected.parentName], ["Phone", selected.reporterPhone ?? "—"],
                ["Child Involved", selected.childName ?? "None"], ["Staff Involved", selected.staffInvolved ?? "None"],
                ["Date", selected.date], ["Assigned To", selected.assignedTo ?? "Unassigned"],
                ["CCTV Reference", selected.cctvRef ?? "None"],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p style={{ fontWeight: 500 }}>{v}</p>
                </div>
              ))}
              <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700">{selected.description}</p>
              </div>
            </div>
          )}

          {viewTab === "evidence" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Evidence & References</p>
                <Btn size="sm" onClick={() => { setEvidenceForm({ type: "Statement", description: "", reference: "" }); setModal("addEvidence"); }}>
                  <Plus size={13} /> Add Evidence
                </Btn>
              </div>
              <div className="space-y-2">
                {selected.evidence.map(ev => (
                  <div key={ev.id} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <Camera size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{ev.type}</span>
                        {ev.reference && <span className="text-xs text-gray-500">Ref: {ev.reference}</span>}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{ev.description}</p>
                      <p className="text-xs text-gray-400">{ev.addedDate}</p>
                    </div>
                  </div>
                ))}
                {selected.evidence.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No evidence added yet.</p>}
              </div>
            </div>
          )}

          {viewTab === "notes" && (
            <div>
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {selected.staffNotes.map(note => (
                  <div key={note.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-amber-700" style={{ fontWeight: 600 }}>{note.author}</span>
                      <span className="text-xs text-gray-400">{note.date}</span>
                    </div>
                    <p className="text-xs text-gray-600">{note.note}</p>
                  </div>
                ))}
                {selected.staffNotes.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No notes added yet.</p>}
              </div>
              <div className="flex gap-2">
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={2}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add staff note…" />
                <Btn onClick={addNote} disabled={!noteText.trim()}><MessageSquare size={14} /> Add</Btn>
              </div>
            </div>
          )}

          {viewTab === "actions" && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selected.actionHistory.map(action => (
                <div key={action.id} className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg text-xs">
                  <ChevronRight size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-700">{action.action}</p>
                    <p className="text-gray-400">{action.by} · {action.date}</p>
                  </div>
                </div>
              ))}
              {selected.actionHistory.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No actions recorded.</p>}
            </div>
          )}
        </Modal>
      )}

      {/* ── Warn Staff Modal ── */}
      {modal === "warn" && selected && (
        <Modal title={`Issue Warning — ${selected.staffInvolved ?? "Staff Member"}`} onClose={() => setModal("view")}>
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              A formal warning will be logged in this staff member's record.
            </div>
            <textarea value={warnReason} onChange={e => setWarnReason(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Reason for warning…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal("view")}>Cancel</Btn>
            <Btn variant="danger" onClick={issueWarning} disabled={!warnReason.trim()}><AlertTriangle size={14} /> Issue Warning</Btn>
          </div>
        </Modal>
      )}

      {/* ── Suspend Access Modal ── */}
      {modal === "suspend" && selected && (
        <Modal title={`Suspend Access — ${selected.parentName}`} onClose={() => setModal("view")}>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              This will restrict the user's access to the daycare system pending investigation.
            </div>
            <textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Reason for suspension…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal("view")}>Cancel</Btn>
            <Btn variant="danger" onClick={suspendAccess} disabled={!suspendReason.trim()}><Lock size={14} /> Suspend Access</Btn>
          </div>
        </Modal>
      )}

      {/* ── Forward to Admin Modal ── */}
      {modal === "forward" && selected && (
        <Modal title="Forward to Admin" onClose={() => setModal("view")}>
          <div className="space-y-3">
            <div className="bg-indigo-50 rounded-xl p-3 text-sm text-indigo-700">
              Complaint <strong>{selected.complaintId}</strong> will be escalated to the Admin for review.
            </div>
            <textarea value={forwardNote} onChange={e => setForwardNote(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Notes for admin…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal("view")}>Cancel</Btn>
            <Btn onClick={forwardToAdmin} disabled={!forwardNote.trim()}><Forward size={14} /> Forward</Btn>
          </div>
        </Modal>
      )}

      {/* ── Request Investigation Modal ── */}
      {modal === "investigate" && selected && (
        <Modal title="Request Investigation" onClose={() => setModal("view")}>
          <div className="space-y-3">
            <div className="bg-purple-50 rounded-xl p-3 text-sm text-purple-700">
              A formal investigation will be opened for complaint <strong>{selected.complaintId}</strong>.
            </div>
            <textarea value={investigateNote} onChange={e => setInvestigateNote(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Investigation scope and notes…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal("view")}>Cancel</Btn>
            <Btn onClick={requestInvestigation} disabled={!investigateNote.trim()}><SearchIcon size={14} /> Start Investigation</Btn>
          </div>
        </Modal>
      )}

      {/* ── Add Evidence Modal ── */}
      {modal === "addEvidence" && selected && (
        <Modal title="Add Evidence" onClose={() => setModal("view")}>
          <div className="space-y-3">
            <Select label="Evidence Type" value={evidenceForm.type} onChange={v => setEvidenceForm(p => ({ ...p, type: v as Evidence["type"] }))} options={["Photo", "CCTV Reference", "Document", "Statement"]} />
            {evidenceForm.type === "CCTV Reference" && (
              <Input label="CCTV Reference" value={evidenceForm.reference} onChange={v => setEvidenceForm(p => ({ ...p, reference: v }))} placeholder="e.g. CAM-04 @ 10:35 AM" />
            )}
            <textarea value={evidenceForm.description} onChange={e => setEvidenceForm(p => ({ ...p, description: e.target.value }))} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the evidence…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal("view")}>Cancel</Btn>
            <Btn onClick={addEvidence} disabled={!evidenceForm.description.trim()}><Camera size={14} /> Add Evidence</Btn>
          </div>
        </Modal>
      )}

      {/* ── Add / Edit Complaint Modal ── */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "New Complaint" : "Edit Complaint"} onClose={() => setModal(null)} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Reporter (Parent Name)" value={form.parentName} onChange={v => setForm(p => ({ ...p, parentName: v }))} />
            <Input label="Phone" value={form.reporterPhone} onChange={v => setForm(p => ({ ...p, reporterPhone: v }))} />
            <Select label="Complaint Type" value={form.complaintType} onChange={v => setForm(p => ({ ...p, complaintType: v as ComplaintType }))} options={[...COMPLAINT_TYPES]} />
            <Select label="Priority" value={form.priority} onChange={v => setForm(p => ({ ...p, priority: v as Priority }))} options={["Low", "Medium", "High", "Critical"]} />
            <div className="col-span-2"><Input label="Subject" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} /></div>
            <Input label="Child Involved" value={form.childName} onChange={v => setForm(p => ({ ...p, childName: v }))} />
            <Input label="Staff Involved" value={form.staffInvolved} onChange={v => setForm(p => ({ ...p, staffInvolved: v }))} />
            <Input label="CCTV Reference" value={form.cctvRef} onChange={v => setForm(p => ({ ...p, cctvRef: v }))} placeholder="e.g. CAM-04 @ 10:35 AM" />
            <Input label="Assigned To" value={form.assignedTo} onChange={v => setForm(p => ({ ...p, assignedTo: v }))} />
            <Input label="Date" type="date" value={form.date} onChange={v => setForm(p => ({ ...p, date: v }))} />
            <Select label="Status" value={form.status} onChange={v => setForm(p => ({ ...p, status: v as Complaint["status"] }))} options={["Open", "In Progress", "Resolved", "Closed"]} />
            <div className="col-span-2">
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe the complaint in detail…" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save Complaint</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

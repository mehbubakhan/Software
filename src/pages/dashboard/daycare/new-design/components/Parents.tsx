import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import {
  Plus, Eye, Pencil, Trash2, Phone, Mail, MapPin, Shield,
  ShieldOff, MessageSquare, CreditCard, Search, Filter,
  ChevronDown, RefreshCw, Download, UserCheck, AlertTriangle,
  CheckCircle, XCircle, Clock, User, Car, Users, Baby,
  Send, Bell, History
} from "lucide-react";
import { Card, StatusBadge, Modal, Btn, Avatar, PageHeader } from "./ui";
import { mockParents as initial, mockChildren } from "./mockData";
import type { Parent } from "./types";

// ── Extended types ────────────────────────────────────────────────────────
type PickupStatus = "Approved" | "Blocked" | "Pending";
type PaymentStatus = "Paid" | "Pending" | "Overdue";

interface PickupPerson {
  id: string;
  name: string;
  relationship: "Father" | "Mother" | "Grandparent" | "Relative" | "Driver" | "Guardian";
  phone: string;
  status: PickupStatus;
  photoId: boolean;
}

interface PaymentRecord {
  id: string;
  month: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  method: string;
}

interface CommRecord {
  id: string;
  type: "message" | "call" | "email" | "alert";
  subject: string;
  preview: string;
  date: string;
  direction: "in" | "out";
}

interface ParentExt extends Parent {
  parentId: string;
  occupation: string;
  alternatePhone: string;
  relationship: string;
  paymentStatus: PaymentStatus;
  pickupPersons: PickupPerson[];
  paymentHistory: PaymentRecord[];
  commHistory: CommRecord[];
  childNames: string[];
  blocked: boolean;
  lastSeen: string;
  notes: string;
}

function enrichParent(p: Parent, i: number): ParentExt {
  const linkedChildren = mockChildren.filter(c => p.children.includes(c.id));
  return {
    ...p,
    parentId: `PAR-${1000 + i}`,
    occupation: ["Teacher", "Engineer", "Doctor", "Nurse", "Designer", "Accountant", "Manager"][i % 7],
    alternatePhone: `+1 555-09${10 + i}`,
    relationship: "Parent",
    paymentStatus: (["Paid", "Paid", "Pending", "Overdue", "Paid", "Paid", "Pending", "Paid"][i % 8]) as PaymentStatus,
    pickupPersons: [
      { id: `pp${i}-1`, name: p.name, relationship: i % 2 === 0 ? "Mother" : "Father", phone: p.phone, status: "Approved", photoId: true },
      { id: `pp${i}-2`, name: `Grandma ${p.name.split(" ")[1]}`, relationship: "Grandparent", phone: `+1 555-07${10 + i}`, status: i % 3 === 0 ? "Blocked" : "Approved", photoId: true },
      { id: `pp${i}-3`, name: `Uncle ${["James", "Robert", "William", "David"][i % 4]}`, relationship: "Relative", phone: `+1 555-08${10 + i}`, status: "Pending", photoId: false },
    ],
    paymentHistory: [
      { id: `pay${i}-1`, month: "June 2026", amount: 850, status: "Pending", date: "2026-06-01", method: "Bank Transfer" },
      { id: `pay${i}-2`, month: "May 2026", amount: 850, status: "Paid", date: "2026-05-05", method: "Credit Card" },
      { id: `pay${i}-3`, month: "April 2026", amount: 850, status: "Paid", date: "2026-04-03", method: "Cash" },
      { id: `pay${i}-4`, month: "March 2026", amount: 900, status: "Paid", date: "2026-03-04", method: "Bank Transfer" },
    ],
    commHistory: [
      { id: `c${i}-1`, type: "message", subject: "Child update", preview: "How is my child doing today?", date: "Today 10:32 AM", direction: "in" },
      { id: `c${i}-2`, type: "email", subject: "Invoice June 2026", preview: "Please find attached your monthly invoice.", date: "Jun 1, 09:00 AM", direction: "out" },
      { id: `c${i}-3`, type: "call", subject: "Health incident", preview: "Called parent re: minor fall", date: "Jun 3, 02:15 PM", direction: "out" },
      { id: `c${i}-4`, type: "alert", subject: "Pickup reminder", preview: "Pickup scheduled for 3:30 PM today", date: "Today 03:00 PM", direction: "out" },
    ],
    childNames: linkedChildren.map(c => c.name),
    blocked: false,
    lastSeen: "Today 10:32 AM",
    notes: "",
  };
}

const INITIAL_PARENTS: ParentExt[] = initial.map(enrichParent);

type ProfileTab = "info" | "pickup" | "payments" | "comm";
type ModalType = "add" | "edit" | "profile" | "message" | "payments" | "pickup-add" | null;

const relationshipOptions = ["Father", "Mother", "Grandparent", "Relative", "Driver", "Guardian"] as const;
const payStatusColor = { Paid: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700", Overdue: "bg-red-100 text-red-700" };
const pickupStatusColor = { Approved: "bg-green-100 text-green-700", Blocked: "bg-red-100 text-red-700", Pending: "bg-yellow-100 text-yellow-700" };
const commIcon: Record<string, React.ReactNode> = {
  message: <MessageSquare size={13} />, call: <Phone size={13} />,
  email: <Mail size={13} />, alert: <Bell size={13} />,
};

export function Parents() {
  const [parents, setParents] = useState<ParentExt[]>(INITIAL_PARENTS);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({ status: "All", payment: "All" });
  const [selected, setSelected] = useState<ParentExt | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>("info");
  const [modal, setModal] = useState<ModalType>(null);
  const [msgText, setMsgText] = useState("");
  const [newPickup, setNewPickup] = useState({ name: "", relationship: "Relative" as PickupPerson["relationship"], phone: "", photoId: false });
  const [form, setForm] = useState<Partial<ParentExt>>({});

  const filtered = parents.filter(p => {
    const m = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.parentId.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const s = filters.status === "All" || p.status === filters.status;
    const pay = filters.payment === "All" || p.paymentStatus === filters.payment;
    return m && s && pay;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedParents = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function openProfile(p: ParentExt, tab: ProfileTab = "info") {
    setSelected(p); setProfileTab(tab); setModal("profile");
  }

  function togglePickup(parentId: string, ppId: string) {
    setParents(prev => prev.map(p => {
      if (p.id !== parentId) return p;
      const updated = p.pickupPersons.map(pp => {
        if (pp.id !== ppId) return pp;
        return { ...pp, status: pp.status === "Approved" ? "Blocked" : "Approved" as PickupStatus };
      });
      return { ...p, pickupPersons: updated };
    }));
    if (selected?.id === parentId) {
      setSelected(prev => prev ? {
        ...prev, pickupPersons: prev.pickupPersons.map(pp =>
          pp.id === ppId ? { ...pp, status: pp.status === "Approved" ? "Blocked" : "Approved" } : pp
        )
      } : prev);
    }
  }

  function addPickupPerson(parentId: string) {
    if (!newPickup.name) return;
    const pp: PickupPerson = { id: `pp${Date.now()}`, ...newPickup, status: "Pending" };
    setParents(prev => prev.map(p => p.id === parentId ? { ...p, pickupPersons: [...p.pickupPersons, pp] } : p));
    if (selected?.id === parentId) setSelected(prev => prev ? { ...prev, pickupPersons: [...prev.pickupPersons, pp] } : prev);
    setNewPickup({ name: "", relationship: "Relative", phone: "", photoId: false });
    setModal("profile");
  }

  function sendMessage(parentId: string) {
    if (!msgText.trim()) return;
    const comm: CommRecord = {
      id: `c${Date.now()}`, type: "message", subject: "Admin message",
      preview: msgText.trim(), date: "Just now", direction: "out",
    };
    setParents(prev => prev.map(p => p.id === parentId ? { ...p, commHistory: [comm, ...p.commHistory] } : p));
    if (selected?.id === parentId) setSelected(prev => prev ? { ...prev, commHistory: [comm, ...prev.commHistory] } : prev);
    setMsgText(""); setModal("profile"); setProfileTab("comm");
  }

  function toggleBlock(id: string) {
    setParents(prev => prev.map(p => p.id === id ? { ...p, blocked: !p.blocked, status: p.blocked ? "Active" : "Inactive" } : p));
  }

  function removeParent(id: string) {
    if (confirm("Remove this parent record?")) setParents(prev => prev.filter(p => p.id !== id));
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/daycare/portal/parents');
        const data = res.data?.data || [];
        if (data.length > 0) {
          // If the backend returns data, merge it or format it
          // For now, we'll just set it. We'll map backend columns to the frontend state
          const formatted = data.map((p: any) => ({
            ...p,
            id: p.id.toString(),
            parentId: p.parentId || p.parent_id_code,
            alternatePhone: p.alternatePhone || p.alternate_phone || "",
            emergencyContact: p.emergencyContact || p.emergency_contact || "",
            lastSeen: p.lastSeen || p.last_seen || "Just now",
            pickupPersons: p.pickupPersons || [],
            paymentHistory: p.paymentHistory || [],
            commHistory: p.commHistory || [],
            childNames: p.childNames || [],
            children: p.children || []
          }));
          // Combine mock with real data so UI looks full
          setParents([...formatted, ...INITIAL_PARENTS]);
        }
      } catch (err) {
        console.error("Failed to load parents", err);
      }
    }
    load();
  }, []);

  async function saveEdit() {
    if (modal === "add") {
      const newParent: ParentExt = {
        ...form,
        id: `p${Date.now()}`,
        parentId: `PAR-${Date.now()}`,
        name: form.name || "New Parent",
        email: form.email || "",
        phone: form.phone || "",
        children: [],
        status: form.status as any || "Active",
        occupation: form.occupation || "Not specified",
        alternatePhone: form.alternatePhone || "",
        relationship: "Parent",
        paymentStatus: "Pending",
        pickupPersons: [],
        paymentHistory: [],
        commHistory: [],
        childNames: [],
        blocked: false,
        lastSeen: "Just now",
        notes: "",
        address: form.address || "",
        emergencyContact: form.emergencyContact || ""
      };
      setParents(prev => [newParent, ...prev]);
      try {
        await api.post('/daycare/portal/parents', newParent);
      } catch (err) {
        console.error("Failed to save parent to DB", err);
      }
    } else if (modal === "edit" && selected) {
      setParents(prev => prev.map(p => p.id === selected.id ? { ...p, ...form } : p));
    }
    setModal(null);
  }

  const ff = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const filt = (k: keyof typeof filters, v: string) => setFilters(p => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader title="Parent Management" subtitle={`${parents.length} registered parents`} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e: any) => setSearch(e.target.value)} placeholder="Search name, ID or email…"
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn onClick={() => { setForm({}); setModal("add"); }}><Plus size={15} /> Add Parent</Btn>
        <Btn variant="secondary" onClick={() => setShowFilter(!showFilter)}><Filter size={15} /> Filter <ChevronDown size={13} /></Btn>
        <Btn variant="secondary"><Download size={15} /> Export</Btn>
      </div>

      {showFilter && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-gray-700">Filters</h4>
            <button onClick={() => setFilters({ status: "All", payment: "All" })} className="text-xs text-indigo-600 flex items-center gap-1"><RefreshCw size={12} /> Reset</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "status" as const, label: "Status", opts: ["All", "Active", "Inactive"] },
              { key: "payment" as const, label: "Payment", opts: ["All", "Paid", "Pending", "Overdue"] },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{f.label}</label>
                <select value={filters[f.key]} onChange={(e: any) => filt(f.key, e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Parent ID", "Parent", "Children", "Phone", "Payment", "Pickup Auth", "Emergency", "Status", "Actions"]
                  .map(h => <th key={h} className="text-left px-4 py-3 text-gray-600 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedParents.map(p => {
                const approvedPickups = p.pickupPersons.filter(pp => pp.status === "Approved").length;
                const blockedPickups = p.pickupPersons.filter(pp => pp.status === "Blocked").length;
                return (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${p.blocked ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3"><span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{p.parentId}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size="sm" />
                        <div>
                          <p style={{ fontWeight: 500 }}>{p.name}</p>
                          <p className="text-xs text-gray-400">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.childNames.length > 0
                        ? <div className="flex flex-col gap-0.5">{p.childNames.map(n => <span key={n} className="text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">{n}</span>)}</div>
                        : <span className="text-xs text-gray-400">None</span>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs">{p.phone}</p>
                      <p className="text-xs text-gray-400">{p.alternatePhone}</p>
                    </td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${payStatusColor[p.paymentStatus]}`}>{p.paymentStatus}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5"><CheckCircle size={10} />{approvedPickups}</span>
                        {blockedPickups > 0 && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded flex items-center gap-0.5"><XCircle size={10} />{blockedPickups}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.emergencyContact}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        <button title="View Profile" onClick={() => openProfile(p)} className="p-1.5 rounded hover:bg-indigo-50 text-indigo-500"><Eye size={14} /></button>
                        <button title="Edit" onClick={() => { setSelected(p); setForm({ ...p }); setModal("edit"); }} className="p-1.5 rounded hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                        <button title="Pickup Auth" onClick={() => openProfile(p, "pickup")} className="p-1.5 rounded hover:bg-green-50 text-green-600"><Shield size={14} /></button>
                        <button title="Send Message" onClick={() => { setSelected(p); setModal("message"); }} className="p-1.5 rounded hover:bg-purple-50 text-purple-500"><MessageSquare size={14} /></button>
                        <button title="View Payments" onClick={() => openProfile(p, "payments")} className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600"><CreditCard size={14} /></button>
                        <button title="Block/Unblock Pickup" onClick={() => toggleBlock(p.id)} className={`p-1.5 rounded transition-colors ${p.blocked ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`}>
                          {p.blocked ? <UserCheck size={14} /> : <ShieldOff size={14} />}
                        </button>
                        <button title="Delete" onClick={() => removeParent(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400"><Users size={28} className="mx-auto mb-2 opacity-30" />No parents found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} parents
          </div>
          {totalPages > 1 && (
            <div className="flex gap-1">
              <Btn variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Btn>
              <div className="flex items-center px-2 text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
              <Btn variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Btn>
            </div>
          )}
        </div>
      </Card>

      {/* ═══ PROFILE MODAL ═══════════════════════════════════════════════ */}
      <Modal open={modal === "profile"} onClose={() => setModal(null)} title="" width="max-w-2xl">
        {selected && (
          <div>
            {/* Header */}
            <div className="flex items-start gap-4 pb-4 mb-4 border-b border-gray-100">
              <Avatar name={selected.name} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2>{selected.name}</h2>
                  <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{selected.parentId}</span>
                  {selected.blocked && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Blocked</span>}
                </div>
                <p className="text-sm text-gray-500">{selected.occupation} · Last seen {selected.lastSeen}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${payStatusColor[selected.paymentStatus]}`}>{selected.paymentStatus}</span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Btn size="sm" onClick={() => { setModal("message"); }}><MessageSquare size={13} /> Message</Btn>
                <Btn variant="danger" size="sm" onClick={() => { toggleBlock(selected.id); setModal(null); }}>
                  {selected.blocked ? <><UserCheck size={13} /> Unblock</> : <><ShieldOff size={13} /> Block</>}
                </Btn>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0.5 border-b border-gray-200 mb-5 overflow-x-auto">
              {([{ id: "info", label: "Personal Info" }, { id: "pickup", label: "Pickup Auth" }, { id: "payments", label: "Payments" }, { id: "comm", label: "Communications" }] as { id: ProfileTab; label: string }[]).map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)}
                  className={`px-4 py-2 text-sm whitespace-nowrap ${profileTab === t.id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Personal Info */}
            {profileTab === "info" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[["Full Name", selected.name], ["Email", selected.email], ["Phone", selected.phone], ["Alt Phone", selected.alternatePhone],
                    ["Occupation", selected.occupation], ["Relationship", selected.relationship], ["Address", selected.address], ["Emergency Contact", selected.emergencyContact]
                  ].map(([k, v]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">{k}</p><p style={{ fontWeight: 500 }}>{v}</p></div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-2">Linked Children</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.childNames.length > 0
                      ? selected.childNames.map(n => <span key={n} className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full flex items-center gap-1"><Baby size={12} />{n}</span>)
                      : <span className="text-sm text-gray-400">No children linked</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Pickup Authorization */}
            {profileTab === "pickup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Authorized pickup persons for this parent</p>
                  <Btn size="sm" onClick={() => setModal("pickup-add")}><Plus size={13} /> Add Person</Btn>
                </div>
                <div className="space-y-2">
                  {selected.pickupPersons.map(pp => (
                    <div key={pp.id} className={`flex items-center gap-3 p-3 rounded-xl border ${pp.status === "Approved" ? "bg-green-50 border-green-200" : pp.status === "Blocked" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
                      <Avatar name={pp.name} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm" style={{ fontWeight: 600 }}>{pp.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${pickupStatusColor[pp.status]}`}>{pp.status}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Users size={11} />{pp.relationship}</span>
                          <span className="flex items-center gap-1"><Phone size={11} />{pp.phone}</span>
                          {pp.photoId && <span className="flex items-center gap-1 text-green-600"><CheckCircle size={11} />Photo ID</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {pp.status !== "Approved" && (
                          <button onClick={() => togglePickup(selected.id, pp.id)} className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs transition-colors">Approve</button>
                        )}
                        {pp.status !== "Blocked" && (
                          <button onClick={() => togglePickup(selected.id, pp.id)} className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs transition-colors">Block</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Quick pickup approve by type */}
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-xs text-indigo-700 mb-2" style={{ fontWeight: 600 }}>Quick Approve by Relationship</p>
                  <div className="flex flex-wrap gap-2">
                    {relationshipOptions.map(r => (
                      <button key={r} onClick={() => {
                        setParents(prev => prev.map(p => p.id === selected.id
                          ? { ...p, pickupPersons: p.pickupPersons.map(pp => pp.relationship === r ? { ...pp, status: "Approved" } : pp) }
                          : p
                        ));
                        setSelected(prev => prev ? { ...prev, pickupPersons: prev.pickupPersons.map(pp => pp.relationship === r ? { ...pp, status: "Approved" } : pp) } : prev);
                      }} className="px-3 py-1 text-xs bg-white border border-indigo-200 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1">
                        <UserCheck size={11} /> Approve all {r}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment History */}
            {profileTab === "payments" && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 mb-2">
                  {[
                    { label: "Total Paid", value: `$${selected.paymentHistory.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0).toLocaleString()}`, color: "text-green-600" },
                    { label: "Outstanding", value: `$${selected.paymentHistory.filter(p => p.status !== "Paid").reduce((s, p) => s + p.amount, 0).toLocaleString()}`, color: "text-red-600" },
                    { label: "Transactions", value: selected.paymentHistory.length, color: "text-indigo-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className={`text-lg ${s.color}`} style={{ fontWeight: 700 }}>{s.value}</p>
                      <p className="text-xs text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {selected.paymentHistory.map(pay => (
                    <div key={pay.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className={`w-2 h-2 rounded-full ${pay.status === "Paid" ? "bg-green-500" : pay.status === "Overdue" ? "bg-red-500" : "bg-yellow-500"}`} />
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontWeight: 500 }}>{pay.month}</p>
                        <p className="text-xs text-gray-400">{pay.date} · {pay.method}</p>
                      </div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>${pay.amount.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${payStatusColor[pay.status]}`}>{pay.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communications */}
            {profileTab === "comm" && (
              <div className="space-y-3">
                <Btn size="sm" onClick={() => setModal("message")}><MessageSquare size={13} /> New Message</Btn>
                <div className="space-y-2">
                  {selected.commHistory.map(c => (
                    <div key={c.id} className={`flex items-start gap-3 p-3 rounded-xl border ${c.direction === "in" ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.direction === "in" ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}`}>
                        {commIcon[c.type]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm" style={{ fontWeight: 500 }}>{c.subject}</p>
                          <span className="text-xs text-gray-400">{c.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{c.preview}</p>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.direction === "in" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>
                        {c.direction === "in" ? "Received" : "Sent"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ═══ SEND MESSAGE ════════════════════════════════════════════════ */}
      <Modal open={modal === "message"} onClose={() => setModal(null)} title={`Message — ${selected?.name}`}>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Message Type</label>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Direct Message</option><option>Payment Reminder</option><option>Health Alert</option><option>General Announcement</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Message</label>
            <textarea rows={5} value={msgText} onChange={(e: any) => setMsgText(e.target.value)}
              placeholder="Type your message here…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["Payment is due", "Please update vaccination records", "Schedule a visit", "Pickup time reminder"].map(t => (
              <button key={t} onClick={() => setMsgText(t)} className="text-xs px-2 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors">{t}</button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => { setModal(selected ? "profile" : null); setProfileTab("comm"); }}>Cancel</Btn>
          <Btn onClick={() => selected && sendMessage(selected.id)}><Send size={14} /> Send Message</Btn>
        </div>
      </Modal>

      {/* ═══ ADD PICKUP PERSON ═══════════════════════════════════════════ */}
      <Modal open={modal === "pickup-add"} onClose={() => setModal("profile")} title="Add Authorized Pickup Person">
        <div className="space-y-3">
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Full Name</label><input value={newPickup.name} onChange={(e: any) => setNewPickup(p => ({ ...p, name: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Relationship</label>
            <select value={newPickup.relationship} onChange={(e: any) => setNewPickup(p => ({ ...p, relationship: e.target.value as PickupPerson["relationship"] }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {relationshipOptions.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1"><label className="text-sm text-gray-600">Phone</label><input value={newPickup.phone} onChange={(e: any) => setNewPickup(p => ({ ...p, phone: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="phid" checked={newPickup.photoId} onChange={(e: any) => setNewPickup(p => ({ ...p, photoId: e.target.checked }))} className="w-4 h-4" /><label htmlFor="phid" className="text-sm text-gray-600">Photo ID verified</label></div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => setModal("profile")}>Cancel</Btn>
          <Btn onClick={() => selected && addPickupPerson(selected.id)}><Shield size={14} /> Add Person</Btn>
        </div>
      </Modal>

      {/* ═══ ADD / EDIT PARENT ═══════════════════════════════════════════ */}
      <Modal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)} title={modal === "add" ? "Add Parent" : `Edit — ${selected?.name}`} width="max-w-lg">
        <div className="grid grid-cols-2 gap-3">
          {[["Full Name", "name"], ["Email", "email"], ["Phone", "phone"], ["Alt Phone", "alternatePhone"], ["Occupation", "occupation"], ["Address", "address"], ["Emergency Contact", "emergencyContact"]].map(([label, key]) => (
            <div key={key} className={`flex flex-col gap-1 ${key === "address" || key === "emergencyContact" ? "col-span-2" : ""}`}>
              <label className="text-sm text-gray-600">{label}</label>
              <input value={(form as any)[key] ?? (selected as any)?.[key] ?? ""} onChange={(e: any) => ff(key, e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Status</label>
            <select value={(form as any).status ?? "Active"} onChange={(e: any) => ff("status", e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn onClick={saveEdit}>Save Parent</Btn>
        </div>
      </Modal>
    </div>
  );
}

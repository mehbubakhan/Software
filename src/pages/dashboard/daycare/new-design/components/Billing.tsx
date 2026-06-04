import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import {
  Plus, Download, Send, Pencil, Trash2, DollarSign, CheckCircle,
  RefreshCw, Eye, FileText, CreditCard, Smartphone, Building2,
  Globe, AlertTriangle, TrendingUp, X, RotateCcw, Bell, Filter
} from "lucide-react";
import { Card, Modal, Input, Select, Textarea, Btn, PageHeader, SearchBar, Avatar, StatCard } from "./ui";
import { mockInvoices as initial } from "./mockData";
import type { Invoice } from "./types";

// ── Types ──────────────────────────────────────────────────────
type PackageType = "1 Day" | "1 Week" | "15 Days" | "1 Month" | "6 Months" | "1 Year" | "Trial" | "Transport" | "Admission";
type PaymentMethod = "Card" | "Mobile Banking" | "Bank Transfer" | "Online Gateway" | "Cash";
type InvoiceType = "Admission" | "Monthly" | "Transport" | "Miscellaneous";

interface InvoiceExt extends Omit<Invoice, "status"> {
  status: "Paid" | "Pending" | "Overdue" | "Cancelled";
  invoiceId: string;
  childName: string;
  packageType: PackageType;
  invoiceType: InvoiceType;
  paymentMethod?: PaymentMethod;
  paidDate?: string;
  reminderSent: boolean;
  reminderCount: number;
  notes: string;
  taxAmount: number;
  discountAmount: number;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  parentName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  transactionRef: string;
}

// ── Constants ─────────────────────────────────────────────────
const PACKAGE_PRICES: Record<PackageType, number> = {
  "1 Day": 45, "1 Week": 200, "15 Days": 380, "1 Month": 750,
  "6 Months": 4200, "1 Year": 7800, "Trial": 0, "Transport": 120, "Admission": 500,
};

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, React.ReactNode> = {
  Card: <CreditCard size={13} />,
  "Mobile Banking": <Smartphone size={13} />,
  "Bank Transfer": <Building2 size={13} />,
  "Online Gateway": <Globe size={13} />,
  Cash: <DollarSign size={13} />,
};

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

const INVOICE_TYPE_COLORS: Record<InvoiceType, string> = {
  Admission: "bg-purple-100 text-purple-700",
  Monthly: "bg-blue-100 text-blue-700",
  Transport: "bg-teal-100 text-teal-700",
  Miscellaneous: "bg-gray-100 text-gray-600",
};

// ── Enrich invoices ────────────────────────────────────────────
const PACKAGES: PackageType[] = ["1 Month", "6 Months", "1 Week", "1 Year", "Transport", "15 Days", "Admission"];
const METHODS: PaymentMethod[] = ["Card", "Mobile Banking", "Bank Transfer", "Online Gateway", "Cash"];
const INV_TYPES: InvoiceType[] = ["Monthly", "Admission", "Transport", "Monthly", "Monthly", "Transport"];
const CHILDREN = ["Emma Wilson", "Liam Brown", "Olivia Davis", "Noah Garcia", "Ava Martinez", "James Lee"];

function enrichInvoice(inv: Invoice, idx: number): InvoiceExt {
  const pkg = PACKAGES[idx % PACKAGES.length];
  const tax = Math.round(inv.amount * 0.05);
  return {
    ...inv,
    invoiceId: `INV-${2025001 + idx}`,
    childName: CHILDREN[idx % CHILDREN.length],
    packageType: pkg,
    invoiceType: INV_TYPES[idx % INV_TYPES.length],
    paymentMethod: inv.status === "Paid" ? METHODS[idx % METHODS.length] : undefined,
    paidDate: inv.status === "Paid" ? `2026-05-${20 + idx}` : undefined,
    reminderSent: idx % 3 === 0,
    reminderCount: idx % 3 === 0 ? 1 : 0,
    notes: "",
    taxAmount: tax,
    discountAmount: idx === 2 ? 50 : 0,
  };
}

const seedPayments: PaymentRecord[] = [
  { id: "pt1", invoiceId: "INV-2025001", parentName: "Sarah Johnson", amount: 750, method: "Card", date: "2026-05-20", transactionRef: "TXN-001-20260520" },
  { id: "pt2", invoiceId: "INV-2025002", parentName: "Michael Brown", amount: 4200, method: "Bank Transfer", date: "2026-05-18", transactionRef: "TXN-002-20260518" },
  { id: "pt3", invoiceId: "INV-2025003", parentName: "Emily Davis", amount: 200, method: "Mobile Banking", date: "2026-05-22", transactionRef: "TXN-003-20260522" },
];

type ModalType = "add" | "edit" | "view" | "verify" | "refund" | "reminder" | "report" | null;
type MainTab = "invoices" | "payments" | "reports";

const emptyForm = {
  parentName: "", childName: "", amount: 750, dueDate: "2026-06-15", issueDate: "2026-06-04",
  status: "Pending" as InvoiceExt["status"], description: "", packageType: "1 Month" as PackageType,
  invoiceType: "Monthly" as InvoiceType, notes: "", taxAmount: 0, discountAmount: 0,
};

export function Billing() {
  const [invoices, setInvoices] = useState<InvoiceExt[]>(() => initial.map(enrichInvoice));
  
  useEffect(() => {
    api.get('/daycare/portal/invoices')
      .then((res: any) => setInvoices(res.data.map(enrichInvoice)))
      .catch((err: any) => console.error(err));
  }, []);
  const [payments] = useState<PaymentRecord[]>(seedPayments);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [mainTab, setMainTab] = useState<MainTab>("invoices");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<InvoiceExt | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [reminderMsg, setReminderMsg] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [verifyMethod, setVerifyMethod] = useState<PaymentMethod>("Card");
  const [verifyRef, setVerifyRef] = useState("");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const filtered = invoices.filter(inv => {
    const m = inv.parentName.toLowerCase().includes(search.toLowerCase()) || inv.childName.toLowerCase().includes(search.toLowerCase()) || inv.invoiceId.toLowerCase().includes(search.toLowerCase());
    const s = filterStatus === "All" || inv.status === filterStatus;
    const t = filterType === "All" || inv.invoiceType === filterType;
    return m && s && t;
  });

  const totalCollected = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const totalTax = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.taxAmount, 0);

  function save() {
    const tax = Math.round(form.amount * 0.05);
    const newInv: InvoiceExt = {
      ...form, id: `inv${Date.now()}`, invoiceId: `INV-${Date.now()}`,
      taxAmount: tax, discountAmount: form.discountAmount,
      reminderSent: false, reminderCount: 0,
    };
    if (modal === "add") setInvoices(prev => [...prev, newInv]);
    else if (modal === "edit" && selected) setInvoices(prev => prev.map(i => i.id === selected.id ? { ...newInv, id: i.id, invoiceId: i.invoiceId } : i));
    setModal(null);
  }

  function markPaid(id: string) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: "Paid", paidDate: new Date().toISOString().split("T")[0] } : i));
  }

  function verifyPayment() {
    if (!selected) return;
    setInvoices(prev => prev.map(i => i.id === selected.id ? { ...i, status: "Paid", paymentMethod: verifyMethod, paidDate: new Date().toISOString().split("T")[0] } : i));
    setModal(null);
  }

  function processRefund() {
    if (!selected) return;
    setInvoices(prev => prev.map(i => i.id === selected.id ? { ...i, status: "Cancelled", notes: `Refunded: ${refundReason}` } : i));
    setModal(null);
  }

  function sendReminder() {
    if (!selected) return;
    setInvoices(prev => prev.map(i => i.id === selected.id ? { ...i, reminderSent: true, reminderCount: i.reminderCount + 1 } : i));
    setModal(null);
  }

  function downloadReceipt(inv: InvoiceExt) {
    setSelected(inv); setDownloadProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 25 + Math.random() * 20;
      if (p >= 100) { clearInterval(t); setDownloadProgress(null); }
      else setDownloadProgress(Math.min(99, p));
    }, 300);
  }

  function remove(id: string) { if (confirm("Remove invoice?")) setInvoices(prev => prev.filter(i => i.id !== id)); }

  const f = (k: string, v: string | number) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader
        title="Billing & Payments"
        subtitle="Manage invoices, payments, and financial reports"
        action={<Btn onClick={() => { setForm(emptyForm); setModal("add"); }}><Plus size={16} /> Create Invoice</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-xs">Total Collected</p>
          <p className="text-2xl text-green-600 mt-1" style={{ fontWeight: 700 }}>${totalCollected.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">{invoices.filter(i => i.status === "Paid").length} paid</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-xs">Pending</p>
          <p className="text-2xl text-amber-600 mt-1" style={{ fontWeight: 700 }}>${totalPending.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">{invoices.filter(i => i.status === "Pending").length} invoices</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-xs">Overdue</p>
          <p className="text-2xl text-red-600 mt-1" style={{ fontWeight: 700 }}>${totalOverdue.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">{invoices.filter(i => i.status === "Overdue").length} overdue</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-xs">Tax Collected</p>
          <p className="text-2xl text-indigo-600 mt-1" style={{ fontWeight: 700 }}>${totalTax.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">5% rate applied</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {([["invoices", "Invoices"], ["payments", "Payment History"], ["reports", "Financial Report"]] as [MainTab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setMainTab(t)}
            className={`px-4 py-2 text-sm transition-colors ${mainTab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Invoices Tab ── */}
      {mainTab === "invoices" && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by parent, child, or invoice ID…" />
            <select value={filterStatus} onChange={(e: any) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="All">All Status</option>
              {["Paid", "Pending", "Overdue", "Cancelled"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterType} onChange={(e: any) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="All">All Types</option>
              {["Admission", "Monthly", "Transport", "Miscellaneous"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-600">Invoice ID</th>
                    <th className="text-left px-4 py-3 text-gray-600">Parent / Child</th>
                    <th className="text-left px-4 py-3 text-gray-600">Package / Type</th>
                    <th className="text-left px-4 py-3 text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 text-gray-600">Payment Status</th>
                    <th className="text-left px-4 py-3 text-gray-600">Due Date</th>
                    <th className="text-left px-4 py-3 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => (
                    <tr key={inv.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${inv.status === "Overdue" ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-indigo-700" style={{ fontWeight: 600 }}>{inv.invoiceId}</p>
                        <p className="text-xs text-gray-400">{inv.issueDate}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={inv.parentName} size="sm" />
                          <div>
                            <p style={{ fontWeight: 500 }}>{inv.parentName}</p>
                            <p className="text-xs text-gray-400">{inv.childName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${INVOICE_TYPE_COLORS[inv.invoiceType]}`}>{inv.invoiceType}</span>
                        <p className="text-xs text-gray-400 mt-0.5">{inv.packageType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p style={{ fontWeight: 600 }}>${inv.amount.toLocaleString()}</p>
                        {inv.taxAmount > 0 && <p className="text-xs text-gray-400">+${inv.taxAmount} tax</p>}
                        {inv.discountAmount > 0 && <p className="text-xs text-green-500">-${inv.discountAmount} disc.</p>}
                        {inv.paymentMethod && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            {PAYMENT_METHOD_ICONS[inv.paymentMethod]}
                            {inv.paymentMethod}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[inv.status] ?? "bg-gray-100"}`}>{inv.status}</span>
                        {inv.reminderSent && <p className="text-xs text-amber-500 mt-0.5">Reminder sent ×{inv.reminderCount}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {inv.dueDate}
                        {inv.paidDate && <p className="text-green-500">Paid: {inv.paidDate}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button onClick={() => { setSelected(inv); setModal("view"); }} title="View Invoice"
                            className="p-1.5 rounded hover:bg-indigo-50 text-indigo-600 transition-colors"><Eye size={14} /></button>
                          {inv.status !== "Paid" && inv.status !== "Cancelled" && (
                            <button onClick={() => { setSelected(inv); setVerifyMethod("Card"); setVerifyRef(""); setModal("verify"); }} title="Verify Payment"
                              className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"><CheckCircle size={14} /></button>
                          )}
                          {inv.status !== "Paid" && inv.status !== "Cancelled" && (
                            <button onClick={() => { setSelected(inv); setReminderMsg(""); setModal("reminder"); }} title="Send Reminder"
                              className="p-1.5 rounded hover:bg-amber-50 text-amber-600 transition-colors"><Bell size={14} /></button>
                          )}
                          <button onClick={() => downloadReceipt(inv)} title="Download Receipt"
                            className="p-1.5 rounded hover:bg-purple-50 text-purple-600 transition-colors"><Download size={14} /></button>
                          {inv.status === "Paid" && (
                            <button onClick={() => { setSelected(inv); setRefundReason(""); setModal("refund"); }} title="Refund"
                              className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><RotateCcw size={14} /></button>
                          )}
                          <button onClick={() => { setSelected(inv); setForm({ ...emptyForm, parentName: inv.parentName, childName: inv.childName, amount: inv.amount, dueDate: inv.dueDate, issueDate: inv.issueDate, status: inv.status, description: inv.description, packageType: inv.packageType, invoiceType: inv.invoiceType, notes: inv.notes, taxAmount: inv.taxAmount, discountAmount: inv.discountAmount }); setModal("edit"); }}
                            title="Edit" className="p-1.5 rounded hover:bg-gray-100 text-blue-500 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => remove(inv.id)} title="Delete"
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">No invoices found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Download progress */}
          {downloadProgress !== null && (
            <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-64">
              <div className="flex items-center gap-2 mb-2">
                <Download size={16} className="text-indigo-500" />
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>Downloading receipt…</p>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${downloadProgress}%` }} />
              </div>
              <p className="text-xs text-indigo-600 mt-1 text-right">{Math.round(downloadProgress)}%</p>
            </div>
          )}
        </>
      )}

      {/* ── Payment History Tab ── */}
      {mainTab === "payments" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-600">Transaction Ref</th>
                  <th className="text-left px-4 py-3 text-gray-600">Invoice ID</th>
                  <th className="text-left px-4 py-3 text-gray-600">Parent</th>
                  <th className="text-left px-4 py-3 text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 text-gray-600">Method</th>
                  <th className="text-left px-4 py-3 text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...payments, ...invoices.filter(i => i.status === "Paid").map(i => ({
                  id: `auto-${i.id}`, invoiceId: i.invoiceId, parentName: i.parentName,
                  amount: i.amount, method: i.paymentMethod ?? "Cash" as PaymentMethod,
                  date: i.paidDate ?? i.issueDate, transactionRef: `TXN-AUTO-${i.invoiceId}`,
                }))].map(pt => (
                  <tr key={pt.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-indigo-700">{pt.transactionRef}</td>
                    <td className="px-4 py-3 font-mono text-xs">{pt.invoiceId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={pt.parentName} size="sm" />
                        <span style={{ fontWeight: 500 }}>{pt.parentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-green-600" style={{ fontWeight: 600 }}>${pt.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        {PAYMENT_METHOD_ICONS[pt.method]}
                        <span>{pt.method}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{pt.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Reports Tab ── */}
      {mainTab === "reports" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Monthly Revenue", value: `$${(totalCollected / 6).toFixed(0)}`, sub: "avg per month", color: "text-green-600 bg-green-50" },
              { label: "Collection Rate", value: `${Math.round((invoices.filter(i => i.status === "Paid").length / invoices.length) * 100)}%`, sub: "of invoices paid", color: "text-indigo-600 bg-indigo-50" },
              { label: "Outstanding", value: `$${(totalPending + totalOverdue).toLocaleString()}`, sub: "to be collected", color: "text-amber-600 bg-amber-50" },
              { label: "Total Tax", value: `$${totalTax.toLocaleString()}`, sub: "5% applied", color: "text-purple-600 bg-purple-50" },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                <p className="text-xs opacity-70">{s.label}</p>
                <p className="text-2xl mt-1" style={{ fontWeight: 700 }}>{s.value}</p>
                <p className="text-xs opacity-60 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* By invoice type */}
          <Card className="p-5">
            <h3 className="text-sm text-gray-700 mb-4" style={{ fontWeight: 600 }}>Revenue by Invoice Type</h3>
            <div className="space-y-3">
              {(["Monthly", "Admission", "Transport", "Miscellaneous"] as InvoiceType[]).map(type => {
                const total = invoices.filter(i => i.invoiceType === type && i.status === "Paid").reduce((s, i) => s + i.amount, 0);
                const all = invoices.filter(i => i.invoiceType === type).reduce((s, i) => s + i.amount, 0);
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs w-24 text-center ${INVOICE_TYPE_COLORS[type]}`}>{type}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-indigo-400 transition-all" style={{ width: all > 0 ? `${(total / all) * 100}%` : "0%" }} />
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">${total.toLocaleString()} / ${all.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* By payment method */}
          <Card className="p-5">
            <h3 className="text-sm text-gray-700 mb-4" style={{ fontWeight: 600 }}>Payment Methods Used</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(["Card", "Mobile Banking", "Bank Transfer", "Online Gateway", "Cash"] as PaymentMethod[]).map(method => {
                const count = invoices.filter(i => i.paymentMethod === method).length;
                return (
                  <div key={method} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <div className="flex justify-center mb-1 text-gray-500">{PAYMENT_METHOD_ICONS[method]}</div>
                    <p className="text-lg" style={{ fontWeight: 700 }}>{count}</p>
                    <p className="text-xs text-gray-400">{method}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex gap-3">
            <Btn><Download size={14} /> Export Full Report</Btn>
            <Btn variant="secondary"><FileText size={14} /> Generate PDF</Btn>
          </div>
        </div>
      )}

      {/* ── Modals ── */}

      {/* View Invoice */}
      {modal === "view" && selected && (
        <Modal title={`Invoice ${selected.invoiceId}`} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Parent", selected.parentName], ["Child", selected.childName],
                ["Invoice Type", selected.invoiceType], ["Package", selected.packageType],
                ["Amount", `$${selected.amount.toLocaleString()}`], ["Tax (5%)", `$${selected.taxAmount}`],
                ["Discount", selected.discountAmount > 0 ? `-$${selected.discountAmount}` : "None"],
                ["Total", `$${(selected.amount + selected.taxAmount - selected.discountAmount).toLocaleString()}`],
                ["Issue Date", selected.issueDate], ["Due Date", selected.dueDate],
                ["Status", selected.status], ["Payment Method", selected.paymentMethod ?? "—"],
                ["Paid Date", selected.paidDate ?? "—"], ["Reminders Sent", String(selected.reminderCount)],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p style={{ fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
            {selected.description && (
              <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700"><strong>Note:</strong> {selected.description}</div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            {selected.status !== "Paid" && <Btn onClick={() => { setModal("verify"); setVerifyMethod("Card"); setVerifyRef(""); }}><CheckCircle size={14} /> Verify Payment</Btn>}
            <Btn variant="secondary" onClick={() => downloadReceipt(selected)}><Download size={14} /> Download Receipt</Btn>
            {selected.status !== "Paid" && <Btn variant="secondary" onClick={() => { setModal("reminder"); setReminderMsg(""); }}><Bell size={14} /> Send Reminder</Btn>}
          </div>
        </Modal>
      )}

      {/* Verify Payment */}
      {modal === "verify" && selected && (
        <Modal title={`Verify Payment — ${selected.invoiceId}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              Amount to verify: <strong>${(selected.amount + selected.taxAmount - selected.discountAmount).toLocaleString()}</strong>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {(["Card", "Mobile Banking", "Bank Transfer", "Online Gateway", "Cash"] as PaymentMethod[]).map(m => (
                  <button key={m} onClick={() => setVerifyMethod(m)}
                    className={`flex items-center gap-1.5 p-2.5 rounded-xl border text-xs transition-all ${verifyMethod === m ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-gray-300"}`}>
                    {PAYMENT_METHOD_ICONS[m]} {m}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Transaction Reference" value={verifyRef} onChange={setVerifyRef} placeholder="e.g. TXN-20260604-001" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={verifyPayment}><CheckCircle size={14} /> Confirm Paid</Btn>
          </div>
        </Modal>
      )}

      {/* Send Reminder */}
      {modal === "reminder" && selected && (
        <Modal title={`Send Reminder — ${selected.invoiceId}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p>Sending reminder to: <strong>{selected.parentName}</strong></p>
              <p className="text-gray-500">Amount due: <strong>${selected.amount.toLocaleString()}</strong> · Due: {selected.dueDate}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Payment due reminder", "Final notice before late fee", "Invoice overdue — please pay immediately", "Kindly clear your outstanding balance"].map(t => (
                <button key={t} onClick={() => setReminderMsg(t)} className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">{t}</button>
              ))}
            </div>
            <textarea value={reminderMsg} onChange={(e: any) => setReminderMsg(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Custom reminder message…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={sendReminder}><Send size={14} /> Send Reminder</Btn>
          </div>
        </Modal>
      )}

      {/* Refund */}
      {modal === "refund" && selected && (
        <Modal title={`Refund Payment — ${selected.invoiceId}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              Processing a refund will mark this invoice as Cancelled. Amount: <strong>${selected.amount.toLocaleString()}</strong>
            </div>
            <textarea value={refundReason} onChange={(e: any) => setRefundReason(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Reason for refund…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={processRefund} disabled={!refundReason.trim()}><RotateCcw size={14} /> Process Refund</Btn>
          </div>
        </Modal>
      )}

      {/* Add / Edit */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Create Invoice" : "Edit Invoice"} onClose={() => setModal(null)} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Parent Name" value={form.parentName} onChange={(v: any) => f("parentName", v)} />
            <Input label="Child Name" value={form.childName} onChange={(v: any) => f("childName", v)} />
            <Select label="Invoice Type" value={form.invoiceType} onChange={(v: any) => f("invoiceType", v)} options={["Monthly", "Admission", "Transport", "Miscellaneous"]} />
            <Select label="Package" value={form.packageType} onChange={(v: any) => { f("packageType", v); f("amount", PACKAGE_PRICES[v as PackageType] ?? 750); }} options={Object.keys(PACKAGE_PRICES)} />
            <Input label="Amount ($)" type="number" value={String(form.amount)} onChange={(v: any) => f("amount", Number(v))} />
            <Input label="Discount ($)" type="number" value={String(form.discountAmount)} onChange={(v: any) => f("discountAmount", Number(v))} />
            <Input label="Issue Date" type="date" value={form.issueDate} onChange={(v: any) => f("issueDate", v)} />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(v: any) => f("dueDate", v)} />
            <Select label="Status" value={form.status} onChange={(v: any) => f("status", v)} options={["Pending", "Paid", "Overdue", "Cancelled"]} />
            <div className="col-span-2"><Input label="Description / Notes" value={form.description} onChange={(v: any) => f("description", v)} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save Invoice</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

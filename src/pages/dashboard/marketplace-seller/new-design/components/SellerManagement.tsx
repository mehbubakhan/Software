import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import { Search, Eye, MessageSquare, Trash2, CheckCircle, XCircle, PauseCircle, Store } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, Input, StatCard } from "./Modal";

type SellerStatus = "Active" | "Pending" | "Suspended" | "Rejected";

interface Seller {
  id: string;
  logo: string;
  name: string;
  business: string;
  products: number;
  orders: number;
  revenue: string;
  status: SellerStatus;
  joined: string;
  email: string;
  phone: string;
  tradeLicense: boolean;
  nidVerified: boolean;
  bankVerified: boolean;
}

const initSellers: Seller[] = [
  { id: "S-001", logo: "BW", name: "BabyWorld BD", business: "Baby Products", products: 142, orders: 1204, revenue: "৳2,84,000", status: "Active", joined: "2024-01-15", email: "contact@babyworldbd.com", phone: "01711-234567", tradeLicense: true, nidVerified: true, bankVerified: true },
  { id: "S-002", logo: "TT", name: "Tiny Tots Store", business: "Toys & Games", products: 87, orders: 643, revenue: "৳1,12,500", status: "Pending", joined: "2025-11-20", email: "admin@tinytots.bd", phone: "01822-345678", tradeLicense: true, nidVerified: false, bankVerified: false },
  { id: "S-003", logo: "KC", name: "KidsCraft Ltd.", business: "Educational", products: 56, orders: 398, revenue: "৳67,200", status: "Active", joined: "2024-06-10", email: "info@kidscraft.bd", phone: "01933-456789", tradeLicense: true, nidVerified: true, bankVerified: true },
  { id: "S-004", logo: "SB", name: "SafeBaby Shop", business: "Baby Safety", products: 34, orders: 210, revenue: "৳44,800", status: "Suspended", joined: "2024-09-05", email: "safe@babysafety.bd", phone: "01644-567890", tradeLicense: false, nidVerified: true, bankVerified: true },
  { id: "S-005", logo: "KG", name: "KidGear Emporium", business: "Kids Clothing", products: 201, orders: 1890, revenue: "৳5,21,000", status: "Active", joined: "2023-08-20", email: "store@kidgear.bd", phone: "01755-678901", tradeLicense: true, nidVerified: true, bankVerified: true },
  { id: "S-006", logo: "NT", name: "NurtureTech BD", business: "Educational Tech", products: 29, orders: 87, revenue: "৳23,400", status: "Pending", joined: "2025-12-01", email: "nurture@techbd.com", phone: "01866-789012", tradeLicense: true, nidVerified: true, bankVerified: false },
];

const statusColor: Record<SellerStatus, string> = { Active: "green", Pending: "yellow", Suspended: "red", Rejected: "gray" };

export function SellerManagement() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selected, setSelected] = useState<Seller | null>(null);
  const [msgModal, setMsgModal] = useState<Seller | null>(null);
  const [message, setMessage] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ seller: Seller; action: string } | null>(null);

  useEffect(() => {
    api.get("/marketplace/admin/sellers").then(res => {
      setSellers(res.data.data || res.data || []);
    }).catch(console.error);
  }, []);

  function updateStatus(id: string, status: SellerStatus) {
    setSellers(s => s.map(x => x.id === id ? { ...x, status } : x));
    setSelected(null);
    setConfirmAction(null);
  }

  function deleteSeller(id: string) {
    setSellers(s => s.filter(x => x.id !== id));
    setConfirmAction(null);
  }

  function sendMessage() {
    if (message.trim()) {
      setMsgSent(true);
      setTimeout(() => { setMsgSent(false); setMsgModal(null); setMessage(""); }, 1500);
    }
  }

  const filtered = sellers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Seller Management" subtitle={`${sellers.length} registered sellers`} />

      {/* Stats */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard label="Total Sellers" value={sellers.length} color="#0ea5e9" />
        <StatCard label="Active" value={sellers.filter(s => s.status === "Active").length} color="#10b981" />
        <StatCard label="Pending Approval" value={sellers.filter(s => s.status === "Pending").length} color="#f59e0b" />
        <StatCard label="Suspended" value={sellers.filter(s => s.status === "Suspended").length} color="#ef4444" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded flex-1 min-w-[200px]" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sellers..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
        </div>
        {["All", "Active", "Pending", "Suspended", "Rejected"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className="px-3 py-1.5 rounded text-xs transition-colors"
            style={{ background: filterStatus === s ? "var(--primary)" : "var(--muted)", color: filterStatus === s ? "#fff" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <Table headers={["Seller ID", "Name", "Business", "Products", "Orders", "Revenue", "Status", "Actions"]}>
        {filtered.map(seller => (
          <TR key={seller.id}>
            <TD mono>{seller.id}</TD>
            <TD>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "#fff" }}>{seller.logo}</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>{seller.name}</p>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{seller.email}</p>
                </div>
              </div>
            </TD>
            <TD>{seller.business}</TD>
            <TD mono>{seller.products}</TD>
            <TD mono>{seller.orders}</TD>
            <TD mono>{seller.revenue}</TD>
            <TD><Badge label={seller.status} color={statusColor[seller.status]} /></TD>
            <TD>
              <div className="flex items-center gap-1">
                <button onClick={() => setSelected(seller)} className="p-1 rounded hover:bg-white/10 transition-colors" title="View Store" style={{ color: "var(--primary)" }}><Eye size={13} /></button>
                <button onClick={() => setMsgModal(seller)} className="p-1 rounded hover:bg-white/10 transition-colors" title="Message" style={{ color: "#06b6d4" }}><MessageSquare size={13} /></button>
                {seller.status === "Pending" && (
                  <button onClick={() => setConfirmAction({ seller, action: "approve" })} className="p-1 rounded hover:bg-white/10 transition-colors" title="Approve" style={{ color: "#10b981" }}><CheckCircle size={13} /></button>
                )}
                {seller.status === "Active" && (
                  <button onClick={() => setConfirmAction({ seller, action: "suspend" })} className="p-1 rounded hover:bg-white/10 transition-colors" title="Suspend" style={{ color: "#f59e0b" }}><PauseCircle size={13} /></button>
                )}
                {seller.status === "Suspended" && (
                  <button onClick={() => updateStatus(seller.id, "Active")} className="p-1 rounded hover:bg-white/10 transition-colors" title="Reinstate" style={{ color: "#10b981" }}><CheckCircle size={13} /></button>
                )}
                <button onClick={() => setConfirmAction({ seller, action: "delete" })} className="p-1 rounded hover:bg-white/10 transition-colors" title="Delete" style={{ color: "#ef4444" }}><Trash2 size={13} /></button>
              </div>
            </TD>
          </TR>
        ))}
      </Table>

      {/* View Seller Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Seller Details — ${selected?.id}`} width={560}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded flex items-center justify-center text-xl font-bold" style={{ background: "var(--primary)", color: "#fff" }}>{selected.logo}</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{selected.name}</h3>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{selected.business} · Joined {selected.joined}</p>
                <Badge label={selected.status} color={statusColor[selected.status]} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Products" value={selected.products} color="#0ea5e9" />
              <StatCard label="Orders" value={selected.orders} color="#10b981" />
              <StatCard label="Revenue" value={selected.revenue} color="#06b6d4" />
            </div>

            <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <h4 className="mb-2" style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Verification Status</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Trade License", ok: selected.tradeLicense },
                  { label: "NID Verified", ok: selected.nidVerified },
                  { label: "Bank Verified", ok: selected.bankVerified },
                ].map(v => (
                  <div key={v.label} className="flex items-center gap-2">
                    {v.ok ? <CheckCircle size={13} style={{ color: "#10b981" }} /> : <XCircle size={13} style={{ color: "#ef4444" }} />}
                    <span style={{ fontSize: 12, color: "var(--foreground)" }}>{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Email</span><p style={{ fontSize: 12, color: "var(--foreground)" }}>{selected.email}</p></div>
              <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Phone</span><p style={{ fontSize: 12, color: "var(--foreground)" }}>{selected.phone}</p></div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {selected.status === "Pending" && <Btn variant="success" size="sm" onClick={() => updateStatus(selected.id, "Active")}><CheckCircle size={13} /> Approve</Btn>}
              {selected.status === "Pending" && <Btn variant="danger" size="sm" onClick={() => updateStatus(selected.id, "Rejected")}><XCircle size={13} /> Reject</Btn>}
              {selected.status === "Active" && <Btn variant="warning" size="sm" onClick={() => updateStatus(selected.id, "Suspended")}><PauseCircle size={13} /> Suspend</Btn>}
              {selected.status === "Suspended" && <Btn variant="success" size="sm" onClick={() => updateStatus(selected.id, "Active")}><CheckCircle size={13} /> Reinstate</Btn>}
              <Btn variant="secondary" size="sm" onClick={() => { setMsgModal(selected); setSelected(null); }}><MessageSquare size={13} /> Message</Btn>
              <Btn variant="ghost" size="sm" onClick={() => setSelected(null)}><Store size={13} /> View Store</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Message Modal */}
      <Modal open={!!msgModal} onClose={() => setMsgModal(null)} title={`Message — ${msgModal?.name}`}>
        {msgModal && (
          <div className="flex flex-col gap-3">
            <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>To: {msgModal.email}</p>
            <Input label="Subject" placeholder="Message subject..." />
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Message</label>
              <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..."
                className="px-3 py-2 rounded outline-none resize-none"
                style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13 }} />
            </div>
            {msgSent ? (
              <div className="px-3 py-2 rounded text-center" style={{ background: "#10b98120", color: "#10b981", fontSize: 13 }}>✓ Message sent!</div>
            ) : (
              <div className="flex gap-2 justify-end">
                <Btn variant="ghost" onClick={() => setMsgModal(null)}>Cancel</Btn>
                <Btn onClick={sendMessage}><MessageSquare size={13} /> Send</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirm Action Modal */}
      <Modal open={!!confirmAction} onClose={() => setConfirmAction(null)} title="Confirm Action">
        {confirmAction && (
          <div className="flex flex-col gap-4">
            <p style={{ fontSize: 13, color: "var(--foreground)" }}>
              {confirmAction.action === "approve" && `Approve seller "${confirmAction.seller.name}"? This will allow them to sell on the marketplace.`}
              {confirmAction.action === "suspend" && `Suspend seller "${confirmAction.seller.name}"? They will not be able to sell until reinstated.`}
              {confirmAction.action === "delete" && `Permanently delete seller "${confirmAction.seller.name}"? This cannot be undone.`}
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setConfirmAction(null)}>Cancel</Btn>
              {confirmAction.action === "approve" && <Btn variant="success" onClick={() => updateStatus(confirmAction.seller.id, "Active")}>Approve</Btn>}
              {confirmAction.action === "suspend" && <Btn variant="warning" onClick={() => updateStatus(confirmAction.seller.id, "Suspended")}>Suspend</Btn>}
              {confirmAction.action === "delete" && <Btn variant="danger" onClick={() => deleteSeller(confirmAction.seller.id)}>Delete</Btn>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

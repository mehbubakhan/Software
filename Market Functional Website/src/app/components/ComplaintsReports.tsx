import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, StatCard } from "./Modal";

type ComplaintStatus = "Open" | "Under Review" | "Resolved" | "Closed" | "Escalated";
type Priority = "High" | "Medium" | "Low" | "Critical";
type ComplaintType = "Unsafe Product" | "Fake Product" | "Wrong Delivery" | "Damaged Product" | "Fraud Seller";

interface Complaint {
  id: string;
  type: ComplaintType;
  reporter: string;
  seller: string;
  product: string;
  priority: Priority;
  status: ComplaintStatus;
  date: string;
  description: string;
}

const initComplaints: Complaint[] = [
  { id: "CMP-001", type: "Unsafe Product", reporter: "Fatima Rahman", seller: "SafeBaby Shop", product: "Baby Safety Gate", priority: "Critical", status: "Open", date: "2026-06-04", description: "Gate collapsed causing minor injury to child. Product does not meet safety standards." },
  { id: "CMP-002", type: "Fake Product", reporter: "Karim Hossain", seller: "Tiny Tots Store", product: "Plush Teddy Bear", priority: "High", status: "Under Review", date: "2026-06-03", description: "Product received is clearly counterfeit. Brand logo is different from advertised." },
  { id: "CMP-003", type: "Wrong Delivery", reporter: "Nasrin Akter", seller: "KidGear Emporium", product: "Galaxy Backpack", priority: "Medium", status: "Under Review", date: "2026-06-03", description: "Received blue backpack instead of the red one ordered." },
  { id: "CMP-004", type: "Damaged Product", reporter: "Rahim Mia", seller: "KidsCraft Ltd.", product: "Learning Blocks", priority: "Low", status: "Resolved", date: "2026-06-01", description: "Box was torn and several blocks were missing from the set." },
  { id: "CMP-005", type: "Fraud Seller", reporter: "Shirin Begum", seller: "Unknown Seller", product: "Baby Diapers", priority: "Critical", status: "Escalated", date: "2026-06-02", description: "Seller collected payment but never shipped. Account appears to be fraudulent." },
  { id: "CMP-006", type: "Unsafe Product", reporter: "Jabbar Ali", seller: "BabyWorld BD", product: "Baby Bottle", priority: "High", status: "Open", date: "2026-06-04", description: "BPA found in bottles. Several customers reported chemical taste." },
];

const statusColor: Record<ComplaintStatus, string> = { Open: "red", "Under Review": "yellow", Resolved: "green", Closed: "gray", Escalated: "orange" };
const priorityColor: Record<Priority, string> = { Critical: "red", High: "orange", Medium: "yellow", Low: "blue" };
const typeColor: Record<ComplaintType, string> = { "Unsafe Product": "red", "Fake Product": "orange", "Wrong Delivery": "yellow", "Damaged Product": "blue", "Fraud Seller": "red" };

export function ComplaintsReports() {
  const [complaints, setComplaints] = useState<Complaint[]>(initComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote] = useState("");
  const [actionDone, setActionDone] = useState("");

  function updateStatus(id: string, status: ComplaintStatus) {
    setComplaints(c => c.map(x => x.id === id ? { ...x, status } : x));
    setActionDone(`Status updated to ${status}`);
    setTimeout(() => setActionDone(""), 2000);
    setSelected(null);
  }

  const filtered = complaints.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(search.toLowerCase()) || c.reporter.toLowerCase().includes(search.toLowerCase()) || c.seller.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Complaints & Reports" subtitle="Customer safety and fraud management" />

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <StatCard label="Total Complaints" value={complaints.length} color="#0ea5e9" />
        <StatCard label="Open" value={complaints.filter(c => c.status === "Open").length} color="#ef4444" />
        <StatCard label="Under Review" value={complaints.filter(c => c.status === "Under Review").length} color="#f59e0b" />
        <StatCard label="Escalated" value={complaints.filter(c => c.status === "Escalated").length} color="#f97316" />
        <StatCard label="Resolved" value={complaints.filter(c => c.status === "Resolved").length} color="#10b981" />
      </div>

      {/* Critical Alerts */}
      {complaints.filter(c => c.priority === "Critical" && c.status !== "Closed").length > 0 && (
        <div className="rounded p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.4)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: "#ef4444" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#ef4444" }}>Critical Complaints Require Immediate Action</span>
          </div>
          {complaints.filter(c => c.priority === "Critical" && c.status !== "Closed").map(c => (
            <div key={c.id} className="flex items-center justify-between py-1">
              <span style={{ fontSize: 12, color: "#fca5a5" }}>{c.id} — {c.description.slice(0, 60)}...</span>
              <Btn size="sm" variant="danger" onClick={() => setSelected(c)}>Review Now</Btn>
            </div>
          ))}
        </div>
      )}

      {actionDone && (
        <div className="px-3 py-2 rounded" style={{ background: "#10b98120", color: "#10b981", fontSize: 13 }}>✓ {actionDone}</div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded flex-1 min-w-[200px]" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
        </div>
        {["All", "Open", "Under Review", "Resolved", "Closed", "Escalated"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className="px-2.5 py-1.5 rounded text-xs transition-colors"
            style={{ background: filterStatus === s ? "var(--primary)" : "var(--muted)", color: filterStatus === s ? "#fff" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>
            {s}
          </button>
        ))}
      </div>

      <Table headers={["ID", "Type", "Reporter", "Seller", "Product", "Priority", "Status", "Date", "Actions"]}>
        {filtered.map(c => (
          <TR key={c.id} onClick={() => setSelected(c)}>
            <TD mono>{c.id}</TD>
            <TD><Badge label={c.type} color={typeColor[c.type]} /></TD>
            <TD>{c.reporter}</TD>
            <TD>{c.seller}</TD>
            <TD>{c.product}</TD>
            <TD><Badge label={c.priority} color={priorityColor[c.priority]} /></TD>
            <TD><Badge label={c.status} color={statusColor[c.status]} /></TD>
            <TD mono>{c.date}</TD>
            <TD>
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <Btn size="sm" variant="secondary" onClick={() => setSelected(c)}>Review</Btn>
              </div>
            </TD>
          </TR>
        ))}
      </Table>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Complaint — ${selected?.id}`} width={540}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge label={selected.type} color={typeColor[selected.type]} />
              <Badge label={selected.priority} color={priorityColor[selected.priority]} />
              <Badge label={selected.status} color={statusColor[selected.status]} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Reporter</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{selected.reporter}</p>
              </div>
              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Accused Seller</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{selected.seller}</p>
              </div>
            </div>

            <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Product: <span style={{ color: "var(--foreground)" }}>{selected.product}</span></p>
              <p className="mt-2" style={{ fontSize: 13, color: "var(--foreground)" }}>{selected.description}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Resolution Note</label>
              <textarea rows={3} value={resolveNote} onChange={e => setResolveNote(e.target.value)} placeholder="Add resolution note..."
                className="px-3 py-2 rounded outline-none resize-none"
                style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13 }} />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Btn size="sm" variant="warning" onClick={() => updateStatus(selected.id, "Under Review")}>Warn Seller</Btn>
              <Btn size="sm" variant="danger" onClick={() => updateStatus(selected.id, "Escalated")}>Suspend Seller</Btn>
              <Btn size="sm" variant="success" onClick={() => updateStatus(selected.id, "Resolved")}>Refund Customer</Btn>
              <Btn size="sm" variant="ghost" onClick={() => updateStatus(selected.id, "Closed")}>Close Complaint</Btn>
              <Btn size="sm" variant="secondary" onClick={() => updateStatus(selected.id, "Escalated")}>Forward to Admin</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

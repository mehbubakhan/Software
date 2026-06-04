import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import { Search, Truck, RefreshCw, RotateCcw } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, Select, StatCard } from "./Modal";

type DeliveryStatus = "Awaiting Pickup" | "Picked Up" | "In Transit" | "Out for Delivery" | "Delivered" | "Failed" | "Returned";
type Courier = "Pathao" | "RedX" | "Sundarban" | "Steadfast";

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  courier: Courier;
  trackingId: string;
  status: DeliveryStatus;
  estimatedDate: string;
  weight: string;
}

const initDeliveries: Delivery[] = [
  { id: "DEL-001", orderId: "ORD-2891", customer: "Fatima Rahman", address: "Dhaka, Gulshan-2", courier: "Pathao", trackingId: "PT2891004567", status: "In Transit", estimatedDate: "2026-06-05", weight: "1.2 kg" },
  { id: "DEL-002", orderId: "ORD-2889", customer: "Nasrin Akter", address: "Sylhet, Amberkhana", courier: "Steadfast", trackingId: "SF2889003456", status: "Out for Delivery", estimatedDate: "2026-06-04", weight: "0.8 kg" },
  { id: "DEL-003", orderId: "ORD-2887", customer: "Shirin Begum", address: "Dhaka, Mirpur-10", courier: "RedX", trackingId: "RX2887002345", status: "Picked Up", estimatedDate: "2026-06-06", weight: "2.1 kg" },
  { id: "DEL-004", orderId: "ORD-2884", customer: "Tariq Ahmed", address: "Rajshahi, Boalia", courier: "Sundarban", trackingId: "SB2884001234", status: "Awaiting Pickup", estimatedDate: "2026-06-07", weight: "0.5 kg" },
  { id: "DEL-005", orderId: "ORD-2882", customer: "Ruhul Amin", address: "Dhaka, Badda", courier: "Pathao", trackingId: "PT2882009876", status: "Delivered", estimatedDate: "2026-06-03", weight: "3.0 kg" },
  { id: "DEL-006", orderId: "ORD-2878", customer: "Zubair Khan", address: "Comilla, Kotbari", courier: "RedX", trackingId: "RX2878008765", status: "Failed", estimatedDate: "2026-06-02", weight: "1.5 kg" },
];

const statusColor: Record<DeliveryStatus, string> = {
  "Awaiting Pickup": "gray", "Picked Up": "blue", "In Transit": "cyan", "Out for Delivery": "yellow",
  "Delivered": "green", "Failed": "red", "Returned": "orange"
};

const courierColors: Record<Courier, string> = { Pathao: "#0ea5e9", RedX: "#ef4444", Sundarban: "#f59e0b", Steadfast: "#10b981" };
const allStatuses: DeliveryStatus[] = ["Awaiting Pickup", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Failed", "Returned"];

export function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Delivery | null>(null);
  const [assignModal, setAssignModal] = useState<Delivery | null>(null);
  const [newCourier, setNewCourier] = useState<Courier>("Pathao");
  const [updateModal, setUpdateModal] = useState<Delivery | null>(null);
  const [newStatus, setNewStatus] = useState<DeliveryStatus>("In Transit");

  useEffect(() => {
    api.get("/marketplace/admin/deliveries").then(res => {
      setDeliveries(res.data.data || res.data || []);
    }).catch(console.error);
  }, []);

  function assignCourier() {
    if (assignModal) {
      setDeliveries(d => d.map(x => x.id === assignModal.id ? { ...x, courier: newCourier } : x));
      setAssignModal(null);
    }
  }

  function updateStatus() {
    if (updateModal) {
      setDeliveries(d => d.map(x => x.id === updateModal.id ? { ...x, status: newStatus } : x));
      setUpdateModal(null);
    }
  }

  function approveReturn(id: string) {
    setDeliveries(d => d.map(x => x.id === id ? { ...x, status: "Returned" } : x));
    setSelected(null);
  }

  const filtered = deliveries.filter(d =>
    d.orderId.toLowerCase().includes(search.toLowerCase()) ||
    d.customer.toLowerCase().includes(search.toLowerCase()) ||
    d.trackingId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Delivery Management" subtitle="Track all shipments and couriers" />

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <StatCard label="Total Shipments" value={deliveries.length} color="#0ea5e9" />
        <StatCard label="In Transit" value={deliveries.filter(d => ["In Transit", "Out for Delivery", "Picked Up"].includes(d.status)).length} color="#06b6d4" />
        <StatCard label="Delivered" value={deliveries.filter(d => d.status === "Delivered").length} color="#10b981" />
        <StatCard label="Failed" value={deliveries.filter(d => d.status === "Failed").length} color="#ef4444" />
        <StatCard label="Awaiting Pickup" value={deliveries.filter(d => d.status === "Awaiting Pickup").length} color="#f59e0b" />
      </div>

      {/* Courier Summary */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {(["Pathao", "RedX", "Sundarban", "Steadfast"] as Courier[]).map(c => (
          <div key={c} className="rounded p-3" style={{ background: "var(--card)", border: `1px solid ${courierColors[c]}40` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: courierColors[c] }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: courierColors[c] }}>{c}</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: courierColors[c], fontFamily: "monospace" }}>
              {deliveries.filter(d => d.courier === c).length}
            </span>
            <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>active shipments</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded flex-1" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order, customer, or tracking ID..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
        </div>
      </div>

      <Table headers={["DEL ID", "Order", "Customer", "Courier", "Tracking ID", "Status", "ETA", "Weight", "Actions"]}>
        {filtered.map(del => (
          <TR key={del.id} onClick={() => setSelected(del)}>
            <TD mono>{del.id}</TD>
            <TD mono>{del.orderId}</TD>
            <TD>{del.customer}</TD>
            <TD>
              <span style={{ fontSize: 11, fontWeight: 600, color: courierColors[del.courier] }}>{del.courier}</span>
            </TD>
            <TD mono>{del.trackingId}</TD>
            <TD><Badge label={del.status} color={statusColor[del.status]} /></TD>
            <TD mono>{del.estimatedDate}</TD>
            <TD mono>{del.weight}</TD>
            <TD>
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <Btn size="sm" variant="secondary" onClick={() => { setUpdateModal(del); setNewStatus(del.status); }}><RefreshCw size={11} /> Status</Btn>
                <Btn size="sm" variant="ghost" onClick={() => { setAssignModal(del); setNewCourier(del.courier); }}>Assign</Btn>
              </div>
            </TD>
          </TR>
        ))}
      </Table>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Delivery Details — ${selected?.id}`} width={500}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Order</p>
                <p style={{ fontSize: 13, fontFamily: "monospace", color: "var(--foreground)", fontWeight: 600 }}>{selected.orderId}</p>
                <p style={{ fontSize: 12, color: "var(--foreground)" }}>{selected.customer}</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{selected.address}</p>
              </div>
              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Courier</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: courierColors[selected.courier] }}>{selected.courier}</p>
                <p style={{ fontSize: 12, fontFamily: "monospace", color: "var(--foreground)" }}>{selected.trackingId}</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>ETA: {selected.estimatedDate}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge label={selected.status} color={statusColor[selected.status]} />
              <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Weight: {selected.weight}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Btn size="sm" variant="secondary" onClick={() => { setUpdateModal(selected); setNewStatus(selected.status); setSelected(null); }}><RefreshCw size={13} /> Update Status</Btn>
              <Btn size="sm" variant="ghost" onClick={() => { setAssignModal(selected); setNewCourier(selected.courier); setSelected(null); }}><Truck size={13} /> Reassign Courier</Btn>
              <Btn size="sm" variant="warning" onClick={() => approveReturn(selected.id)}><RotateCcw size={13} /> Approve Return</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal open={!!updateModal} onClose={() => setUpdateModal(null)} title="Update Delivery Status">
        {updateModal && (
          <div className="flex flex-col gap-3">
            <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value as DeliveryStatus)}
              options={allStatuses.map(s => ({ value: s, label: s }))} />
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setUpdateModal(null)}>Cancel</Btn>
              <Btn onClick={updateStatus}><RefreshCw size={13} /> Update</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Courier Modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Courier">
        {assignModal && (
          <div className="flex flex-col gap-3">
            <Select label="Courier" value={newCourier} onChange={e => setNewCourier(e.target.value as Courier)}
              options={["Pathao", "RedX", "Sundarban", "Steadfast"].map(c => ({ value: c, label: c }))} />
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setAssignModal(null)}>Cancel</Btn>
              <Btn onClick={assignCourier}><Truck size={13} /> Assign</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

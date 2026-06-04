import { useState } from "react";
import { Search, Eye, Printer, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, Select, StatCard } from "./Modal";

type OrderStatus = "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
type PaymentStatus = "Paid" | "Pending" | "Refunded";

interface Order {
  id: string;
  customer: string;
  seller: string;
  products: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: OrderStatus;
  amount: string;
  date: string;
  phone: string;
  address: string;
}

const initOrders: Order[] = [
  { id: "ORD-2891", customer: "Fatima Rahman", seller: "BabyWorld BD", products: "Baby Bottle Set x2, Toy Cars", paymentStatus: "Paid", deliveryStatus: "Shipped", amount: "৳2,700", date: "2026-06-04", phone: "01711-111222", address: "Dhaka, Gulshan-2" },
  { id: "ORD-2890", customer: "Karim Hossain", seller: "KidsCraft Ltd.", products: "Learning Blocks Set", paymentStatus: "Paid", deliveryStatus: "Delivered", amount: "৳850", date: "2026-06-03", phone: "01822-222333", address: "Chittagong, Nasirabad" },
  { id: "ORD-2889", customer: "Nasrin Akter", seller: "KidGear Emporium", products: "Galaxy Backpack x1", paymentStatus: "Paid", deliveryStatus: "Confirmed", amount: "৳1,450", date: "2026-06-03", phone: "01933-333444", address: "Sylhet, Amberkhana" },
  { id: "ORD-2888", customer: "Rahim Mia", seller: "Tiny Tots Store", products: "Plush Bear XL x3", paymentStatus: "Pending", deliveryStatus: "Pending", amount: "৳2,250", date: "2026-06-02", phone: "01644-444555", address: "Rajshahi, Boalia" },
  { id: "ORD-2887", customer: "Shirin Begum", seller: "BabyWorld BD", products: "Baby Diapers 50pc x2", paymentStatus: "Paid", deliveryStatus: "Packed", amount: "৳1,600", date: "2026-06-02", phone: "01755-555666", address: "Dhaka, Mirpur-10" },
  { id: "ORD-2886", customer: "Jabbar Ali", seller: "NurtureTech BD", products: "Learning Tablet x1", paymentStatus: "Refunded", deliveryStatus: "Refunded", amount: "৳4,500", date: "2026-06-01", phone: "01866-666777", address: "Khulna, Sonadanga" },
  { id: "ORD-2885", customer: "Parveen Sultana", seller: "SafeBaby Shop", products: "Safety Gate x1", paymentStatus: "Paid", deliveryStatus: "Cancelled", amount: "৳3,200", date: "2026-05-31", phone: "01977-777888", address: "Barisal, Nathullabad" },
];

const statusColor: Record<OrderStatus, string> = {
  Pending: "yellow", Confirmed: "blue", Packed: "cyan", Shipped: "orange", Delivered: "green", Cancelled: "red", Refunded: "gray"
};
const payColor: Record<PaymentStatus, string> = { Paid: "green", Pending: "yellow", Refunded: "gray" };

const allStatuses: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled", "Refunded"];

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(initOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updateModal, setUpdateModal] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("Confirmed");
  const [invoicePrinted, setInvoicePrinted] = useState<string | null>(null);

  function updateStatus() {
    if (updateModal) {
      setOrders(o => o.map(x => x.id === updateModal.id ? { ...x, deliveryStatus: newStatus } : x));
      setUpdateModal(null);
    }
  }

  function cancelOrder(id: string) {
    setOrders(o => o.map(x => x.id === id ? { ...x, deliveryStatus: "Cancelled" } : x));
    setSelected(null);
  }

  function approveRefund(id: string) {
    setOrders(o => o.map(x => x.id === id ? { ...x, deliveryStatus: "Refunded", paymentStatus: "Refunded" } : x));
    setSelected(null);
  }

  function printInvoice(id: string) {
    setInvoicePrinted(id);
    setTimeout(() => setInvoicePrinted(null), 2000);
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.deliveryStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Orders Management" subtitle={`${orders.length} total orders`} />

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <StatCard label="Total Orders" value={orders.length} color="#0ea5e9" />
        <StatCard label="Pending" value={orders.filter(o => o.deliveryStatus === "Pending").length} color="#f59e0b" />
        <StatCard label="In Transit" value={orders.filter(o => ["Packed", "Shipped"].includes(o.deliveryStatus)).length} color="#06b6d4" />
        <StatCard label="Delivered" value={orders.filter(o => o.deliveryStatus === "Delivered").length} color="#10b981" />
        <StatCard label="Cancelled/Refunded" value={orders.filter(o => ["Cancelled", "Refunded"].includes(o.deliveryStatus)).length} color="#ef4444" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded flex-1 min-w-[200px]" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
        </div>
        {["All", ...allStatuses].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className="px-2.5 py-1.5 rounded text-xs transition-colors"
            style={{ background: filterStatus === s ? "var(--primary)" : "var(--muted)", color: filterStatus === s ? "#fff" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>
            {s}
          </button>
        ))}
      </div>

      <Table headers={["Order ID", "Customer", "Seller", "Products", "Payment", "Status", "Amount", "Date", "Actions"]}>
        {filtered.map(order => (
          <TR key={order.id} onClick={() => setSelected(order)}>
            <TD mono>{order.id}</TD>
            <TD>{order.customer}</TD>
            <TD>{order.seller}</TD>
            <TD><span style={{ maxWidth: 160, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}>{order.products}</span></TD>
            <TD><Badge label={order.paymentStatus} color={payColor[order.paymentStatus]} /></TD>
            <TD><Badge label={order.deliveryStatus} color={statusColor[order.deliveryStatus]} /></TD>
            <TD mono>{order.amount}</TD>
            <TD mono>{order.date}</TD>
            <TD>
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelected(order)} className="p-1 rounded hover:bg-white/10" style={{ color: "#0ea5e9" }} title="View"><Eye size={12} /></button>
                <button onClick={() => { setUpdateModal(order); setNewStatus(order.deliveryStatus); }} className="p-1 rounded hover:bg-white/10" style={{ color: "#06b6d4" }} title="Update Status"><RefreshCw size={12} /></button>
                <button onClick={() => printInvoice(order.id)} className="p-1 rounded hover:bg-white/10" style={{ color: invoicePrinted === order.id ? "#10b981" : "#94a3b8" }} title="Print Invoice"><Printer size={12} /></button>
              </div>
            </TD>
          </TR>
        ))}
      </Table>

      {/* Order Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order Details — ${selected?.id}`} width={540}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Customer</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{selected.customer}</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{selected.phone}</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{selected.address}</p>
              </div>
              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Seller</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{selected.seller}</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Order Date: {selected.date}</p>
              </div>
            </div>
            <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Products</p>
              <p style={{ fontSize: 13, color: "var(--foreground)" }}>{selected.products}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <StatCard label="Amount" value={selected.amount} color="#10b981" />
              <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment</p>
                <Badge label={selected.paymentStatus} color={payColor[selected.paymentStatus]} />
              </div>
              <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</p>
                <Badge label={selected.deliveryStatus} color={statusColor[selected.deliveryStatus]} />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Btn size="sm" variant="secondary" onClick={() => { setUpdateModal(selected); setNewStatus(selected.deliveryStatus); setSelected(null); }}><RefreshCw size={13} /> Update Status</Btn>
              <Btn size="sm" variant="ghost" onClick={() => cancelOrder(selected.id)}><XCircle size={13} /> Cancel</Btn>
              <Btn size="sm" variant="success" onClick={() => approveRefund(selected.id)}><CheckCircle size={13} /> Approve Refund</Btn>
              <Btn size="sm" variant="ghost" onClick={() => printInvoice(selected.id)}><Printer size={13} /> {invoicePrinted === selected.id ? "Printed!" : "Print Invoice"}</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal open={!!updateModal} onClose={() => setUpdateModal(null)} title={`Update Status — ${updateModal?.id}`}>
        {updateModal && (
          <div className="flex flex-col gap-3">
            <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Current status: <Badge label={updateModal.deliveryStatus} color={statusColor[updateModal.deliveryStatus]} /></p>
            <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value as OrderStatus)}
              options={allStatuses.map(s => ({ value: s, label: s }))} />
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setUpdateModal(null)}>Cancel</Btn>
              <Btn onClick={updateStatus}><RefreshCw size={13} /> Update</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

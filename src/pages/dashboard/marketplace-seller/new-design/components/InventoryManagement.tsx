import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import { Search, AlertTriangle, RefreshCw, Download } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, Input, StatCard } from "./Modal";

interface InventoryItem {
  id: string;
  product: string;
  seller: string;
  total: number;
  sold: number;
  remaining: number;
  returned: number;
  warehouse: string;
  lowStockAlert: boolean;
}

const initInventory: InventoryItem[] = [
  { id: "INV-001", product: "Wooden Learning Blocks Set", seller: "KidsCraft Ltd.", total: 200, sold: 156, remaining: 44, returned: 3, warehouse: "WH-A", lowStockAlert: false },
  { id: "INV-002", product: "Premium Toy Car Collection", seller: "BabyWorld BD", total: 500, sold: 350, remaining: 150, returned: 5, warehouse: "WH-B", lowStockAlert: false },
  { id: "INV-003", product: "Baby Bottle Set", seller: "BabyWorld BD", total: 800, sold: 640, remaining: 160, returned: 12, warehouse: "WH-A", lowStockAlert: false },
  { id: "INV-004", product: "Soft Plush Teddy Bear XL", seller: "Tiny Tots Store", total: 400, sold: 390, remaining: 10, returned: 2, warehouse: "WH-C", lowStockAlert: true },
  { id: "INV-005", product: "Children's Backpack Galaxy", seller: "KidGear Emporium", total: 300, sold: 210, remaining: 90, returned: 4, warehouse: "WH-B", lowStockAlert: false },
  { id: "INV-006", product: "Baby Diapers Pack 50", seller: "BabyWorld BD", total: 1000, sold: 995, remaining: 5, returned: 0, warehouse: "WH-A", lowStockAlert: true },
  { id: "INV-007", product: "Interactive Learning Tablet", seller: "NurtureTech BD", total: 60, sold: 29, remaining: 31, returned: 1, warehouse: "WH-D", lowStockAlert: false },
  { id: "INV-008", product: "Baby Safety Gate", seller: "SafeBaby Shop", total: 80, sold: 34, remaining: 46, returned: 6, warehouse: "WH-C", lowStockAlert: false },
];

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [updateModal, setUpdateModal] = useState<InventoryItem | null>(null);
  const [addStock, setAddStock] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    api.get("/marketplace/seller/products").then(res => {
      const prods = res.data.data || res.data || [];
      const mapped = prods.map((p: any) => ({
        id: p.id,
        product: p.name,
        seller: p.seller || "Own Brand",
        total: p.stock || 0,
        sold: p.sold || 0,
        remaining: p.remaining !== undefined ? p.remaining : (p.stock - (p.sold || 0)) || 0,
        returned: p.returned || 0,
        warehouse: p.warehouse || "WH-A",
        lowStockAlert: (p.remaining !== undefined ? p.remaining : (p.stock - (p.sold || 0))) < 15
      }));
      setInventory(mapped);
    }).catch(console.error);
  }, []);

  function updateStock() {
    if (updateModal && addStock) {
      const qty = parseInt(addStock);
      if (!isNaN(qty)) {
        setInventory(inv => inv.map(x => x.id === updateModal.id
          ? { ...x, total: x.total + qty, remaining: x.remaining + qty, lowStockAlert: (x.remaining + qty) < 15 }
          : x
        ));
      }
      setUpdateModal(null);
      setAddStock("");
    }
  }

  function markOutOfStock(id: string) {
    setInventory(inv => inv.map(x => x.id === id ? { ...x, remaining: 0, lowStockAlert: true } : x));
  }

  function generateReport() {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 2000);
  }

  const filtered = inventory.filter(i =>
    i.product.toLowerCase().includes(search.toLowerCase()) || i.seller.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = inventory.filter(i => i.lowStockAlert || i.remaining < 15);

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Inventory Management" subtitle="Real-time stock tracking across all warehouses"
        actions={
          <Btn size="sm" onClick={generateReport} variant={reportGenerated ? "success" : "primary"}>
            <Download size={13} /> {reportGenerated ? "Report Generated!" : "Generate Report"}
          </Btn>
        }
      />

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard label="Total SKUs" value={inventory.length} color="#0ea5e9" />
        <StatCard label="Total Units" value={inventory.reduce((a, i) => a + i.total, 0).toLocaleString()} color="#06b6d4" />
        <StatCard label="Units Sold" value={inventory.reduce((a, i) => a + i.sold, 0).toLocaleString()} color="#10b981" />
        <StatCard label="Low Stock Alerts" value={lowStockItems.length} color="#ef4444" />
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="rounded p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: "#ef4444" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#ef4444" }}>Low Stock Alerts</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center gap-2 px-2.5 py-1 rounded" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <span style={{ fontSize: 11, color: "#fca5a5" }}>Only <strong style={{ color: "#ef4444" }}>{item.remaining}</strong> units of {item.product}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded flex-1" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
        </div>
      </div>

      <Table headers={["INV ID", "Product", "Seller", "Total", "Sold", "Remaining", "Returned", "Warehouse", "Alert", "Actions"]}>
        {filtered.map(item => {
          const pct = Math.round((item.remaining / item.total) * 100);
          return (
            <TR key={item.id}>
              <TD mono>{item.id}</TD>
              <TD><span style={{ fontSize: 12, fontWeight: 600 }}>{item.product}</span></TD>
              <TD>{item.seller}</TD>
              <TD mono>{item.total}</TD>
              <TD mono>{item.sold}</TD>
              <TD>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: item.remaining < 15 ? "#ef4444" : "inherit" }}>{item.remaining}</span>
                  <div className="w-16 h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: pct < 20 ? "#ef4444" : pct < 40 ? "#f59e0b" : "#10b981" }} />
                  </div>
                </div>
              </TD>
              <TD mono>{item.returned}</TD>
              <TD><span style={{ fontSize: 11, fontFamily: "monospace" }}>{item.warehouse}</span></TD>
              <TD>{item.lowStockAlert || item.remaining < 15 ? <Badge label="LOW STOCK" color="red" /> : <Badge label="OK" color="green" />}</TD>
              <TD>
                <div className="flex gap-1">
                  <Btn size="sm" variant="secondary" onClick={() => setUpdateModal(item)}><RefreshCw size={11} /> Update</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => markOutOfStock(item.id)}>Mark OOS</Btn>
                </div>
              </TD>
            </TR>
          );
        })}
      </Table>

      {/* Update Stock Modal */}
      <Modal open={!!updateModal} onClose={() => setUpdateModal(null)} title={`Update Stock — ${updateModal?.product}`}>
        {updateModal && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              <StatCard label="Current Total" value={updateModal.total} color="#0ea5e9" />
              <StatCard label="Remaining" value={updateModal.remaining} color={updateModal.remaining < 15 ? "#ef4444" : "#10b981"} />
              <StatCard label="Sold" value={updateModal.sold} color="#06b6d4" />
            </div>
            <Input label="Add Stock Quantity" type="number" value={addStock} onChange={e => setAddStock(e.target.value)} placeholder="Enter quantity to add..." />
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setUpdateModal(null)}>Cancel</Btn>
              <Btn onClick={updateStock}><RefreshCw size={13} /> Update Stock</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

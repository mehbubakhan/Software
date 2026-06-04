import { useState } from "react";
import { CheckCircle, XCircle, Download } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, StatCard } from "./Modal";

type WithdrawStatus = "Pending" | "Approved" | "Rejected";
type PayMethod = "bKash" | "Nagad" | "Bank Transfer";

interface WithdrawRequest {
  id: string;
  seller: string;
  amount: string;
  method: PayMethod;
  status: WithdrawStatus;
  requestDate: string;
  accountInfo: string;
}

interface Transaction {
  id: string;
  type: "Sale" | "Commission" | "Refund" | "Withdrawal";
  seller: string;
  orderRef: string;
  amount: string;
  commission: string;
  sellerEarning: string;
  date: string;
}

const initRequests: WithdrawRequest[] = [
  { id: "WR-001", seller: "BabyWorld BD", amount: "৳45,000", method: "bKash", status: "Pending", requestDate: "2026-06-04", accountInfo: "bKash: 01711-234567" },
  { id: "WR-002", seller: "KidGear Emporium", amount: "৳78,500", method: "Bank Transfer", status: "Pending", requestDate: "2026-06-03", accountInfo: "BRAC Bank: 180*****2341" },
  { id: "WR-003", seller: "KidsCraft Ltd.", amount: "৳12,200", method: "Nagad", status: "Approved", requestDate: "2026-06-02", accountInfo: "Nagad: 01933-456789" },
  { id: "WR-004", seller: "Tiny Tots Store", amount: "৳8,900", method: "bKash", status: "Rejected", requestDate: "2026-06-01", accountInfo: "bKash: 01822-345678" },
];

const transactions: Transaction[] = [
  { id: "TXN-9001", type: "Sale", seller: "BabyWorld BD", orderRef: "ORD-2891", amount: "৳2,700", commission: "৳270", sellerEarning: "৳2,430", date: "2026-06-04" },
  { id: "TXN-9002", type: "Sale", seller: "KidsCraft Ltd.", orderRef: "ORD-2890", amount: "৳850", commission: "৳85", sellerEarning: "৳765", date: "2026-06-03" },
  { id: "TXN-9003", type: "Refund", seller: "NurtureTech BD", orderRef: "ORD-2886", amount: "৳4,500", commission: "-৳450", sellerEarning: "-৳4,050", date: "2026-06-01" },
  { id: "TXN-9004", type: "Sale", seller: "KidGear Emporium", orderRef: "ORD-2889", amount: "৳1,450", commission: "৳145", sellerEarning: "৳1,305", date: "2026-06-03" },
  { id: "TXN-9005", type: "Commission", seller: "BabyWorld BD", orderRef: "ORD-2887", amount: "৳1,600", commission: "৳160", sellerEarning: "৳1,440", date: "2026-06-02" },
];

const statusColor: Record<WithdrawStatus, string> = { Pending: "yellow", Approved: "green", Rejected: "red" };
const txTypeColor: Record<string, string> = { Sale: "green", Commission: "cyan", Refund: "red", Withdrawal: "blue" };

export function PaymentCommission() {
  const [requests, setRequests] = useState<WithdrawRequest[]>(initRequests);
  const [selected, setSelected] = useState<WithdrawRequest | null>(null);
  const [commissionRate, setCommissionRate] = useState(10);
  const [reportGenerated, setReportGenerated] = useState(false);

  function updateRequest(id: string, status: WithdrawStatus) {
    setRequests(r => r.map(x => x.id === id ? { ...x, status } : x));
    setSelected(null);
  }

  const totalRevenue = "৳8,24,000";
  const totalCommission = "৳82,400";
  const pendingWithdrawals = requests.filter(r => r.status === "Pending").reduce((a) => a + 1, 0);

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Payments & Commission" subtitle={`${commissionRate}% admin commission rate`}
        actions={
          <Btn size="sm" variant={reportGenerated ? "success" : "primary"} onClick={() => { setReportGenerated(true); setTimeout(() => setReportGenerated(false), 2000); }}>
            <Download size={13} /> {reportGenerated ? "Generated!" : "Revenue Report"}
          </Btn>
        }
      />

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard label="Total Revenue" value={totalRevenue} color="#10b981" />
        <StatCard label="Admin Commission" value={totalCommission} sub={`${commissionRate}% of revenue`} color="#0ea5e9" />
        <StatCard label="Pending Withdrawals" value={pendingWithdrawals} color="#f59e0b" />
        <StatCard label="Total Refunds" value="৳14,200" color="#ef4444" />
      </div>

      {/* Commission Calculator */}
      <div className="rounded p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Commission System</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Commission Rate:</label>
            <input type="range" min="5" max="25" value={commissionRate} onChange={e => setCommissionRate(+e.target.value)}
              className="w-24" style={{ accentColor: "#0ea5e9" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0ea5e9", fontFamily: "monospace" }}>{commissionRate}%</span>
          </div>
          <div className="flex gap-4">
            <div className="rounded px-3 py-2" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Product Price</p>
              <p style={{ fontSize: 14, fontFamily: "monospace", color: "var(--foreground)" }}>৳1,000</p>
            </div>
            <div className="rounded px-3 py-2" style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)" }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Admin Earns</p>
              <p style={{ fontSize: 14, fontFamily: "monospace", color: "#0ea5e9", fontWeight: 700 }}>৳{commissionRate * 10}</p>
            </div>
            <div className="rounded px-3 py-2" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Seller Receives</p>
              <p style={{ fontSize: 14, fontFamily: "monospace", color: "#10b981", fontWeight: 700 }}>৳{1000 - commissionRate * 10}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Requests */}
      <div>
        <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Withdrawal Requests</h3>
        <Table headers={["Request ID", "Seller", "Amount", "Method", "Account", "Date", "Status", "Actions"]}>
          {requests.map(req => (
            <TR key={req.id}>
              <TD mono>{req.id}</TD>
              <TD>{req.seller}</TD>
              <TD mono>{req.amount}</TD>
              <TD><span style={{ fontSize: 12, fontWeight: 500 }}>{req.method}</span></TD>
              <TD mono>{req.accountInfo}</TD>
              <TD mono>{req.requestDate}</TD>
              <TD><Badge label={req.status} color={statusColor[req.status]} /></TD>
              <TD>
                {req.status === "Pending" && (
                  <div className="flex gap-1">
                    <Btn size="sm" variant="success" onClick={() => updateRequest(req.id, "Approved")}><CheckCircle size={11} /> Approve</Btn>
                    <Btn size="sm" variant="danger" onClick={() => updateRequest(req.id, "Rejected")}><XCircle size={11} /> Reject</Btn>
                  </div>
                )}
                {req.status !== "Pending" && <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Processed</span>}
              </TD>
            </TR>
          ))}
        </Table>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Recent Transactions</h3>
        <Table headers={["TXN ID", "Type", "Seller", "Order Ref", "Amount", "Commission", "Seller Earning", "Date"]}>
          {transactions.map(t => (
            <TR key={t.id}>
              <TD mono>{t.id}</TD>
              <TD><Badge label={t.type} color={txTypeColor[t.type]} /></TD>
              <TD>{t.seller}</TD>
              <TD mono>{t.orderRef}</TD>
              <TD mono>{t.amount}</TD>
              <TD mono style={{ color: "#0ea5e9" }}>{t.commission}</TD>
              <TD mono style={{ color: "#10b981" }}>{t.sellerEarning}</TD>
              <TD mono>{t.date}</TD>
            </TR>
          ))}
        </Table>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Save, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Btn, Input, PageHeader, Select } from "./Modal";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "payment" | "commission" | "security">("marketplace");
  const [saved, setSaved] = useState("");

  // Marketplace
  const [marketplaceName, setMarketplaceName] = useState("KidsMarket Bangladesh");
  const [marketplaceDesc, setMarketplaceDesc] = useState("The largest children's product marketplace in Bangladesh. Safe, trusted, and verified products for your little ones.");
  const [contactEmail, setContactEmail] = useState("support@kidsmarket.bd");
  const [contactPhone, setContactPhone] = useState("+880-2-555-1234");

  // Payment
  const [bkashEnabled, setBkashEnabled] = useState(true);
  const [nagadEnabled, setNagadEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [bkashMerchant, setBkashMerchant] = useState("01711-000000");

  // Commission
  const [commissionRate, setCommissionRate] = useState("10");
  const [minWithdraw, setMinWithdraw] = useState("1000");
  const [maxWithdraw, setMaxWithdraw] = useState("100000");
  const [withdrawSchedule, setWithdrawSchedule] = useState("weekly");

  // Security
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");

  function saveSettings() {
    setSaved("Settings saved successfully!");
    setTimeout(() => setSaved(""), 2500);
  }

  const tabs = [
    { id: "marketplace" as const, label: "Marketplace Profile" },
    { id: "payment" as const, label: "Payment Settings" },
    { id: "commission" as const, label: "Commission" },
    { id: "security" as const, label: "Security" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Settings" subtitle="Configure marketplace preferences" />

      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: "1px solid var(--border)" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 transition-colors"
            style={{
              fontSize: 13, color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
              borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
              fontWeight: activeTab === tab.id ? 600 : 400
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "#10b98120", border: "1px solid #10b98140", color: "#10b981" }}>
          <CheckCircle size={14} />
          <span style={{ fontSize: 13 }}>{saved}</span>
        </div>
      )}

      <div className="rounded p-4 flex flex-col gap-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>

        {activeTab === "marketplace" && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Marketplace Profile</h3>
            <div className="flex flex-col gap-3">
              <Input label="Marketplace Name" value={marketplaceName} onChange={e => setMarketplaceName(e.target.value)} />
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Description</label>
                <textarea rows={3} value={marketplaceDesc} onChange={e => setMarketplaceDesc(e.target.value)}
                  className="px-3 py-2 rounded outline-none resize-none"
                  style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13 }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Contact Email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" />
                <Input label="Contact Phone" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Marketplace Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded flex items-center justify-center" style={{ background: "var(--primary)" }}>
                    <span style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>KM</span>
                  </div>
                  <Btn variant="secondary" size="sm">Upload Logo</Btn>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "payment" && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Payment Settings</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: "bKash", desc: "Mobile banking payment", enabled: bkashEnabled, toggle: () => setBkashEnabled(v => !v), color: "#e2136e" },
                { label: "Nagad", desc: "Mobile banking payment", enabled: nagadEnabled, toggle: () => setNagadEnabled(v => !v), color: "#f5821f" },
                { label: "Card Payment", desc: "Visa, Mastercard, AMEX", enabled: cardEnabled, toggle: () => setCardEnabled(v => !v), color: "#0ea5e9" },
                { label: "Cash on Delivery", desc: "COD for supported areas", enabled: codEnabled, toggle: () => setCodEnabled(v => !v), color: "#10b981" },
              ].map(p => (
                <div key={p.label} className="flex items-center justify-between px-3 py-2.5 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${p.color}20` }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: p.color }}>PAY</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{p.label}</p>
                      <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{p.desc}</p>
                    </div>
                  </div>
                  <button onClick={p.toggle} className="flex items-center gap-2 px-3 py-1 rounded"
                    style={{ background: p.enabled ? "#10b98120" : "var(--secondary)", border: `1px solid ${p.enabled ? "#10b981" : "var(--border)"}`, color: p.enabled ? "#10b981" : "var(--muted-foreground)", fontSize: 12 }}>
                    {p.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              ))}
              <Input label="bKash Merchant Number" value={bkashMerchant} onChange={e => setBkashMerchant(e.target.value)} />
            </div>
          </>
        )}

        {activeTab === "commission" && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Commission Settings</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Admin Commission Rate: <span style={{ color: "var(--primary)", fontFamily: "monospace", fontWeight: 700 }}>{commissionRate}%</span></label>
                <input type="range" min="5" max="30" value={commissionRate} onChange={e => setCommissionRate(e.target.value)}
                  className="w-full" style={{ accentColor: "#0ea5e9" }} />
                <div className="flex justify-between" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                  <span>5%</span><span>30%</span>
                </div>
              </div>
              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Example calculation:</p>
                <div className="flex gap-4 mt-1">
                  <div><p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Product Price</p><p style={{ fontFamily: "monospace", color: "var(--foreground)" }}>৳1,000</p></div>
                  <div><p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Admin Earns</p><p style={{ fontFamily: "monospace", color: "#0ea5e9", fontWeight: 700 }}>৳{parseInt(commissionRate) * 10}</p></div>
                  <div><p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Seller Receives</p><p style={{ fontFamily: "monospace", color: "#10b981", fontWeight: 700 }}>৳{1000 - parseInt(commissionRate) * 10}</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Min Withdrawal (৳)" type="number" value={minWithdraw} onChange={e => setMinWithdraw(e.target.value)} />
                <Input label="Max Withdrawal (৳)" type="number" value={maxWithdraw} onChange={e => setMaxWithdraw(e.target.value)} />
              </div>
              <Select label="Withdrawal Schedule" value={withdrawSchedule} onChange={e => setWithdrawSchedule(e.target.value)}
                options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "biweekly", label: "Bi-Weekly" }, { value: "monthly", label: "Monthly" }]} />
            </div>
          </>
        )}

        {activeTab === "security" && (
          <>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Security Settings</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Change Password</h4>
                <div className="relative">
                  <Input label="Current Password" type={showPass ? "text" : "password"} value={currentPass} onChange={e => setCurrentPass(e.target.value)} />
                </div>
                <Input label="New Password" type={showPass ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} />
                <div className="relative">
                  <Input label="Confirm New Password" type={showPass ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                  <button onClick={() => setShowPass(v => !v)} className="absolute right-2 bottom-2 p-1 rounded hover:bg-white/10" style={{ color: "var(--muted-foreground)" }}>
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-3 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Two-Factor Authentication</p>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Require OTP on login for added security</p>
                </div>
                <button onClick={() => setTwoFactor(v => !v)} className="px-3 py-1 rounded"
                  style={{ background: twoFactor ? "#10b98120" : "var(--secondary)", border: `1px solid ${twoFactor ? "#10b981" : "var(--border)"}`, color: twoFactor ? "#10b981" : "var(--muted-foreground)", fontSize: 12 }}>
                  {twoFactor ? "Enabled" : "Disabled"}
                </button>
              </div>

              <Input label="Session Timeout (minutes)" type="number" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} />

              <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>Active Sessions</p>
                {[
                  { device: "Chrome — Windows 11", ip: "103.47.18.xxx", time: "Current session", current: true },
                  { device: "Firefox — MacOS", ip: "202.131.xx.xx", time: "2 days ago", current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2" style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <p style={{ fontSize: 12, color: "var(--foreground)" }}>{s.device}</p>
                      <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{s.ip} · {s.time}</p>
                    </div>
                    {s.current ? (
                      <span style={{ fontSize: 11, color: "#10b981" }}>● Active</span>
                    ) : (
                      <Btn size="sm" variant="danger">Revoke</Btn>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Btn onClick={saveSettings}><Save size={13} /> Save Changes</Btn>
        </div>
      </div>
    </div>
  );
}

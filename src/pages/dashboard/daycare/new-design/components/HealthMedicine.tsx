import { useState } from "react";
import {
  Plus, HeartPulse, Pencil, Trash2, AlertTriangle, Pill, Thermometer,
  Shield, Phone, FileText, CheckCircle, X, TrendingUp, Activity,
  Syringe, Stethoscope, ClipboardList, Bell, Search, Weight,
  Ruler, ChevronUp, ChevronDown
} from "lucide-react";
import { Card, Modal, Input, Select, Textarea, Btn, PageHeader, SearchBar, Avatar, StatCard } from "./ui";
import { mockHealthRecords as initial, mockChildren } from "./mockData";
import type { HealthRecord } from "./types";

// ── Types ──────────────────────────────────────────────────────
type VaccinationStatus = "Up to Date" | "Due Soon" | "Overdue" | "Partial";
type EmergencyStatus = "Normal" | "Watch" | "Alert" | "Emergency";

interface GrowthRecord {
  date: string;
  weight: number;
  height: number;
  bmi: number;
  notes: string;
}

interface MedicineSchedule {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  parentApproved: boolean;
  givenToday: boolean;
  givenTime?: string;
  givenBy?: string;
}

interface VaccinationRecord {
  vaccine: string;
  date: string;
  nextDue?: string;
  status: "Given" | "Due" | "Overdue";
}

interface ChildHealthProfile {
  childId: string;
  childName: string;
  group: string;
  dateOfBirth: string;
  bloodGroup: string;
  temperature: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyStatus: EmergencyStatus;
  vaccinationStatus: VaccinationStatus;
  vaccinations: VaccinationRecord[];
  medicines: MedicineSchedule[];
  growthRecords: GrowthRecord[];
  emergencyContact: string;
  emergencyPhone: string;
  doctorName: string;
  doctorPhone: string;
  insuranceNo: string;
  parentConsent: boolean;
}

// ── Constants ─────────────────────────────────────────────────
const HEALTH_TYPES: HealthRecord["type"][] = ["Medication", "Incident", "Checkup", "Allergy"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EMERGENCY_COLORS: Record<EmergencyStatus, string> = {
  Normal: "bg-green-100 text-green-700",
  Watch: "bg-yellow-100 text-yellow-700",
  Alert: "bg-orange-100 text-orange-700",
  Emergency: "bg-red-100 text-red-700",
};

const VACC_COLORS: Record<VaccinationStatus, string> = {
  "Up to Date": "bg-green-100 text-green-700",
  "Due Soon": "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-700",
  Partial: "bg-blue-100 text-blue-700",
};

const TEMP_COLOR = (t: number) =>
  t < 37.0 ? "text-blue-500" : t < 37.5 ? "text-green-500" : t < 38.5 ? "text-amber-500" : "text-red-500";

const typeColors: Record<string, string> = {
  Medication: "bg-blue-100 text-blue-700",
  Incident: "bg-red-100 text-red-700",
  Checkup: "bg-green-100 text-green-700",
  Allergy: "bg-orange-100 text-orange-700",
};

// ── Seed Data ──────────────────────────────────────────────────
const COMMON_VACCINES = ["BCG", "Hepatitis B", "DTaP", "Polio", "MMR", "Varicella", "Flu"];
const ALLERGIES_LIST = [
  ["Peanuts", "Dairy"], ["None"], ["Dust mites"], ["Pollen", "Cat hair"],
  ["Penicillin"], ["None"], ["Shellfish"], ["Eggs"],
];

function seedHealthProfile(c: { id: string; name: string }, idx: number): ChildHealthProfile {
  const temps = [36.8, 37.1, 38.2, 36.5, 37.9, 36.7, 37.0, 38.5];
  const vaccinations: VaccinationRecord[] = COMMON_VACCINES.map((v, i) => ({
    vaccine: v,
    date: `2024-0${(i % 9) + 1}-15`,
    nextDue: i > 4 ? `2026-0${(i % 9) + 1}-15` : undefined,
    status: i > 5 ? "Due" : "Given",
  }));
  const medicines: MedicineSchedule[] = idx < 3 ? [
    { id: `ms-${c.id}-1`, medicine: ["Vitamin D drops", "Antihistamine", "Paracetamol"][idx], dosage: ["0.5ml", "2.5ml", "5ml"][idx], frequency: "Once daily", startDate: "2026-06-01", endDate: "2026-06-30", parentApproved: true, givenToday: false },
  ] : [];
  const growthRecords: GrowthRecord[] = [
    { date: "2026-06-04", weight: 13 + idx * 0.8, height: 90 + idx * 2, bmi: parseFloat((13 + idx * 0.8 / ((0.9 + idx * 0.02) ** 2)).toFixed(1)), notes: "" },
    { date: "2026-03-01", weight: 12.5 + idx * 0.8, height: 88 + idx * 2, bmi: 0, notes: "" },
    { date: "2025-12-01", weight: 12 + idx * 0.8, height: 86 + idx * 2, bmi: 0, notes: "" },
  ];
  return {
    childId: c.id,
    childName: c.name,
    group: ["Sunflower", "Butterfly", "Rainbow", "Star", "Sunflower", "Butterfly", "Rainbow", "Star"][idx % 8],
    dateOfBirth: `202${(idx % 3) + 1}-0${(idx % 9) + 1}-15`,
    bloodGroup: BLOOD_GROUPS[idx % BLOOD_GROUPS.length],
    temperature: temps[idx % temps.length],
    allergies: ALLERGIES_LIST[idx % ALLERGIES_LIST.length],
    chronicConditions: idx === 2 ? ["Mild asthma"] : idx === 5 ? ["Eczema"] : [],
    emergencyStatus: temps[idx % temps.length] > 38 ? (temps[idx % temps.length] > 38.4 ? "Emergency" : "Alert") : "Normal",
    vaccinationStatus: ["Up to Date", "Due Soon", "Partial", "Up to Date", "Overdue", "Up to Date", "Due Soon", "Up to Date"][idx % 8] as VaccinationStatus,
    vaccinations,
    medicines,
    growthRecords,
    emergencyContact: `Parent of ${c.name.split(" ")[0]}`,
    emergencyPhone: `+1 (555) ${idx + 1}23-${4567 + idx}`,
    doctorName: ["Dr. Smith", "Dr. Jones", "Dr. Patel", "Dr. Wilson"][idx % 4],
    doctorPhone: `+1 (555) 98${idx}-0001`,
    insuranceNo: `INS-2025-${1000 + idx}`,
    parentConsent: true,
  };
}

type ModalType = "addRecord" | "editRecord" | "view" | "addMed" | "growth" | "report" | "emergency" | null;
type ViewTab = "overview" | "medicines" | "vaccinations" | "growth";

const emptyRecord: Omit<HealthRecord, "id"> = {
  childId: "", childName: "", type: "Checkup", date: "2026-06-04",
  description: "", nurse: "Rachel Green", status: "Active"
};

export function HealthMedicine() {
  const [records, setRecords] = useState<HealthRecord[]>(initial);
  const [profiles, setProfiles] = useState<ChildHealthProfile[]>(() => mockChildren.map((c, i) => seedHealthProfile(c, i)));
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterEmergency, setFilterEmergency] = useState("All");
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<ChildHealthProfile | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [viewTab, setViewTab] = useState<ViewTab>("overview");
  const [form, setForm] = useState<Omit<HealthRecord, "id">>(emptyRecord);
  const [medForm, setMedForm] = useState({ medicine: "", dosage: "", frequency: "Once daily", startDate: "2026-06-04", endDate: "2026-06-30", parentApproved: false });
  const [growthForm, setGrowthForm] = useState({ weight: "", height: "", notes: "" });
  const [tempEdit, setTempEdit] = useState("");
  const [sosSent, setSosSent] = useState<string | null>(null);

  const filteredProfiles = profiles.filter(p => {
    const m = p.childName.toLowerCase().includes(search.toLowerCase());
    const e = filterEmergency === "All" || p.emergencyStatus === filterEmergency;
    return m && e;
  });

  const filteredRecords = records.filter(r => {
    const m = r.childName.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const t = filterType === "All" || r.type === filterType;
    return m && t;
  });

  function saveRecord() {
    if (modal === "addRecord") setRecords(prev => [...prev, { ...form, id: `h${Date.now()}` }]);
    else if (modal === "editRecord" && selectedRecord) setRecords(prev => prev.map(r => r.id === selectedRecord.id ? { ...form, id: r.id } : r));
    setModal(null);
  }

  function removeRecord(id: string) { if (confirm("Remove record?")) setRecords(prev => prev.filter(r => r.id !== id)); }

  function markMedicineGiven(childId: string, medId: string) {
    setProfiles(prev => prev.map(p => p.childId === childId ? {
      ...p, medicines: p.medicines.map(m => m.id === medId ? { ...m, givenToday: true, givenTime: new Date().toTimeString().slice(0, 5), givenBy: "Nurse Rachel" } : m)
    } : p));
    if (selected?.childId === childId) {
      setSelected(prev => prev ? { ...prev, medicines: prev.medicines.map(m => m.id === medId ? { ...m, givenToday: true, givenTime: new Date().toTimeString().slice(0, 5), givenBy: "Nurse Rachel" } : m) } : prev);
    }
  }

  function addMedicine() {
    if (!selected) return;
    const med: MedicineSchedule = { id: `ms-${Date.now()}`, ...medForm, givenToday: false };
    setProfiles(prev => prev.map(p => p.childId === selected.childId ? { ...p, medicines: [...p.medicines, med] } : p));
    setSelected(prev => prev ? { ...prev, medicines: [...prev.medicines, med] } : prev);
    setModal("view");
  }

  function addGrowthRecord() {
    if (!selected) return;
    const w = parseFloat(growthForm.weight);
    const h = parseFloat(growthForm.height) / 100;
    const bmi = parseFloat((w / (h * h)).toFixed(1));
    const entry: GrowthRecord = { date: new Date().toISOString().split("T")[0], weight: w, height: parseFloat(growthForm.height), bmi, notes: growthForm.notes };
    setProfiles(prev => prev.map(p => p.childId === selected.childId ? { ...p, growthRecords: [entry, ...p.growthRecords] } : p));
    setSelected(prev => prev ? { ...prev, growthRecords: [entry, ...prev.growthRecords] } : prev);
    setModal("view");
  }

  function updateTemperature(childId: string, temp: number) {
    const status: EmergencyStatus = temp > 38.4 ? "Emergency" : temp > 37.9 ? "Alert" : temp > 37.4 ? "Watch" : "Normal";
    setProfiles(prev => prev.map(p => p.childId === childId ? { ...p, temperature: temp, emergencyStatus: status } : p));
    if (selected?.childId === childId) setSelected(prev => prev ? { ...prev, temperature: temp, emergencyStatus: status } : prev);
  }

  function sendSOS(childId: string) {
    setSosSent(childId);
    setTimeout(() => setSosSent(null), 3000);
  }

  const emergencyCount = profiles.filter(p => p.emergencyStatus === "Emergency" || p.emergencyStatus === "Alert").length;
  const pendingMeds = profiles.reduce((s, p) => s + p.medicines.filter(m => !m.givenToday).length, 0);
  const overdueVaccines = profiles.filter(p => p.vaccinationStatus === "Overdue").length;
  const highTemps = profiles.filter(p => p.temperature >= 38).length;

  return (
    <div>
      <PageHeader
        title="Health & Medicine"
        subtitle="Manage medications, vaccinations, growth records, and emergency alerts"
        action={<Btn onClick={() => { setForm(emptyRecord); setModal("addRecord"); }}><Plus size={16} /> Add Record</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Active Alerts" value={emergencyCount} color="red" icon={<AlertTriangle size={20} />} />
        <StatCard label="High Temperature" value={highTemps} color="amber" icon={<Thermometer size={20} />} />
        <StatCard label="Pending Medicines" value={pendingMeds} color="blue" icon={<Pill size={20} />} />
        <StatCard label="Overdue Vaccines" value={overdueVaccines} color="indigo" icon={<Syringe size={20} />} />
      </div>

      {/* Emergency banner */}
      {emergencyCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm text-red-800" style={{ fontWeight: 600 }}>Active Health Alerts</p>
            <p className="text-xs text-red-600 mt-0.5">
              {profiles.filter(p => p.emergencyStatus === "Emergency" || p.emergencyStatus === "Alert").map(p => p.childName).join(", ")} — require immediate attention
            </p>
          </div>
          <Btn variant="danger" size="sm" onClick={() => sendSOS("")}>
            <Phone size={12} /> Alert All Parents
          </Btn>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {([["table", "Health Table"], ["records", "Medical Records"]] as ["table" | "records", string][]).map(([t, label]) => (
          <button key={t}
            onClick={() => filterType === t ? {} : setFilterEmergency("All")}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by child name…" />
        <select value={filterEmergency} onChange={(e: any) => setFilterEmergency(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Status</option>
          {["Normal", "Watch", "Alert", "Emergency"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterType} onChange={(e: any) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Record Types</option>
          {HEALTH_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* ── Health Table ── */}
      <Card className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-600">Child Name</th>
                <th className="text-left px-4 py-3 text-gray-600">Temperature</th>
                <th className="text-left px-4 py-3 text-gray-600">Allergies</th>
                <th className="text-left px-4 py-3 text-gray-600">Medicine Status</th>
                <th className="text-left px-4 py-3 text-gray-600">Vaccination</th>
                <th className="text-left px-4 py-3 text-gray-600">Emergency Status</th>
                <th className="text-left px-4 py-3 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map(p => (
                <tr key={p.childId} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${p.emergencyStatus === "Emergency" ? "bg-red-50" : p.emergencyStatus === "Alert" ? "bg-amber-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={p.childName} size="sm" />
                      <div>
                        <p style={{ fontWeight: 500 }}>{p.childName}</p>
                        <p className="text-xs text-gray-400">{p.group} · {p.bloodGroup}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Thermometer size={14} className={TEMP_COLOR(p.temperature)} />
                      <span className={`text-sm ${TEMP_COLOR(p.temperature)}`} style={{ fontWeight: 600 }}>{p.temperature}°C</span>
                    </div>
                    {p.temperature >= 38 && <p className="text-xs text-red-500 mt-0.5">Fever</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.allergies[0] === "None" ? (
                        <span className="text-xs text-gray-400">None</span>
                      ) : p.allergies.map(a => (
                        <span key={a} className="px-1.5 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.medicines.length > 0 ? (
                      <div>
                        <p className="text-xs" style={{ fontWeight: 500 }}>{p.medicines.filter(m => !m.givenToday).length} pending</p>
                        <p className="text-xs text-gray-400">{p.medicines.length} total</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No medicines</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${VACC_COLORS[p.vaccinationStatus]}`}>{p.vaccinationStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${EMERGENCY_COLORS[p.emergencyStatus]}`}>
                      {p.emergencyStatus === "Emergency" && "🚨 "}{p.emergencyStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button onClick={() => { setSelected(p); setViewTab("overview"); setModal("view"); }} title="View Profile"
                        className="p-1.5 rounded hover:bg-indigo-50 text-indigo-600 transition-colors"><ClipboardList size={14} /></button>
                      <button onClick={() => { setSelected(p); setForm({ ...emptyRecord, childName: p.childName, childId: p.childId }); setModal("addRecord"); }} title="Add Medical Report"
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Plus size={14} /></button>
                      {p.medicines.filter(m => !m.givenToday).map(m => (
                        <button key={m.id} onClick={() => markMedicineGiven(p.childId, m.id)} title={`Mark ${m.medicine} as given`}
                          className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"><Pill size={14} /></button>
                      ))}
                      <a href={`tel:${p.emergencyPhone}`}>
                        <button title="Call Parent" className="p-1.5 rounded hover:bg-teal-50 text-teal-600 transition-colors"><Phone size={14} /></button>
                      </a>
                      <button onClick={() => sendSOS(p.childId)} title="Emergency SOS"
                        className={`p-1.5 rounded transition-colors ${sosSent === p.childId ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-red-50 text-red-500"}`}>
                        <AlertTriangle size={14} />
                      </button>
                      <button onClick={() => { setSelected(p); setViewTab("overview"); setModal("report"); }} title="Health Report"
                        className="p-1.5 rounded hover:bg-purple-50 text-purple-600 transition-colors"><FileText size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProfiles.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No children found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Medical Records Table ── */}
      <div className="mb-2">
        <h3 className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Medical Records Log</h3>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-600">Child</th>
                <th className="text-left px-4 py-3 text-gray-600">Type</th>
                <th className="text-left px-4 py-3 text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-gray-600">Description</th>
                <th className="text-left px-4 py-3 text-gray-600">Nurse</th>
                <th className="text-left px-4 py-3 text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.childName} size="sm" />
                      <span style={{ fontWeight: 500 }}>{r.childName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[r.type]}`}>{r.type}</span></td>
                  <td className="px-4 py-3 text-gray-600">{r.date}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.description}</td>
                  <td className="px-4 py-3 text-gray-600">{r.nurse}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "Active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedRecord(r); setForm({ ...r }); setModal("editRecord"); }} className="p-1.5 rounded hover:bg-gray-100 text-blue-500"><Pencil size={15} /></button>
                      <button onClick={() => removeRecord(r.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No health records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Child Health Profile Modal ── */}
      {modal === "view" && selected && (
        <Modal title={`Health Profile — ${selected.childName}`} onClose={() => setModal(null)} size="xl">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            <Avatar name={selected.childName} size="lg" />
            <div className="flex-1">
              <h3 style={{ fontWeight: 600 }} className="text-lg">{selected.childName}</h3>
              <p className="text-sm text-gray-500">{selected.group} · DOB: {selected.dateOfBirth} · Blood: {selected.bloodGroup}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-lg text-xs ${EMERGENCY_COLORS[selected.emergencyStatus]}`}>{selected.emergencyStatus}</span>
              <Btn variant="danger" size="sm" onClick={() => sendSOS(selected.childId)}>
                <AlertTriangle size={12} /> {sosSent === selected.childId ? "SOS Sent!" : "Emergency SOS"}
              </Btn>
            </div>
          </div>

          <div className="flex gap-1 mb-4 border-b border-gray-200">
            {([["overview", "Overview"], ["medicines", "Medicines"], ["vaccinations", "Vaccinations"], ["growth", "Growth"]] as [ViewTab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setViewTab(t)}
                className={`px-3 py-1.5 text-sm transition-colors ${viewTab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {viewTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Doctor", selected.doctorName], ["Doctor Phone", selected.doctorPhone],
                  ["Emergency Contact", selected.emergencyContact], ["Emergency Phone", selected.emergencyPhone],
                  ["Insurance No.", selected.insuranceNo], ["Parent Consent", selected.parentConsent ? "Yes" : "No"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p style={{ fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Temperature editor */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm" style={{ fontWeight: 600 }}><Thermometer size={14} className="inline mr-1 text-red-500" />Current Temperature</p>
                  <span className={`text-lg ${TEMP_COLOR(selected.temperature)}`} style={{ fontWeight: 700 }}>{selected.temperature}°C</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input type="number" step="0.1" value={tempEdit} onChange={(e: any) => setTempEdit(e.target.value)}
                    placeholder="Enter new temp" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <Btn size="sm" onClick={() => { if (tempEdit) { updateTemperature(selected.childId, parseFloat(tempEdit)); setTempEdit(""); } }}>
                    Update
                  </Btn>
                </div>
              </div>

              {/* Allergies & conditions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Allergies</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.allergies.map(a => <span key={a} className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">{a}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Chronic Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.chronicConditions.length ? selected.chronicConditions.map(c => <span key={c} className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">{c}</span>) : <span className="text-xs text-gray-400">None</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medicines */}
          {viewTab === "medicines" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Medicine Schedule</p>
                <Btn size="sm" onClick={() => { setMedForm({ medicine: "", dosage: "", frequency: "Once daily", startDate: "2026-06-04", endDate: "2026-06-30", parentApproved: false }); setModal("addMed"); }}>
                  <Plus size={13} /> Add Medicine
                </Btn>
              </div>
              <div className="space-y-2">
                {selected.medicines.map(m => (
                  <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border ${m.givenToday ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
                    <Pill size={16} className={m.givenToday ? "text-green-500" : "text-amber-500"} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs" style={{ fontWeight: 600 }}>{m.medicine}</span>
                        <span className="text-xs text-gray-500">{m.dosage} · {m.frequency}</span>
                        {m.parentApproved && <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Parent Approved</span>}
                      </div>
                      <p className="text-xs text-gray-400">{m.startDate} → {m.endDate}</p>
                      {m.givenToday && <p className="text-xs text-green-600">Given at {m.givenTime} by {m.givenBy}</p>}
                    </div>
                    {!m.givenToday && (
                      <Btn size="sm" variant="success" onClick={() => markMedicineGiven(selected.childId, m.id)}>
                        <CheckCircle size={12} /> Mark Given
                      </Btn>
                    )}
                  </div>
                ))}
                {selected.medicines.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No medicines scheduled.</p>}
              </div>
            </div>
          )}

          {/* Vaccinations */}
          {viewTab === "vaccinations" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Vaccination Records</p>
                <span className={`px-2 py-0.5 rounded-full text-xs ${VACC_COLORS[selected.vaccinationStatus]}`}>{selected.vaccinationStatus}</span>
              </div>
              <div className="space-y-2">
                {selected.vaccinations.map(v => (
                  <div key={v.vaccine} className={`flex items-center gap-3 p-3 rounded-xl border ${v.status === "Given" ? "bg-green-50 border-green-100" : v.status === "Overdue" ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"}`}>
                    <Syringe size={14} className={v.status === "Given" ? "text-green-500" : v.status === "Overdue" ? "text-red-500" : "text-yellow-500"} />
                    <div className="flex-1">
                      <span className="text-xs" style={{ fontWeight: 600 }}>{v.vaccine}</span>
                      <p className="text-xs text-gray-400">Given: {v.date}{v.nextDue ? ` · Next due: ${v.nextDue}` : ""}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${v.status === "Given" ? "bg-green-100 text-green-700" : v.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth */}
          {viewTab === "growth" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Growth Monitoring</p>
                <Btn size="sm" onClick={() => { setGrowthForm({ weight: "", height: "", notes: "" }); setModal("growth"); }}>
                  <Plus size={13} /> Add Measurement
                </Btn>
              </div>
              {selected.growthRecords.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Weight", value: `${selected.growthRecords[0].weight} kg`, icon: <Weight size={16} />, color: "text-indigo-600 bg-indigo-50" },
                    { label: "Height", value: `${selected.growthRecords[0].height} cm`, icon: <Ruler size={16} />, color: "text-green-600 bg-green-50" },
                    { label: "BMI", value: selected.growthRecords[0].bmi || "—", icon: <Activity size={16} />, color: "text-amber-600 bg-amber-50" },
                  ].map(s => (
                    <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                      <div className="flex justify-center mb-1">{s.icon}</div>
                      <p className="text-lg" style={{ fontWeight: 700 }}>{s.value}</p>
                      <p className="text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {selected.growthRecords.map((g, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                    <TrendingUp size={14} className="text-indigo-400" />
                    <span className="text-gray-600">{g.date}</span>
                    <span style={{ fontWeight: 500 }}>{g.weight}kg</span>
                    <span style={{ fontWeight: 500 }}>{g.height}cm</span>
                    {g.bmi > 0 && <span className="text-gray-400 text-xs">BMI {g.bmi}</span>}
                    {i > 0 && (
                      <span className={`ml-auto text-xs flex items-center gap-0.5 ${g.weight > selected.growthRecords[i - 1].weight ? "text-green-500" : "text-red-400"}`}>
                        {g.weight > selected.growthRecords[i - 1].weight ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {Math.abs(g.weight - selected.growthRecords[i - 1].weight).toFixed(1)}kg
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
            <a href={`tel:${selected.emergencyPhone}`}><Btn variant="secondary"><Phone size={14} /> Call Parent</Btn></a>
            <Btn onClick={() => setModal("report")}><FileText size={14} /> Health Report</Btn>
          </div>
        </Modal>
      )}

      {/* ── Add/Edit Record Modal ── */}
      {(modal === "addRecord" || modal === "editRecord") && (
        <Modal title={modal === "addRecord" ? "Add Medical Record" : "Edit Record"} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Child Name" value={form.childName} onChange={(v: any) => setForm(p => ({ ...p, childName: v }))} />
            <Select label="Type" value={form.type} onChange={(v: any) => setForm(p => ({ ...p, type: v as HealthRecord["type"] }))} options={[...HEALTH_TYPES]} />
            <Input label="Date" type="date" value={form.date} onChange={(v: any) => setForm(p => ({ ...p, date: v }))} />
            <Input label="Nurse / Staff" value={form.nurse} onChange={(v: any) => setForm(p => ({ ...p, nurse: v }))} />
            <Select label="Status" value={form.status} onChange={(v: any) => setForm(p => ({ ...p, status: v }))} options={["Active", "Resolved"]} />
            <div className="col-span-2"><Textarea label="Description" value={form.description} onChange={(v: any) => setForm(p => ({ ...p, description: v }))} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={saveRecord}>Save Record</Btn>
          </div>
        </Modal>
      )}

      {/* ── Add Medicine Modal ── */}
      {modal === "addMed" && selected && (
        <Modal title={`Add Medicine — ${selected.childName}`} onClose={() => setModal("view")}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Medicine Name" value={medForm.medicine} onChange={(v: any) => setMedForm(p => ({ ...p, medicine: v }))} />
              <Input label="Dosage" value={medForm.dosage} onChange={(v: any) => setMedForm(p => ({ ...p, dosage: v }))} placeholder="e.g. 5ml" />
            </div>
            <Select label="Frequency" value={medForm.frequency} onChange={(v: any) => setMedForm(p => ({ ...p, frequency: v }))} options={["Once daily", "Twice daily", "Three times daily", "As needed", "Weekly"]} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Date" type="date" value={medForm.startDate} onChange={(v: any) => setMedForm(p => ({ ...p, startDate: v }))} />
              <Input label="End Date" type="date" value={medForm.endDate} onChange={(v: any) => setMedForm(p => ({ ...p, endDate: v }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={medForm.parentApproved} onChange={(e: any) => setMedForm(p => ({ ...p, parentApproved: e.target.checked }))} className="rounded" />
              <span className="text-sm text-gray-600">Parent has approved this medicine</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal("view")}>Cancel</Btn>
            <Btn onClick={addMedicine}><Pill size={14} /> Add Medicine</Btn>
          </div>
        </Modal>
      )}

      {/* ── Growth Record Modal ── */}
      {modal === "growth" && selected && (
        <Modal title={`Add Growth Record — ${selected.childName}`} onClose={() => setModal("view")}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Weight (kg)" type="number" step="0.1" value={growthForm.weight} onChange={(v: any) => setGrowthForm(p => ({ ...p, weight: v }))} placeholder="e.g. 13.5" />
            <Input label="Height (cm)" type="number" step="0.5" value={growthForm.height} onChange={(v: any) => setGrowthForm(p => ({ ...p, height: v }))} placeholder="e.g. 92" />
            <div className="col-span-2"><Textarea label="Notes" value={growthForm.notes} onChange={(v: any) => setGrowthForm(p => ({ ...p, notes: v }))} rows={2} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal("view")}>Cancel</Btn>
            <Btn onClick={addGrowthRecord}><TrendingUp size={14} /> Save Measurement</Btn>
          </div>
        </Modal>
      )}

      {/* ── Health Report Modal ── */}
      {modal === "report" && selected && (
        <Modal title={`Health Report — ${selected.childName}`} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
              <Avatar name={selected.childName} size="md" />
              <div>
                <p style={{ fontWeight: 600 }}>{selected.childName}</p>
                <p className="text-xs text-gray-500">{selected.group} · {selected.bloodGroup} · DOB: {selected.dateOfBirth}</p>
              </div>
              <div className="ml-auto">
                <span className={`px-2 py-1 rounded-lg text-xs ${EMERGENCY_COLORS[selected.emergencyStatus]}`}>{selected.emergencyStatus}</span>
              </div>
            </div>
            {[
              { label: "🌡️ Temperature", content: `${selected.temperature}°C — ${selected.temperature >= 38 ? "Fever detected" : "Normal range"}` },
              { label: "⚠️ Allergies", content: selected.allergies.join(", ") || "None" },
              { label: "💊 Active Medicines", content: selected.medicines.length ? selected.medicines.map(m => `${m.medicine} ${m.dosage} (${m.frequency})`).join(", ") : "None" },
              { label: "💉 Vaccination", content: `${selected.vaccinationStatus} — ${selected.vaccinations.filter(v => v.status === "Given").length}/${selected.vaccinations.length} given` },
              { label: "📏 Latest Growth", content: selected.growthRecords[0] ? `Weight: ${selected.growthRecords[0].weight}kg · Height: ${selected.growthRecords[0].height}cm · BMI: ${selected.growthRecords[0].bmi}` : "No records" },
              { label: "🏥 Doctor", content: `${selected.doctorName} · ${selected.doctorPhone}` },
            ].map(s => (
              <div key={s.label} className="flex gap-3 text-sm">
                <span style={{ fontWeight: 600 }} className="w-40 shrink-0 text-gray-600">{s.label}</span>
                <span className="text-gray-700">{s.content}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <Btn><FileText size={14} /> Download PDF</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Close</Btn>
            <a href={`tel:${selected.emergencyPhone}`} className="ml-auto">
              <Btn variant="secondary"><Phone size={14} /> Call Parent</Btn>
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}

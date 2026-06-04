import { useState, useEffect } from "react";
import {
  Plus, Bus, MapPin, Phone, Users, Pencil, Eye, Trash2,
  Navigation, AlertTriangle, CheckCircle, Clock, Shield,
  Route, UserCheck, Bell, History, X, ChevronRight, Radio,
  TrendingUp, Baby, Car
} from "lucide-react";
import { Card, StatusBadge, Modal, Input, Select, Textarea, Btn, PageHeader, Avatar, StatCard } from "./ui";
import { mockVehicles as initial } from "./mockData";
import type { Vehicle } from "./types";

// ── Types ──────────────────────────────────────────────────────
interface PickupRecord {
  id: string;
  childName: string;
  type: "Pickup" | "Drop";
  time: string;
  date: string;
  stop: string;
  confirmedBy: string;
  status: "Confirmed" | "Pending" | "Late" | "Missed";
}

interface RouteStop {
  name: string;
  eta: string;
  completed: boolean;
  childrenBoarded: number;
}

interface GPSUpdate {
  lat: number;
  lng: number;
  speed: number;
  heading: string;
  timestamp: string;
  address: string;
}

interface VehicleExt extends Vehicle {
  vehicleId: string;
  driverLicense: string;
  driverBackground: "Verified" | "Pending" | "Failed";
  vehicleType: "Bus" | "Van" | "Car";
  year: string;
  color: string;
  gpsStatus: "Active" | "Inactive" | "Signal Lost";
  currentLocation: string;
  eta: string;
  routeStops: RouteStop[];
  pickupRecords: PickupRecord[];
  gpsHistory: GPSUpdate[];
  emergencyContacted: boolean;
  assignedChildren: string[];
  lastService: string;
  insurance: string;
}

// ── Constants ─────────────────────────────────────────────────
const ROUTES = ["North Route", "South Route", "East Route", "West Route", "Central Route"];
const STOPS: Record<string, string[]> = {
  "North Route": ["Maple St", "Oak Ave", "Pine Rd", "Birch Dr", "Daycare"],
  "South Route": ["Elm St", "Cedar Ln", "Willow Way", "Daycare"],
  "East Route": ["Spruce Ct", "Ash Blvd", "Walnut Dr", "Daycare"],
  "West Route": ["Poplar St", "Sycamore Ave", "Daycare"],
  "Central Route": ["Main St", "Park Ave", "School Rd", "Daycare"],
};

const BG_COLORS: Record<string, string> = {
  Verified: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
};

const GPS_COLORS: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  "Signal Lost": "bg-red-100 text-red-700",
};

const PICKUP_COLORS: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Late: "bg-orange-100 text-orange-700",
  Missed: "bg-red-100 text-red-700",
};

// ── Seed / Enrich ──────────────────────────────────────────────
const CHILD_NAMES = ["Emma Wilson", "Liam Brown", "Olivia Davis", "Noah Garcia", "Ava Martinez", "James Lee", "Isabella White", "Ethan Clark", "Mia Rodriguez", "Mason Thompson"];

function enrichVehicle(v: Vehicle, idx: number): VehicleExt {
  const num = idx + 1;
  const routeName = ROUTES[idx % ROUTES.length];
  const stops = STOPS[routeName] ?? ["Stop 1", "Daycare"];
  const routeStops: RouteStop[] = stops.map((s, i) => ({
    name: s,
    eta: `${7 + Math.floor(i * 8 / stops.length)}:${String((i * 5) % 60).padStart(2, "0")} AM`,
    completed: i < 2,
    childrenBoarded: i < 2 ? Math.floor(Math.random() * 3) + 1 : 0,
  }));
  const assignedChildren = CHILD_NAMES.slice(idx * 2, idx * 2 + Math.min(v.children.length || 2, 4));
  const pickupRecords: PickupRecord[] = assignedChildren.flatMap((name, i) => [
    { id: `pr-${v.id}-${i}a`, childName: name, type: "Pickup", time: `07:${String(30 + i * 5).padStart(2, "0")} AM`, date: "2025-06-04", stop: stops[i % (stops.length - 1)], confirmedBy: "Driver", status: i === 0 ? "Confirmed" : "Pending" },
    { id: `pr-${v.id}-${i}b`, childName: name, type: "Drop", time: `04:${String(i * 5).padStart(2, "0")} PM`, date: "2025-06-04", stop: stops[i % (stops.length - 1)], confirmedBy: "Parent", status: "Pending" },
  ]);
  const gpsHistory: GPSUpdate[] = Array.from({ length: 5 }, (_, i) => ({
    lat: 40.7128 + (Math.random() - 0.5) * 0.05,
    lng: -74.006 + (Math.random() - 0.5) * 0.05,
    speed: 25 + Math.floor(Math.random() * 20),
    heading: ["N", "NE", "E", "SE", "S"][i],
    timestamp: new Date(Date.now() - i * 120000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    address: `${100 + i * 12} ${["Oak", "Maple", "Pine", "Elm", "Cedar"][i]} St`,
  }));
  return {
    ...v,
    vehicleId: `VH-${100 + num}`,
    driverLicense: `DL-${num}${num}${num * 7}${num * 3}`,
    driverBackground: (["Verified", "Verified", "Pending"] as VehicleExt["driverBackground"][])[idx % 3],
    vehicleType: (["Bus", "Van", "Car"] as VehicleExt["vehicleType"][])[idx % 3],
    year: `202${(num % 4)}`,
    color: ["Yellow", "White", "Blue"][idx % 3],
    gpsStatus: idx === 2 ? "Signal Lost" : "Active",
    currentLocation: `${stops[1]} area`,
    eta: `${8 + idx}:${String(15 + idx * 3).padStart(2, "0")} AM`,
    routeStops,
    pickupRecords,
    gpsHistory,
    emergencyContacted: false,
    assignedChildren,
    lastService: `2025-0${num + 1}-15`,
    insurance: `INS-2025-${num}${num}${num}`,
    route: routeName,
    children: assignedChildren,
  };
}

// ── Component ─────────────────────────────────────────────────
type ModalType = "add" | "edit" | "view" | "track" | "route" | "assign" | "alert" | null;
type ViewTab = "vehicles" | "schedule" | "pickups" | "drivers";

const emptyForm = { name: "", plate: "", driver: "", driverPhone: "", route: "North Route", capacity: 10, children: [] as string[], status: "Active", driverLicense: "", vehicleType: "Bus", year: "2024", color: "Yellow", insurance: "" };

export function Transportation() {
  const [vehicles, setVehicles] = useState<VehicleExt[]>(() => initial.map(enrichVehicle));
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<VehicleExt | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState<ViewTab>("vehicles");
  const [viewTab, setViewTab] = useState<"info" | "gps" | "pickups" | "route">("info");
  const [alertMsg, setAlertMsg] = useState("");
  const [assignChild, setAssignChild] = useState("");
  const [gpsStep, setGpsStep] = useState(0);
  const [emergencyFired, setEmergencyFired] = useState<string | null>(null);

  // Animate GPS position
  useEffect(() => {
    const t = setInterval(() => setGpsStep(s => (s + 1) % 5), 2000);
    return () => clearInterval(t);
  }, []);

  function save() {
    if (modal === "add") {
      const newV = enrichVehicle({ ...form, id: `v${Date.now()}`, children: form.children }, vehicles.length);
      setVehicles(prev => [...prev, newV]);
    } else if (modal === "edit" && selected) {
      setVehicles(prev => prev.map(v => v.id === selected.id ? { ...selected, ...form, children: form.children } : v));
    }
    setModal(null);
  }

  function remove(id: string) {
    if (confirm("Remove this vehicle?")) setVehicles(prev => prev.filter(v => v.id !== id));
  }

  function sendEmergency(id: string) {
    setEmergencyFired(id);
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, emergencyContacted: true } : v));
    setTimeout(() => setEmergencyFired(null), 3000);
  }

  function sendAlert() {
    setModal(null);
    setAlertMsg("");
  }

  function assignChildToVehicle() {
    if (!selected || !assignChild.trim()) return;
    setVehicles(prev => prev.map(v => v.id === selected.id ? { ...v, assignedChildren: [...v.assignedChildren, assignChild] } : v));
    setAssignChild("");
    setModal(null);
  }

  function confirmPickup(vehicleId: string, recordId: string) {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? {
      ...v, pickupRecords: v.pickupRecords.map(p => p.id === recordId ? { ...p, status: "Confirmed" } : p)
    } : v));
  }

  const f = (k: string, v: string | number) => setForm(prev => ({ ...prev, [k]: v }));

  const totalChildren = vehicles.reduce((s, v) => s + v.assignedChildren.length, 0);
  const enRoute = vehicles.filter(v => v.status === "En Route").length;
  const activeGPS = vehicles.filter(v => v.gpsStatus === "Active").length;
  const pendingPickups = vehicles.flatMap(v => v.pickupRecords).filter(p => p.status === "Pending").length;

  return (
    <div>
      <PageHeader
        title="Transportation Management"
        subtitle="Track routes, vehicles, GPS, and pickup/drop schedules"
        action={<Btn onClick={() => { setForm(emptyForm); setModal("add"); }}><Plus size={16} /> Add Vehicle</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Vehicles" value={vehicles.length} color="indigo" icon={<Bus size={20} />} />
        <StatCard label="En Route" value={enRoute} color="blue" icon={<Navigation size={20} />} />
        <StatCard label="Children Transported" value={totalChildren} color="green" icon={<Baby size={20} />} />
        <StatCard label="Pending Pickups" value={pendingPickups} color="amber" icon={<Clock size={20} />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {([["vehicles", "Vehicles & GPS"], ["schedule", "Route Schedule"], ["pickups", "Pickup & Drop"], ["drivers", "Driver Management"]] as [ViewTab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm transition-colors ${tab === t ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Vehicles & GPS Tab ── */}
      {tab === "vehicles" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-600">Vehicle ID</th>
                  <th className="text-left px-4 py-3 text-gray-600">Vehicle</th>
                  <th className="text-left px-4 py-3 text-gray-600">Driver</th>
                  <th className="text-left px-4 py-3 text-gray-600">Route</th>
                  <th className="text-left px-4 py-3 text-gray-600">Children</th>
                  <th className="text-left px-4 py-3 text-gray-600">Live Status</th>
                  <th className="text-left px-4 py-3 text-gray-600">GPS</th>
                  <th className="text-left px-4 py-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-indigo-700">{v.vehicleId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${v.status === "En Route" ? "bg-blue-100" : "bg-gray-100"}`}>
                          <Bus size={16} className={v.status === "En Route" ? "text-blue-600" : "text-gray-500"} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 500 }}>{v.name}</p>
                          <p className="text-xs text-gray-400">{v.plate} · {v.color} {v.vehicleType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={v.driver} size="sm" />
                        <div>
                          <p style={{ fontWeight: 500 }}>{v.driver}</p>
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${BG_COLORS[v.driverBackground]}`}>{v.driverBackground}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Route size={12} className="text-gray-400" />
                        <span className="text-xs">{v.route}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">ETA: {v.eta}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Baby size={12} /> {v.assignedChildren.length}/{v.capacity}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${GPS_COLORS[v.gpsStatus]}`}>
                        <Radio size={10} className={v.gpsStatus === "Active" ? "animate-pulse" : ""} />
                        {v.gpsStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button onClick={() => { setSelected(v); setViewTab("gps"); setModal("view"); }} title="Track Vehicle"
                          className="p-1.5 rounded hover:bg-indigo-50 text-indigo-600 transition-colors"><Navigation size={14} /></button>
                        <button onClick={() => { setSelected(v); setViewTab("info"); setModal("view"); }} title="View Details"
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"><Eye size={14} /></button>
                        <button onClick={() => { setSelected(v); setForm({ ...emptyForm, name: v.name, plate: v.plate, driver: v.driver, driverPhone: v.driverPhone, route: v.route, capacity: v.capacity, children: v.assignedChildren, status: v.status, driverLicense: v.driverLicense, vehicleType: v.vehicleType, year: v.year, color: v.color, insurance: v.insurance }); setModal("edit"); }}
                          title="Edit" className="p-1.5 rounded hover:bg-amber-50 text-amber-600 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => { setSelected(v); setAssignChild(""); setModal("assign"); }} title="Assign Child"
                          className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"><UserCheck size={14} /></button>
                        <button onClick={() => { setSelected(v); setViewTab("route"); setModal("view"); }} title="View Route"
                          className="p-1.5 rounded hover:bg-purple-50 text-purple-600 transition-colors"><Route size={14} /></button>
                        <button onClick={() => sendEmergency(v.id)} title="Emergency Alert"
                          className={`p-1.5 rounded transition-colors ${emergencyFired === v.id ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-red-50 text-red-500"}`}>
                          <AlertTriangle size={14} />
                        </button>
                        <button onClick={() => { setSelected(v); setAlertMsg(""); setModal("alert"); }} title="Send Alert"
                          className="p-1.5 rounded hover:bg-orange-50 text-orange-600 transition-colors"><Bell size={14} /></button>
                        <button onClick={() => remove(v.id)} title="Delete"
                          className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Route Schedule Tab ── */}
      {tab === "schedule" && (
        <div className="space-y-4">
          {vehicles.map(v => (
            <Card key={v.id} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${v.status === "En Route" ? "bg-blue-100" : "bg-gray-100"}`}>
                    <Bus size={18} className={v.status === "En Route" ? "text-blue-600" : "text-gray-400"} />
                  </div>
                  <div>
                    <h3 className="text-sm" style={{ fontWeight: 600 }}>{v.name} — {v.route}</h3>
                    <p className="text-xs text-gray-400">{v.driver} · {v.assignedChildren.length} children</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs ${GPS_COLORS[v.gpsStatus]}`}><Radio size={10} className="inline mr-1" />{v.gpsStatus}</span>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">ETA: {v.eta}</span>
                </div>
              </div>

              {/* Stop progress */}
              <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {v.routeStops.map((stop, i) => (
                  <div key={stop.name} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${stop.completed ? "bg-indigo-600 border-indigo-600" : i === v.routeStops.findIndex(s => !s.completed) ? "bg-white border-indigo-400 animate-pulse" : "bg-white border-gray-300"}`}>
                        {stop.completed ? <CheckCircle size={14} className="text-white" /> : <span className="text-xs text-gray-400">{i + 1}</span>}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 whitespace-nowrap">{stop.name}</p>
                      <p className="text-xs text-gray-400">{stop.eta}</p>
                      {stop.childrenBoarded > 0 && <p className="text-xs text-indigo-500">+{stop.childrenBoarded}</p>}
                    </div>
                    {i < v.routeStops.length - 1 && (
                      <div className={`h-0.5 w-12 mb-6 ${stop.completed ? "bg-indigo-400" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Pickup & Drop Tab ── */}
      {tab === "pickups" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Confirmed", value: vehicles.flatMap(v => v.pickupRecords).filter(p => p.status === "Confirmed").length, color: "bg-green-50 text-green-700 border-green-200" },
              { label: "Pending", value: pendingPickups, color: "bg-amber-50 text-amber-700 border-amber-200" },
              { label: "Late / Missed", value: vehicles.flatMap(v => v.pickupRecords).filter(p => p.status === "Late" || p.status === "Missed").length, color: "bg-red-50 text-red-700 border-red-200" },
            ].map(s => (
              <div key={s.label} className={`border rounded-xl p-3 text-center ${s.color}`}>
                <p className="text-2xl" style={{ fontWeight: 700 }}>{s.value}</p>
                <p className="text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {vehicles.map(v => (
            <Card key={v.id} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bus size={16} className="text-indigo-500" />
                <h3 className="text-sm" style={{ fontWeight: 600 }}>{v.name} — {v.route}</h3>
                <span className="text-xs text-gray-400 ml-auto">{v.driver}</span>
              </div>
              <div className="space-y-2">
                {v.pickupRecords.map(record => (
                  <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${record.type === "Pickup" ? "bg-green-500" : "bg-blue-500"}`}>
                        {record.type === "Pickup" ? "↑" : "↓"}
                      </div>
                      <div>
                        <p className="text-xs" style={{ fontWeight: 500 }}>{record.childName}</p>
                        <p className="text-xs text-gray-400">{record.type} · {record.stop} · {record.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${PICKUP_COLORS[record.status]}`}>{record.status}</span>
                      {record.status === "Pending" && (
                        <button onClick={() => confirmPickup(v.id, record.id)}
                          className="px-2 py-0.5 rounded-lg text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Driver Management Tab ── */}
      {tab === "drivers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map(v => (
            <Card key={v.id} className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={v.driver} size="md" />
                <div className="flex-1">
                  <p style={{ fontWeight: 600 }}>{v.driver}</p>
                  <p className="text-xs text-gray-400">{v.vehicleType} Driver · {v.name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${BG_COLORS[v.driverBackground]}`}>
                  <Shield size={10} className="inline mr-1" />{v.driverBackground}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                {[
                  ["Vehicle ID", v.vehicleId],
                  ["License", v.driverLicense],
                  ["Phone", v.driverPhone],
                  ["Route", v.route],
                  ["Last Service", v.lastService],
                  ["Insurance", v.insurance],
                ].map(([k, val]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p className="text-xs" style={{ fontWeight: 500 }}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <a href={`tel:${v.driverPhone}`} className="flex-1">
                  <Btn variant="secondary" size="sm" className="w-full justify-center">
                    <Phone size={12} /> Call Driver
                  </Btn>
                </a>
                <Btn size="sm" onClick={() => sendEmergency(v.id)} variant={emergencyFired === v.id ? "danger" : "secondary"}>
                  <AlertTriangle size={12} /> {emergencyFired === v.id ? "Sent!" : "Emergency"}
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── View / Track Modal ── */}
      {modal === "view" && selected && (
        <Modal title={`${selected.name} — ${selected.vehicleId}`} onClose={() => setModal(null)} size="xl">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected.status === "En Route" ? "bg-blue-100" : "bg-gray-100"}`}>
              <Bus size={24} className={selected.status === "En Route" ? "text-blue-600" : "text-gray-400"} />
            </div>
            <div className="flex-1">
              <h3 style={{ fontWeight: 600 }}>{selected.name}</h3>
              <p className="text-sm text-gray-400">{selected.plate} · {selected.color} {selected.vehicleType} · {selected.year}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={selected.status} />
              <span className={`px-2 py-0.5 rounded-full text-xs ${GPS_COLORS[selected.gpsStatus]}`}><Radio size={10} className="inline mr-1" />{selected.gpsStatus}</span>
            </div>
          </div>

          <div className="flex gap-1 mb-4 border-b border-gray-200">
            {([["info", "Info"], ["gps", "GPS Track"], ["pickups", "Pickups"], ["route", "Route"]] as ["info" | "gps" | "pickups" | "route", string][]).map(([t, label]) => (
              <button key={t} onClick={() => setViewTab(t)}
                className={`px-3 py-1.5 text-sm transition-colors ${viewTab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
                {label}
              </button>
            ))}
          </div>

          {viewTab === "info" && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Driver", selected.driver], ["Phone", selected.driverPhone],
                ["License", selected.driverLicense], ["Background", selected.driverBackground],
                ["Route", selected.route], ["ETA", selected.eta],
                ["Capacity", `${selected.assignedChildren.length}/${selected.capacity}`],
                ["Current Location", selected.currentLocation],
                ["Last Service", selected.lastService], ["Insurance", selected.insurance],
              ].map(([k, val]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p style={{ fontWeight: 500 }}>{val}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-1">Assigned Children</p>
                <div className="flex flex-wrap gap-1">
                  {selected.assignedChildren.map(name => (
                    <span key={name} className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">{name}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewTab === "gps" && (
            <div>
              {/* Simulated GPS map */}
              <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden mb-4" style={{ height: 240 }}>
                {/* Road grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                {/* Vehicle position */}
                <div className="absolute transition-all duration-1000" style={{ left: `${30 + gpsStep * 10}%`, top: `${40 + Math.sin(gpsStep) * 15}%` }}>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
                      <Bus size={16} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-pulse" />
                  </div>
                </div>
                {/* Destination marker */}
                <div className="absolute" style={{ right: "15%", top: "35%" }}>
                  <MapPin size={20} className="text-red-500" />
                  <p className="text-xs text-gray-600 whitespace-nowrap">Daycare</p>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/80 rounded-lg px-2 py-1 text-xs text-gray-600">
                  <Navigation size={10} className="inline mr-1 text-indigo-500" />
                  {selected.currentLocation} · {selected.gpsHistory[0]?.speed ?? 30} km/h
                </div>
                <div className="absolute bottom-2 right-2 bg-white/80 rounded-lg px-2 py-1 text-xs text-indigo-600" style={{ fontWeight: 600 }}>
                  ETA {selected.eta}
                </div>
              </div>

              {/* GPS history */}
              <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>Route History</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selected.gpsHistory.map((update, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={11} className="text-gray-400" />
                      <span className="text-gray-700">{update.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span>{update.speed} km/h</span>
                      <span>{update.heading}</span>
                      <span>{update.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewTab === "pickups" && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {selected.pickupRecords.map(record => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${record.type === "Pickup" ? "bg-green-500" : "bg-blue-500"}`}>
                      {record.type === "Pickup" ? "↑" : "↓"}
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontWeight: 500 }}>{record.childName}</p>
                      <p className="text-xs text-gray-400">{record.stop} · {record.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${PICKUP_COLORS[record.status]}`}>{record.status}</span>
                    {record.status === "Pending" && (
                      <button onClick={() => confirmPickup(selected.id, record.id)}
                        className="px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100">Confirm</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewTab === "route" && (
            <div>
              <p className="text-xs text-gray-500 mb-3">Route: <strong>{selected.route}</strong></p>
              <div className="flex items-center overflow-x-auto pb-3 gap-0">
                {selected.routeStops.map((stop, i) => (
                  <div key={stop.name} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${stop.completed ? "bg-indigo-600 border-indigo-600" : i === selected.routeStops.findIndex(s => !s.completed) ? "bg-white border-indigo-400" : "bg-white border-gray-300"}`}>
                        {stop.completed ? <CheckCircle size={14} className="text-white" /> : <span className="text-xs text-gray-400">{i + 1}</span>}
                      </div>
                      <p className="text-xs text-center mt-1 max-w-16">{stop.name}</p>
                      <p className="text-xs text-gray-400">{stop.eta}</p>
                    </div>
                    {i < selected.routeStops.length - 1 && (
                      <div className={`h-0.5 w-10 mb-6 ${stop.completed ? "bg-indigo-400" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
            <a href={`tel:${selected.driverPhone}`}><Btn variant="secondary"><Phone size={14} /> Call Driver</Btn></a>
            <Btn variant="danger" onClick={() => sendEmergency(selected.id)}>
              <AlertTriangle size={14} /> {emergencyFired === selected.id ? "Alert Sent!" : "Emergency Alert"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── Add / Edit Modal ── */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Vehicle" : "Edit Vehicle"} onClose={() => setModal(null)} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vehicle Name" value={form.name} onChange={v => f("name", v)} />
            <Input label="License Plate" value={form.plate} onChange={v => f("plate", v)} />
            <Select label="Vehicle Type" value={form.vehicleType} onChange={v => f("vehicleType", v)} options={["Bus", "Van", "Car"]} />
            <Input label="Year" value={form.year} onChange={v => f("year", v)} />
            <Input label="Color" value={form.color} onChange={v => f("color", v)} />
            <Input label="Capacity" type="number" value={String(form.capacity)} onChange={v => f("capacity", Number(v))} />
            <Input label="Driver Name" value={form.driver} onChange={v => f("driver", v)} />
            <Input label="Driver Phone" value={form.driverPhone} onChange={v => f("driverPhone", v)} />
            <Input label="Driver License" value={form.driverLicense} onChange={v => f("driverLicense", v)} />
            <Select label="Route" value={form.route} onChange={v => f("route", v)} options={ROUTES} />
            <Input label="Insurance No." value={form.insurance} onChange={v => f("insurance", v)} />
            <Select label="Status" value={form.status} onChange={v => f("status", v)} options={["Active", "En Route", "Inactive"]} />
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save Vehicle</Btn>
          </div>
        </Modal>
      )}

      {/* ── Assign Child Modal ── */}
      {modal === "assign" && selected && (
        <Modal title={`Assign Child — ${selected.name}`} onClose={() => setModal(null)}>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-3">Current capacity: {selected.assignedChildren.length}/{selected.capacity}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {selected.assignedChildren.map(name => (
                <span key={name} className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">{name}</span>
              ))}
            </div>
            <Input label="Child Name" value={assignChild} onChange={setAssignChild} placeholder="Enter child's name…" />
            <div className="mt-3 flex flex-wrap gap-1">
              {CHILD_NAMES.filter(n => !selected.assignedChildren.includes(n)).slice(0, 6).map(n => (
                <button key={n} onClick={() => setAssignChild(n)}
                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200">{n}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={assignChildToVehicle} disabled={!assignChild.trim()}><UserCheck size={14} /> Assign</Btn>
          </div>
        </Modal>
      )}

      {/* ── Send Alert Modal ── */}
      {modal === "alert" && selected && (
        <Modal title={`Send Alert — ${selected.name}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {["Route change ahead", "Running late", "Emergency stop", "Pickup confirmed", "Drop complete"].map(t => (
                <button key={t} onClick={() => setAlertMsg(t)}
                  className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">{t}</button>
              ))}
            </div>
            <Textarea label="Alert Message" value={alertMsg} onChange={setAlertMsg} rows={3} placeholder="Enter alert message…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={sendAlert} disabled={!alertMsg.trim()}><Bell size={14} /> Send Alert</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import {
  Brain, Shield, Zap, Eye, AlertTriangle, CheckCircle,
  QrCode, MapPin, UserCheck, Lock, Key, Users, FileText,
  Bell, MessageSquare, RefreshCw, Download, Cpu,
  Frown, Smile, Meh, AlertCircle, Play,
  XCircle, Server, Globe, Camera
} from "lucide-react";
import { Card, PageHeader, Btn, Modal } from "./ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type AITab = "ai-monitoring" | "smart-attendance" | "security" | "automation";
type EmotionType = "Happy" | "Sad" | "Crying" | "Aggressive" | "Isolated" | "Neutral";

interface BehaviorAlert {
  id: string; childName: string; group: string; emotion: EmotionType;
  confidence: number; time: string; camera: string; acknowledged: boolean;
  severity: "low" | "medium" | "high";
}
interface AttendanceLog {
  id: string; childName: string;
  method: "Face Recognition" | "QR Code" | "GPS Pickup" | "Manual";
  time: string; status: "In" | "Out" | "Pending";
  confidence?: number; location?: string;
}
interface AuditEntry {
  id: string; user: string; role: string; action: string; module: string;
  timestamp: string; ip: string; status: "Success" | "Failed" | "Warning";
}
interface AutomationTask {
  id: string; name: string; type: string; schedule: string; lastRun: string;
  nextRun: string; status: "Active" | "Paused" | "Running" | "Failed"; runs: number;
}
interface SafetyAlert {
  id: string; type: string; childName: string; description: string;
  time: string; resolved: boolean; severity: "critical" | "high" | "medium";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SEED_BEHAVIOR: BehaviorAlert[] = [
  { id: "b1", childName: "Emma Johnson", group: "Butterfly", emotion: "Crying", confidence: 91, time: "10:32 AM", camera: "Classroom Cam 1", acknowledged: false, severity: "high" },
  { id: "b2", childName: "Liam Wilson", group: "Sunflower", emotion: "Aggressive", confidence: 87, time: "10:18 AM", camera: "Playground Cam 2", acknowledged: false, severity: "high" },
  { id: "b3", childName: "Olivia Davis", group: "Rainbow", emotion: "Isolated", confidence: 79, time: "09:55 AM", camera: "Classroom Cam 2", acknowledged: true, severity: "medium" },
  { id: "b4", childName: "Noah Brown", group: "Star", emotion: "Happy", confidence: 96, time: "09:40 AM", camera: "Dining Cam", acknowledged: true, severity: "low" },
  { id: "b5", childName: "Sophia Martinez", group: "Butterfly", emotion: "Sad", confidence: 83, time: "09:22 AM", camera: "Sleeping Cam", acknowledged: false, severity: "medium" },
  { id: "b6", childName: "Aiden Lee", group: "Sunflower", emotion: "Neutral", confidence: 94, time: "09:10 AM", camera: "Classroom Cam 1", acknowledged: true, severity: "low" },
];

const SEED_ATTENDANCE: AttendanceLog[] = [
  { id: "a1", childName: "Emma Johnson", method: "Face Recognition", time: "07:45 AM", status: "In", confidence: 98.2, location: "Main Entrance" },
  { id: "a2", childName: "Liam Wilson", method: "QR Code", time: "07:52 AM", status: "In", location: "Main Entrance" },
  { id: "a3", childName: "Olivia Davis", method: "GPS Pickup", time: "08:05 AM", status: "In", location: "Bus Stop A" },
  { id: "a4", childName: "Noah Brown", method: "Face Recognition", time: "08:10 AM", status: "In", confidence: 96.7, location: "Main Entrance" },
  { id: "a5", childName: "Sophia Martinez", method: "Manual", time: "08:20 AM", status: "In", location: "Admin Desk" },
  { id: "a6", childName: "Aiden Lee", method: "QR Code", time: "08:33 AM", status: "In", location: "Main Entrance" },
  { id: "a7", childName: "Lucas Moore", method: "Face Recognition", time: "08:45 AM", status: "Pending", confidence: 61.2, location: "Main Entrance" },
];

const SEED_AUDIT: AuditEntry[] = [
  { id: "au1", user: "Dr. Patricia Lee", role: "Admin", action: "Approved admission for Lucas Moore", module: "Admissions", timestamp: "Today, 10:30 AM", ip: "192.168.1.10", status: "Success" },
  { id: "au2", user: "Jenny Smith", role: "Nurse", action: "Added health record for Emma Johnson", module: "Health", timestamp: "Today, 09:15 AM", ip: "192.168.1.22", status: "Success" },
  { id: "au3", user: "Unknown", role: "—", action: "Failed login attempt", module: "Auth", timestamp: "Today, 09:02 AM", ip: "74.125.0.1", status: "Failed" },
  { id: "au4", user: "Tom Robinson", role: "Driver", action: "Accessed CCTV feed: Classroom Cam 1", module: "Live Monitoring", timestamp: "Yesterday, 4:00 PM", ip: "192.168.2.5", status: "Warning" },
  { id: "au5", user: "Dr. Patricia Lee", role: "Admin", action: "Updated billing invoice INV-2025003", module: "Billing", timestamp: "Yesterday, 3:45 PM", ip: "192.168.1.10", status: "Success" },
  { id: "au6", user: "Sarah Jones", role: "Teacher", action: "Marked attendance for Butterfly group", module: "Attendance", timestamp: "Yesterday, 8:30 AM", ip: "192.168.1.15", status: "Success" },
  { id: "au7", user: "Unknown", role: "—", action: "Repeated failed login (3x)", module: "Auth", timestamp: "2 days ago, 11:50 PM", ip: "203.0.113.5", status: "Failed" },
];

const SEED_SAFETY: SafetyAlert[] = [
  { id: "s1", type: "Pickup Verification Failed", childName: "Lucas Moore", description: "Unrecognized person attempted pickup. ID not verified.", time: "3:45 PM", resolved: false, severity: "critical" },
  { id: "s2", type: "Fever Alert", childName: "Emma Johnson", description: "Temperature recorded at 38.9°C — above safe threshold.", time: "10:15 AM", resolved: false, severity: "high" },
  { id: "s3", type: "Emergency SOS", childName: "Liam Wilson", description: "Staff triggered SOS in Playground Area.", time: "09:55 AM", resolved: true, severity: "critical" },
  { id: "s4", type: "Boundary Alert", childName: "Olivia Davis", description: "Child detected near restricted zone (Exit B).", time: "09:30 AM", resolved: true, severity: "high" },
];

const SEED_AUTOMATION: AutomationTask[] = [
  { id: "t1", name: "Daily Report Generation", type: "Report", schedule: "Daily at 6:00 PM", lastRun: "Today, 6:00 PM", nextRun: "Tomorrow, 6:00 PM", status: "Active", runs: 142 },
  { id: "t2", name: "Payment Reminders", type: "Notification", schedule: "Mon & Thu at 9:00 AM", lastRun: "Today, 9:00 AM", nextRun: "Thursday, 9:00 AM", status: "Active", runs: 89 },
  { id: "t3", name: "GPS Tracking Update", type: "GPS", schedule: "Every 30 seconds", lastRun: "Just now", nextRun: "30 sec", status: "Running", runs: 8400 },
  { id: "t4", name: "Activity Notifications", type: "Notification", schedule: "After each activity", lastRun: "Today, 2:30 PM", nextRun: "On trigger", status: "Active", runs: 312 },
  { id: "t5", name: "Attendance Summary Email", type: "Email", schedule: "Daily at 8:30 PM", lastRun: "Yesterday, 8:30 PM", nextRun: "Today, 8:30 PM", status: "Active", runs: 98 },
  { id: "t6", name: "AI Behavior Scan", type: "AI", schedule: "Every 5 minutes", lastRun: "5 min ago", nextRun: "In 5 min", status: "Running", runs: 1728 },
  { id: "t7", name: "Low Rating Alert", type: "Alert", schedule: "On trigger", lastRun: "3 days ago", nextRun: "On trigger", status: "Paused", runs: 14 },
];

const ROLE_PERMISSIONS = [
  { role: "Super Admin", permissions: ["All modules", "User management", "CCTV access", "Data export", "System settings"], color: "bg-indigo-100 text-indigo-700" },
  { role: "Admin", permissions: ["All modules", "CCTV access", "Data export"], color: "bg-blue-100 text-blue-700" },
  { role: "Teacher", permissions: ["Children", "Daily Activities", "Attendance", "Chat"], color: "bg-green-100 text-green-700" },
  { role: "Nurse", permissions: ["Health & Medicine", "Children", "Chat"], color: "bg-purple-100 text-purple-700" },
  { role: "Driver", permissions: ["Transportation", "GPS view", "Chat"], color: "bg-yellow-100 text-yellow-700" },
  { role: "Parent", permissions: ["Child profile view", "Daily report view", "Chat", "Notifications"], color: "bg-orange-100 text-orange-700" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emotionIcon(em: EmotionType) {
  if (em === "Happy") return <Smile size={14} className="text-green-500" />;
  if (em === "Neutral") return <Meh size={14} className="text-gray-500" />;
  if (em === "Sad" || em === "Crying") return <Frown size={14} className="text-blue-500" />;
  if (em === "Aggressive") return <AlertTriangle size={14} className="text-red-500" />;
  return <AlertCircle size={14} className="text-orange-500" />;
}

function emotionColor(em: EmotionType) {
  const map: Record<EmotionType, string> = {
    Happy: "bg-green-100 text-green-700",
    Neutral: "bg-gray-100 text-gray-700",
    Sad: "bg-blue-100 text-blue-700",
    Crying: "bg-indigo-100 text-indigo-700",
    Aggressive: "bg-red-100 text-red-700",
    Isolated: "bg-orange-100 text-orange-700",
  };
  return map[em] ?? "bg-gray-100 text-gray-700";
}

function sevColor(sev: "critical" | "high" | "medium") {
  if (sev === "critical") return "bg-red-100 text-red-700 border-red-200";
  if (sev === "high") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

function auditStatusColor(s: "Success" | "Failed" | "Warning") {
  if (s === "Success") return "bg-green-100 text-green-700";
  if (s === "Failed") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

function AuditStatusIcon({ status }: { status: "Success" | "Failed" | "Warning" }) {
  if (status === "Success") return <CheckCircle size={13} className="text-green-500" />;
  if (status === "Failed") return <XCircle size={13} className="text-red-500" />;
  return <AlertTriangle size={13} className="text-yellow-500" />;
}

// ─── AI Monitoring Tab ────────────────────────────────────────────────────────

function AIMonitoringTab() {
  const [alerts, setAlerts] = useState<BehaviorAlert[]>(SEED_BEHAVIOR);
  const [safety, setSafety] = useState<SafetyAlert[]>(SEED_SAFETY);
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState<BehaviorAlert | null>(null);
  const [filter, setFilter] = useState<"All" | EmotionType>("All");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const NEW_EMOTIONS: EmotionType[] = ["Crying", "Aggressive", "Isolated", "Sad"];
  const CHILDREN = ["Lucas Moore", "Isabella Clark", "Mason White", "Ava Harris"];
  const GROUPS = ["Rainbow", "Sunflower", "Butterfly", "Star"];
  const CAMS = ["Classroom Cam 1", "Playground Cam 2", "Sleeping Cam", "Dining Cam"];

  function startScan() {
    setScanning(true);
    timerRef.current = setInterval(() => {
      const em = NEW_EMOTIONS[Math.floor(Math.random() * NEW_EMOTIONS.length)];
      const child = CHILDREN[Math.floor(Math.random() * CHILDREN.length)];
      setAlerts(prev => [{
        id: `b-live-${Date.now()}`,
        childName: child,
        group: GROUPS[Math.floor(Math.random() * GROUPS.length)],
        emotion: em,
        confidence: 75 + Math.floor(Math.random() * 20),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        camera: CAMS[Math.floor(Math.random() * CAMS.length)],
        acknowledged: false,
        severity: em === "Aggressive" || em === "Crying" ? "high" : "medium",
      }, ...prev.slice(0, 11)]);
    }, 4000);
  }

  function stopScan() {
    setScanning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function acknowledge(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    setSelected(prev => prev?.id === id ? { ...prev, acknowledged: true } : prev);
  }

  function resolveAlert(id: string) {
    setSafety(prev => prev.map(s => s.id === id ? { ...s, resolved: true } : s));
  }

  const displayed = filter === "All" ? alerts : alerts.filter(a => a.emotion === filter);
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;
  const unresolvedSafety = safety.filter(s => !s.resolved).length;

  const emotionCounts: Partial<Record<EmotionType, number>> = {};
  alerts.forEach(a => { emotionCounts[a.emotion] = (emotionCounts[a.emotion] ?? 0) + 1; });

  const kpis = [
    { label: "Behavior Alerts", value: String(unacknowledged), sub: "Unacknowledged", color: "text-red-600", bg: "bg-red-50" },
    { label: "Safety Alerts", value: String(unresolvedSafety), sub: "Unresolved", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "AI Confidence", value: "89%", sub: "Avg. detection score", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Monitored", value: "32", sub: "Children active now", color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className="p-4">
            <p className={`text-2xl ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
            <p className="text-sm text-gray-600 mt-0.5">{k.label}</p>
            <p className="text-xs text-gray-400">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Behavior Detection */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-800">AI Child Emotion Detection</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time behavior analysis via CCTV</p>
            </div>
            {scanning
              ? <Btn variant="danger" size="sm" onClick={stopScan}><XCircle size={14} /> Stop</Btn>
              : <Btn variant="primary" size="sm" onClick={startScan}><Play size={14} /> Start AI Scan</Btn>
            }
          </div>

          {scanning && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI scanning active — monitoring all cameras in real-time
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {(["All", "Crying", "Aggressive", "Isolated", "Sad", "Happy", "Neutral"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-full text-xs transition-all ${filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f}{f !== "All" && emotionCounts[f as EmotionType] ? ` (${emotionCounts[f as EmotionType]})` : ""}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {displayed.map(a => (
              <div key={a.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  a.acknowledged ? "bg-gray-50 border-gray-100" : a.severity === "high" ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"
                }`}
                onClick={() => setSelected(a)}>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs shrink-0" style={{ fontWeight: 700 }}>
                  {a.childName.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-800" style={{ fontWeight: a.acknowledged ? 400 : 600 }}>{a.childName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${emotionColor(a.emotion)}`}>
                      {emotionIcon(a.emotion)}{a.emotion}
                    </span>
                    {!a.acknowledged && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-gray-400">{a.camera} · {a.time} · {a.confidence}% conf.</p>
                </div>
                {!a.acknowledged && (
                  <button onClick={e => { e.stopPropagation(); acknowledge(a.id); }}
                    className="shrink-0 text-xs px-2 py-1 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 text-gray-600 transition-colors">
                    ACK
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Child Safety Monitoring */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-800">Child Safety Monitoring</h3>
              <p className="text-xs text-gray-400 mt-0.5">Emergency alerts · Health risks · Pickup</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${unresolvedSafety > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {unresolvedSafety > 0 ? `${unresolvedSafety} Active` : "All Clear"}
            </span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {safety.map(s => (
              <div key={s.id} className={`p-3 rounded-xl border ${s.resolved ? "bg-gray-50 border-gray-100 opacity-60" : sevColor(s.severity)}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{s.type}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${sevColor(s.severity)}`}>{s.severity}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{s.childName} — {s.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.time}</p>
                  </div>
                  {!s.resolved
                    ? <button onClick={() => resolveAlert(s.id)}
                        className="shrink-0 text-xs px-2 py-1 bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 text-gray-600 transition-colors">
                        Resolve
                      </button>
                    : <CheckCircle size={16} className="text-green-500 shrink-0" />
                  }
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Behavior Analysis Summary */}
      <Card className="p-5">
        <h3 className="text-gray-800 mb-4">Behavior Analysis — Today's Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {(["Happy", "Neutral", "Sad", "Crying", "Aggressive", "Isolated"] as EmotionType[]).map(em => {
            const count = emotionCounts[em] ?? 0;
            return (
              <div key={em} className={`p-3 rounded-xl border text-center ${count > 0 && em !== "Happy" && em !== "Neutral" ? "border-orange-200 bg-orange-50" : "bg-gray-50 border-gray-100"}`}>
                <div className="flex justify-center mb-1">{emotionIcon(em)}</div>
                <p className="text-lg" style={{ fontWeight: 700 }}>{count}</p>
                <p className="text-xs text-gray-500">{em}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={15} className="text-indigo-600" />
            <p className="text-sm text-indigo-700" style={{ fontWeight: 600 }}>AI Smart Recommendations</p>
          </div>
          <ul className="text-xs text-indigo-600 space-y-1 ml-5 list-disc">
            {(emotionCounts["Crying"] ?? 0) > 0 && <li>Crying detected — recommend one-on-one session with caregiver.</li>}
            {(emotionCounts["Aggressive"] ?? 0) > 0 && <li>Aggressive behavior detected — alert guardian and schedule behavior assessment.</li>}
            {(emotionCounts["Isolated"] ?? 0) > 0 && <li>Isolated child detected — encourage group play activities immediately.</li>}
            <li>Overall positive mood score: {Math.round(((emotionCounts["Happy"] ?? 0) / Math.max(alerts.length, 1)) * 100)}%</li>
          </ul>
        </div>
      </Card>

      {selected && (
        <Modal title="Behavior Alert Details" onClose={() => setSelected(null)} size="md">
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${emotionColor(selected.emotion)}`}>
              <div className="flex items-center gap-2 mb-1">
                {emotionIcon(selected.emotion)}
                <span className="text-sm" style={{ fontWeight: 600 }}>{selected.emotion} detected — {selected.childName}</span>
              </div>
              <p className="text-xs">Confidence: {selected.confidence}% · Camera: {selected.camera}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Child", value: selected.childName },
                { label: "Group", value: selected.group },
                { label: "Detected At", value: selected.time },
                { label: "Severity", value: selected.severity },
                { label: "Camera", value: selected.camera },
                { label: "Status", value: selected.acknowledged ? "Acknowledged" : "Pending" },
              ].map(f => (
                <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{f.label}</p>
                  <p className="text-sm text-gray-800 capitalize">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {!selected.acknowledged && (
                <Btn variant="primary" size="sm" onClick={() => { acknowledge(selected.id); setSelected(null); }}>
                  <CheckCircle size={14} /> Acknowledge
                </Btn>
              )}
              <Btn variant="secondary" size="sm" onClick={() => alert("Notifying parent via app and SMS...")}>
                <Bell size={14} /> Notify Parent
              </Btn>
              <Btn variant="secondary" size="sm" onClick={() => setSelected(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Smart Attendance Tab ─────────────────────────────────────────────────────

function SmartAttendanceTab() {
  const [logs, setLogs] = useState<AttendanceLog[]>(SEED_ATTENDANCE);
  const [scanMode, setScanMode] = useState<"Face Recognition" | "QR Code" | "GPS Pickup" | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ name: string; confidence: number; status: "success" | "fail" } | null>(null);
  const [qrValue, setQrValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const SCAN_CHILDREN = ["Lucas Moore", "Isabella Clark", "Mason White", "Ava Harris", "Elijah Scott"];

  function runScan(method: "Face Recognition" | "QR Code" | "GPS Pickup") {
    setScanning(true);
    setScanResult(null);
    timerRef.current = setTimeout(() => {
      const success = Math.random() > 0.15;
      const child = SCAN_CHILDREN[Math.floor(Math.random() * SCAN_CHILDREN.length)];
      const conf = success ? 85 + Math.floor(Math.random() * 14) : 45 + Math.floor(Math.random() * 20);
      setScanResult({ name: child, confidence: conf, status: success ? "success" : "fail" });
      if (success) {
        setLogs(prev => [{
          id: `a-live-${Date.now()}`,
          childName: child,
          method,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "In",
          confidence: conf,
          location: method === "GPS Pickup" ? "Bus Stop B" : "Main Entrance",
        }, ...prev]);
      }
      setScanning(false);
    }, 2000);
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const methodCount = (m: string) => logs.filter(l => l.method === m).length;

  const methods = [
    { method: "Face Recognition" as const, color: "text-indigo-600", bg: "bg-indigo-50" },
    { method: "QR Code" as const, color: "text-blue-600", bg: "bg-blue-50" },
    { method: "GPS Pickup" as const, color: "text-green-600", bg: "bg-green-50" },
    { method: "Manual" as const, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {methods.map(m => (
          <Card key={m.method} className="p-4">
            <p className={`text-2xl ${m.color}`} style={{ fontWeight: 700 }}>{methodCount(m.method)}</p>
            <p className="text-xs text-gray-500 mt-1">{m.method}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-gray-800 mb-4">Smart Attendance Scanner</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(["Face Recognition", "QR Code", "GPS Pickup"] as const).map(m => (
              <button key={m} onClick={() => { setScanMode(m); setScanResult(null); }}
                className={`p-3 rounded-xl border text-center transition-all ${scanMode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 text-gray-700"}`}>
                <div className="flex justify-center mb-1">
                  {m === "Face Recognition" ? <Camera size={18} /> : m === "QR Code" ? <QrCode size={18} /> : <MapPin size={18} />}
                </div>
                <p className="text-xs">{m}</p>
              </button>
            ))}
          </div>

          {scanMode === "QR Code" && (
            <input value={qrValue} onChange={e => setQrValue(e.target.value)}
              placeholder="Enter QR code or child ID..."
              className="w-full mb-3 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          )}

          {scanMode && (
            <div className="mb-4">
              <div className={`relative h-32 rounded-xl border-2 flex items-center justify-center mb-3 overflow-hidden transition-all ${
                scanning ? "border-indigo-400 bg-indigo-50"
                : scanResult?.status === "success" ? "border-green-400 bg-green-50"
                : scanResult?.status === "fail" ? "border-red-400 bg-red-50"
                : "border-dashed border-gray-300 bg-gray-50"
              }`}>
                {scanning ? (
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-indigo-600">Scanning {scanMode}...</p>
                  </div>
                ) : scanResult ? (
                  <div className="text-center">
                    {scanResult.status === "success"
                      ? <CheckCircle size={28} className="text-green-500 mx-auto mb-1" />
                      : <XCircle size={28} className="text-red-500 mx-auto mb-1" />}
                    <p className="text-sm" style={{ fontWeight: 600 }}>
                      {scanResult.status === "success" ? `✓ ${scanResult.name}` : "Scan Failed"}
                    </p>
                    <p className="text-xs text-gray-500">Confidence: {scanResult.confidence}%</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Ready to scan — click button below</p>
                )}
              </div>
              <Btn variant="primary" onClick={() => runScan(scanMode)} disabled={scanning}>
                {scanning ? "Scanning..." : `Scan ${scanMode}`}
              </Btn>
            </div>
          )}

          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs text-green-700" style={{ fontWeight: 600 }}>GPS Pickup Tracking Active</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-green-600 mt-1">
              <p>Bus A (VH-101): 3 children onboard</p>
              <p>Bus B (VH-102): 5 children onboard</p>
              <p>Last update: 30 sec ago</p>
              <p>ETA: 8 min to Entrance B</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Today's Attendance Log</h3>
            <span className="text-xs text-gray-400">{logs.length} entries</span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {logs.map(l => (
              <div key={l.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                  l.method === "Face Recognition" ? "bg-indigo-100 text-indigo-700"
                  : l.method === "QR Code" ? "bg-blue-100 text-blue-700"
                  : l.method === "GPS Pickup" ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
                }`}>
                  {l.childName.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{l.childName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span>{l.method}</span>
                    {l.confidence ? <span>· {l.confidence}%</span> : null}
                    {l.location ? <span>· {l.location}</span> : null}
                    <span>· {l.time}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  l.status === "In" ? "bg-green-100 text-green-700"
                  : l.status === "Out" ? "bg-gray-100 text-gray-600"
                  : "bg-yellow-100 text-yellow-700"
                }`}>{l.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [audit] = useState<AuditEntry[]>(SEED_AUDIT);
  const [auditFilter, setAuditFilter] = useState<"All" | "Success" | "Failed" | "Warning">("All");
  const [ipModal, setIpModal] = useState<AuditEntry | null>(null);

  const displayed = auditFilter === "All" ? audit : audit.filter(a => a.status === auditFilter);

  const securityFeatures = [
    { label: "AES-256 Encryption", sub: "All data encrypted at rest & transit", bg: "bg-indigo-50" },
    { label: "JWT Authentication", sub: "Token-based session management", bg: "bg-blue-50" },
    { label: `IP Tracking`, sub: `${audit.filter(a => a.status === "Failed").length} suspicious IPs flagged`, bg: "bg-orange-50" },
    { label: "Audit Logs", sub: `${audit.length} entries today`, bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {securityFeatures.map(k => (
          <Card key={k.label} className="p-4">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-2`}>
              <Shield size={18} className="text-indigo-500" />
            </div>
            <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{k.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
            <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-800">Audit Logs</h3>
            <Btn variant="secondary" size="sm" onClick={() => alert("Exporting audit log as CSV...")}>
              <Download size={14} /> Export
            </Btn>
          </div>
          <div className="flex gap-1 mb-3 flex-wrap">
            {(["All", "Success", "Failed", "Warning"] as const).map(f => (
              <button key={f} onClick={() => setAuditFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${auditFilter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {displayed.map(a => (
              <div key={a.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors ${
                  a.status === "Failed" ? "bg-red-50 border-red-100"
                  : a.status === "Warning" ? "bg-yellow-50 border-yellow-100"
                  : "bg-white border-gray-100"
                }`}
                onClick={() => setIpModal(a)}>
                <div className="mt-0.5 shrink-0"><AuditStatusIcon status={a.status} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-800" style={{ fontWeight: 600 }}>{a.user}</span>
                    <span className="text-xs text-gray-400">({a.role})</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${auditStatusColor(a.status)}`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{a.action}</p>
                  <p className="text-xs text-gray-400">{a.module} · {a.timestamp} · IP: {a.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-gray-800 mb-4">Role-Based Access Permissions</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {ROLE_PERMISSIONS.map(r => (
              <div key={r.role} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-gray-500" />
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.color}`} style={{ fontWeight: 600 }}>{r.role}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {r.permissions.map((p, pi) => (
                    <span key={`${r.role}-perm-${pi}`} className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-600">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800">Security Status Overview</h3>
          <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>System Secure</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Data Encryption", value: "AES-256", ok: true },
            { label: "Auth Method", value: "JWT + 2FA", ok: true },
            { label: "Failed Logins", value: "3 today", ok: false },
            { label: "Active Sessions", value: "4 devices", ok: true },
            { label: "Last Backup", value: "2 hrs ago", ok: true },
          ].map(s => (
            <div key={s.label} className={`p-3 rounded-xl border text-center ${s.ok ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
              <p className="text-sm" style={{ fontWeight: 700 }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${s.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {s.ok ? "OK" : "Alert"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {ipModal && (
        <Modal title="Audit Log Details" onClose={() => setIpModal(null)} size="sm">
          <div className="space-y-3">
            <div className={`p-3 rounded-xl ${auditStatusColor(ipModal.status)}`}>
              <div className="flex items-center gap-2">
                <AuditStatusIcon status={ipModal.status} />
                <span className="text-sm" style={{ fontWeight: 600 }}>{ipModal.status}</span>
              </div>
            </div>
            {[
              { label: "User", value: ipModal.user },
              { label: "Role", value: ipModal.role },
              { label: "Action", value: ipModal.action },
              { label: "Module", value: ipModal.module },
              { label: "Timestamp", value: ipModal.timestamp },
              { label: "IP Address", value: ipModal.ip },
            ].map(f => (
              <div key={f.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{f.label}</p>
                <p className="text-sm text-gray-800">{f.value}</p>
              </div>
            ))}
            {ipModal.status === "Failed" && (
              <Btn variant="danger" size="sm" onClick={() => { alert(`IP ${ipModal.ip} has been blocked.`); setIpModal(null); }}>
                <Shield size={14} /> Block IP
              </Btn>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Automation Tab ───────────────────────────────────────────────────────────

function AutomationTab() {
  const [tasks, setTasks] = useState<AutomationTask[]>(SEED_AUTOMATION);
  const [running, setRunning] = useState<string | null>(null);

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id
      ? { ...t, status: t.status === "Active" ? "Paused" : t.status === "Paused" ? "Active" : t.status }
      : t));
  }

  function triggerRun(id: string) {
    setRunning(id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "Running" } : t));
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === id
        ? { ...t, status: "Active", lastRun: "Just now", runs: t.runs + 1 }
        : t));
      setRunning(null);
    }, 2500);
  }

  const taskStatusColor: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Paused: "bg-gray-100 text-gray-600",
    Running: "bg-blue-100 text-blue-700",
    Failed: "bg-red-100 text-red-700",
  };

  function typeIcon(type: string) {
    if (type === "Report") return <FileText size={15} className="text-indigo-500" />;
    if (type === "Notification") return <Bell size={15} className="text-yellow-500" />;
    if (type === "GPS") return <MapPin size={15} className="text-green-500" />;
    if (type === "Email") return <MessageSquare size={15} className="text-blue-500" />;
    if (type === "AI") return <Brain size={15} className="text-purple-500" />;
    if (type === "Alert") return <AlertTriangle size={15} className="text-orange-500" />;
    return <Zap size={15} className="text-gray-500" />;
  }

  const activeCount = tasks.filter(t => t.status === "Active" || t.status === "Running").length;
  const totalRuns = tasks.reduce((sum, t) => sum + t.runs, 0);

  const automationKpis = [
    { label: "Active Automations", value: String(activeCount), sub: `of ${tasks.length} total`, color: "text-green-600" },
    { label: "Total Runs Today", value: totalRuns.toLocaleString(), sub: "All tasks combined", color: "text-indigo-600" },
    { label: "GPS Updates", value: "8,400+", sub: "Active tracking", color: "text-blue-600" },
    { label: "Reports Generated", value: "142", sub: "This month", color: "text-purple-600" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {automationKpis.map(k => (
          <Card key={k.label} className="p-4">
            <p className={`text-2xl ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
            <p className="text-xs text-gray-400">{k.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800">Automation Tasks</h3>
          <Btn variant="secondary" size="sm" onClick={() => alert("Add automation task — feature coming soon.")}>
            + New Task
          </Btn>
        </div>
        <div className="space-y-3">
          {tasks.map(t => (
            <div key={t.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              t.status === "Running" ? "bg-blue-50 border-blue-200"
              : t.status === "Failed" ? "bg-red-50 border-red-100"
              : t.status === "Paused" ? "bg-gray-50 border-gray-100 opacity-70"
              : "bg-white border-gray-100 hover:bg-gray-50"
            }`}>
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                {typeIcon(t.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{t.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${taskStatusColor[t.status] ?? "bg-gray-100 text-gray-600"}`}>{t.status}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{t.schedule}</p>
                <p className="text-xs text-gray-300">Last: {t.lastRun} · Next: {t.nextRun} · Runs: {t.runs.toLocaleString()}</p>
              </div>
              {t.status === "Running" ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => triggerRun(t.id)} disabled={running !== null}
                    title="Run now"
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-500 transition-colors disabled:opacity-40">
                    <Play size={13} />
                  </button>
                  <button onClick={() => toggleTask(t.id)}
                    title={t.status === "Active" ? "Pause" : "Activate"}
                    className={`p-1.5 rounded-lg transition-colors ${t.status === "Paused" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"}`}>
                    {t.status === "Paused" ? <Play size={13} /> : <XCircle size={13} />}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-gray-800 mb-3">Notification Channels</h3>
          <div className="space-y-2">
            {[
              { channel: "In-App Notifications", count: "12 sent today" },
              { channel: "SMS Alerts", count: "8 sent today" },
              { channel: "Email Reports", count: "3 sent today" },
              { channel: "Push Notifications", count: "24 sent today" },
            ].map(n => (
              <div key={n.channel} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Bell size={14} className="text-indigo-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{n.channel}</p>
                  <p className="text-xs text-gray-400">{n.count}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-gray-800 mb-3">System Health</h3>
          <div className="space-y-3">
            {[
              { label: "API Response Time", value: "124ms", pct: 85, color: "bg-green-400" },
              { label: "Database Load", value: "23%", pct: 23, color: "bg-blue-400" },
              { label: "Memory Usage", value: "61%", pct: 61, color: "bg-yellow-400" },
              { label: "Storage Used", value: "38%", pct: 38, color: "bg-indigo-400" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-36 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-12 text-right">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
            <Server size={12} />
            <span>All systems operational · Last checked 30 sec ago</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS: { id: AITab; label: string }[] = [
  { id: "ai-monitoring", label: "AI Monitoring" },
  { id: "smart-attendance", label: "Smart Attendance" },
  { id: "security", label: "Security & Audit" },
  { id: "automation", label: "Automation" },
];

export function AICenter() {
  const [tab, setTab] = useState<AITab>("ai-monitoring");

  return (
    <div>
      <PageHeader
        title="AI & Security Center"
        subtitle="Advanced monitoring, smart attendance, security logs & system automation"
      />

      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
              tab === t.id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ai-monitoring" && <AIMonitoringTab />}
      {tab === "smart-attendance" && <SmartAttendanceTab />}
      {tab === "security" && <SecurityTab />}
      {tab === "automation" && <AutomationTab />}
    </div>
  );
}

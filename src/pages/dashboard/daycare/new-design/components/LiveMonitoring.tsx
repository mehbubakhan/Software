import { useState, useEffect, useRef } from "react";
import {
  Camera, Wifi, WifiOff, Maximize2, Minimize2, RefreshCw, Activity,
  Bell, BellOff, Download, Play, Square, Volume2, VolumeX,
  MapPin, AlertTriangle, Shield, Eye, Lock, Unlock, X, ChevronRight,
  Radio, Zap, Navigation, Users, Baby, Car
} from "lucide-react";
import { Card, PageHeader, Btn, Modal, Badge } from "./ui";

// ── Types ──────────────────────────────────────────────────────
interface CameraFeed {
  id: number;
  name: string;
  category: CameraCategory;
  status: "Live" | "Offline" | "Recording";
  children: number;
  staff: number;
  alertsEnabled: boolean;
  muted: boolean;
  hasMotion: boolean;
  hasSound: boolean;
  parentAccessible: boolean;
  recording: boolean;
  resolution: string;
}

interface AlertEvent {
  id: string;
  time: string;
  camera: string;
  event: string;
  type: "info" | "warning" | "danger" | "success";
  acknowledged: boolean;
}

interface ChildLocation {
  id: string;
  name: string;
  zone: string;
  lastSeen: string;
  status: "Safe" | "Alert" | "Pickup";
  group: string;
}

interface PlaybackSlot {
  time: string;
  hasRecording: boolean;
}

type CameraCategory = "Classroom" | "Sleeping Room" | "Playground" | "Dining Area" | "Entrance" | "Transport Vehicle";

// ── Constants ─────────────────────────────────────────────────
const CATEGORIES: CameraCategory[] = ["Classroom", "Sleeping Room", "Playground", "Dining Area", "Entrance", "Transport Vehicle"];

const CAT_ICONS: Record<CameraCategory, React.ReactNode> = {
  "Classroom": <Baby size={12} />,
  "Sleeping Room": <Shield size={12} />,
  "Playground": <Users size={12} />,
  "Dining Area": <Activity size={12} />,
  "Entrance": <Lock size={12} />,
  "Transport Vehicle": <Car size={12} />,
};

const CAT_COLORS: Record<CameraCategory, string> = {
  "Classroom": "bg-indigo-100 text-indigo-700",
  "Sleeping Room": "bg-purple-100 text-purple-700",
  "Playground": "bg-green-100 text-green-700",
  "Dining Area": "bg-amber-100 text-amber-700",
  "Entrance": "bg-red-100 text-red-700",
  "Transport Vehicle": "bg-blue-100 text-blue-700",
};

const FEED_GRADIENTS = [
  "from-indigo-950 to-indigo-800",
  "from-blue-950 to-blue-800",
  "from-purple-950 to-purple-800",
  "from-gray-900 to-gray-700",
  "from-slate-900 to-slate-700",
  "from-violet-950 to-violet-800",
  "from-zinc-900 to-zinc-700",
  "from-teal-950 to-teal-800",
  "from-sky-950 to-sky-800",
];

const ZONES = ["Sunflower Room", "Butterfly Room", "Rainbow Room", "Star Room", "Playground", "Sleeping Room", "Dining Area", "Entrance"];

// ── Seed Data ─────────────────────────────────────────────────
const initialCameras: CameraFeed[] = [
  { id: 1, name: "Sunflower Classroom", category: "Classroom", status: "Live", children: 5, staff: 1, alertsEnabled: true, muted: false, hasMotion: true, hasSound: false, parentAccessible: true, recording: true, resolution: "1080p" },
  { id: 2, name: "Butterfly Classroom", category: "Classroom", status: "Live", children: 4, staff: 1, alertsEnabled: true, muted: false, hasMotion: false, hasSound: false, parentAccessible: true, recording: true, resolution: "1080p" },
  { id: 3, name: "Nap Room A", category: "Sleeping Room", status: "Live", children: 3, staff: 1, alertsEnabled: true, muted: true, hasMotion: false, hasSound: false, parentAccessible: false, recording: false, resolution: "720p" },
  { id: 4, name: "Main Playground", category: "Playground", status: "Live", children: 8, staff: 2, alertsEnabled: true, muted: false, hasMotion: true, hasSound: true, parentAccessible: false, recording: true, resolution: "1080p" },
  { id: 5, name: "Dining Hall", category: "Dining Area", status: "Live", children: 12, staff: 3, alertsEnabled: false, muted: false, hasMotion: false, hasSound: false, parentAccessible: false, recording: false, resolution: "720p" },
  { id: 6, name: "Main Entrance", category: "Entrance", status: "Live", children: 0, staff: 1, alertsEnabled: true, muted: false, hasMotion: false, hasSound: false, parentAccessible: false, recording: true, resolution: "4K" },
  { id: 7, name: "Side Entrance", category: "Entrance", status: "Offline", children: 0, staff: 0, alertsEnabled: false, muted: true, hasMotion: false, hasSound: false, parentAccessible: false, recording: false, resolution: "1080p" },
  { id: 8, name: "Bus CAM-1 (North)", category: "Transport Vehicle", status: "Live", children: 4, staff: 1, alertsEnabled: true, muted: false, hasMotion: true, hasSound: false, parentAccessible: true, recording: true, resolution: "720p" },
  { id: 9, name: "Bus CAM-2 (South)", category: "Transport Vehicle", status: "Recording", children: 3, staff: 1, alertsEnabled: true, muted: false, hasMotion: false, hasSound: false, parentAccessible: true, recording: true, resolution: "720p" },
];

const initialAlerts: AlertEvent[] = [
  { id: "a1", time: "10:34 AM", camera: "Main Playground", event: "AI: Motion spike — 8 children running near fence", type: "warning", acknowledged: false },
  { id: "a2", time: "10:20 AM", camera: "Main Entrance", event: "Pickup alert — Parent Sarah Johnson arrived", type: "success", acknowledged: false },
  { id: "a3", time: "10:05 AM", camera: "Main Entrance", event: "Restricted zone: Unrecognized person detected", type: "danger", acknowledged: false },
  { id: "a4", time: "09:55 AM", camera: "Sunflower Classroom", event: "AI: Child fall detected — staff responded", type: "warning", acknowledged: true },
  { id: "a5", time: "09:30 AM", camera: "Dining Hall", event: "Meal service started", type: "info", acknowledged: true },
  { id: "a6", time: "09:15 AM", camera: "Nap Room A", event: "AI: Sound detected during nap time", type: "warning", acknowledged: false },
];

const initialLocations: ChildLocation[] = [
  { id: "cl1", name: "Emma Wilson", zone: "Sunflower Room", lastSeen: "10:32 AM", status: "Safe", group: "Sunflower" },
  { id: "cl2", name: "Liam Brown", zone: "Playground", lastSeen: "10:34 AM", status: "Safe", group: "Butterfly" },
  { id: "cl3", name: "Olivia Davis", zone: "Sleeping Room", lastSeen: "10:20 AM", status: "Safe", group: "Rainbow" },
  { id: "cl4", name: "Noah Garcia", zone: "Dining Area", lastSeen: "10:30 AM", status: "Safe", group: "Star" },
  { id: "cl5", name: "Ava Martinez", zone: "Entrance", lastSeen: "10:35 AM", status: "Pickup", group: "Sunflower" },
  { id: "cl6", name: "James Lee", zone: "Classroom", lastSeen: "09:45 AM", status: "Alert", group: "Butterfly" },
];

const playbackSlots: PlaybackSlot[] = Array.from({ length: 12 }, (_, i) => ({
  time: `${String(8 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  hasRecording: [0, 1, 2, 4, 5, 7, 8, 9].includes(i),
}));

// ── Component ─────────────────────────────────────────────────
type ModalType = "fullscreen" | "playback" | "parentAccess" | "download" | null;

export function LiveMonitoring() {
  const [cameras, setCameras] = useState<CameraFeed[]>(initialCameras);
  const [alerts, setAlerts] = useState<AlertEvent[]>(initialAlerts);
  const [locations] = useState<ChildLocation[]>(initialLocations);
  const [selectedCam, setSelectedCam] = useState<CameraFeed | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [filterCat, setFilterCat] = useState<CameraCategory | "All">("All");
  const [activeTab, setActiveTab] = useState<"grid" | "alerts" | "gps" | "parent">("grid");
  const [refreshed, setRefreshed] = useState(false);
  const [playbackTime, setPlaybackTime] = useState("08:00");
  const [playbackPlaying, setPlaybackPlaying] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [gpsTrailStep, setGpsTrailStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate GPS trail animation
  useEffect(() => {
    const t = setInterval(() => setGpsTrailStep(s => (s + 1) % 5), 1200);
    return () => clearInterval(t);
  }, []);

  // Simulate new motion alerts
  useEffect(() => {
    const t = setTimeout(() => {
      setAlerts(prev => [{
        id: `a-live-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        camera: "Main Playground",
        event: "AI: Movement detected near restricted zone",
        type: "warning",
        acknowledged: false,
      }, ...prev.slice(0, 19)]);
    }, 12000);
    return () => clearTimeout(t);
  }, []);

  function refresh() {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1500);
  }

  function toggleAlerts(id: number) {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, alertsEnabled: !c.alertsEnabled } : c));
  }

  function toggleMute(id: number) {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, muted: !c.muted } : c));
  }

  function acknowledgeAlert(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }

  function dismissAlert(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  function openFullscreen(cam: CameraFeed) {
    setSelectedCam(cam); setModal("fullscreen");
  }

  function openPlayback(cam: CameraFeed) {
    setSelectedCam(cam); setPlaybackPlaying(false); setPlaybackTime("08:00"); setModal("playback");
  }

  function startDownload(cam: CameraFeed) {
    setSelectedCam(cam); setDownloadProgress(0); setModal("download");
    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => setModal(null), 800);
      }
      setDownloadProgress(Math.min(100, p));
    }, 400);
  }

  const filtered = cameras.filter(c => filterCat === "All" || c.category === filterCat);
  const liveCams = cameras.filter(c => c.status === "Live" || c.status === "Recording").length;
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;

  const alertColors: Record<string, string> = {
    danger: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };
  const alertDots: Record<string, string> = {
    danger: "bg-red-500", warning: "bg-amber-500", info: "bg-blue-500", success: "bg-green-500"
  };

  return (
    <div>
      <PageHeader
        title="Live Monitoring & CCTV"
        subtitle={`${liveCams}/${cameras.length} cameras online · ${unacknowledged} unacknowledged alerts`}
        action={
          <div className="flex gap-2">
            {unacknowledged > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200 animate-pulse">
                <AlertTriangle size={14} /> {unacknowledged} Alerts
              </span>
            )}
            <Btn variant="secondary" onClick={refresh}>
              <RefreshCw size={15} className={refreshed ? "animate-spin" : ""} /> Refresh
            </Btn>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Live Cameras", value: liveCams, icon: <Radio size={18} />, color: "text-green-600 bg-green-50 border-green-200" },
          { label: "Offline", value: cameras.filter(c => c.status === "Offline").length, icon: <WifiOff size={18} />, color: "text-red-600 bg-red-50 border-red-200" },
          { label: "Children Visible", value: cameras.reduce((s, c) => s + c.children, 0), icon: <Baby size={18} />, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
          { label: "Active Alerts", value: unacknowledged, icon: <AlertTriangle size={18} />, color: "text-amber-600 bg-amber-50 border-amber-200" },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-3 rounded-xl border p-3 ${s.color}`}>
            <div className="opacity-70">{s.icon}</div>
            <div>
              <p className="text-xl" style={{ fontWeight: 700 }}>{s.value}</p>
              <p className="text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {([["grid", "Camera Grid"], ["alerts", `AI Alerts ${unacknowledged > 0 ? `(${unacknowledged})` : ""}`], ["gps", "GPS Tracking"], ["parent", "Parent Access"]] as [typeof activeTab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm transition-colors ${activeTab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Camera Grid Tab ── */}
      {activeTab === "grid" && (
        <div>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setFilterCat("All")}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${filterCat === "All" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
              All Cameras
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all ${filterCat === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                {CAT_ICONS[cat]} {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((cam, i) => (
              <div key={cam.id} className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Feed */}
                <div className={`bg-gradient-to-br ${FEED_GRADIENTS[i % FEED_GRADIENTS.length]} h-36 relative`}>
                  {cam.status !== "Offline" ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera size={28} className="text-white/20" />
                      {/* Simulated scanlines */}
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)" }} />
                      {cam.hasMotion && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <WifiOff size={24} className="text-white/30 mb-1" />
                      <p className="text-white/30 text-xs">Offline</p>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {cam.status === "Live" && (
                      <span className="flex items-center gap-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                      </span>
                    )}
                    {cam.status === "Recording" && (
                      <span className="flex items-center gap-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        <Square size={8} className="fill-white" /> REC
                      </span>
                    )}
                    {cam.hasSound && <span className="bg-purple-500/80 text-white text-xs px-1.5 py-0.5 rounded-full">🔊</span>}
                  </div>

                  {/* Category badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${CAT_COLORS[cam.category]} bg-opacity-90`}>
                      {CAT_ICONS[cam.category]} {cam.category}
                    </span>
                  </div>

                  {/* Resolution */}
                  <div className="absolute bottom-2 right-2 text-white/50 text-xs">{cam.resolution}</div>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs" style={{ fontWeight: 600 }}>{cam.name}</p>
                      <p className="text-xs text-gray-400">
                        {cam.children > 0 ? `${cam.children} children` : "Empty"} · {cam.staff} staff
                      </p>
                    </div>
                    {cam.parentAccessible && <span className="text-xs text-indigo-500" title="Parent accessible"><Eye size={12} /></span>}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1">
                    <button onClick={() => openFullscreen(cam)} disabled={cam.status === "Offline"}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <Maximize2 size={11} /> Full
                    </button>
                    <button onClick={() => openPlayback(cam)} disabled={!cam.recording}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <Play size={11} /> Play
                    </button>
                    <button onClick={() => startDownload(cam)} disabled={!cam.recording}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <Download size={11} /> Save
                    </button>
                    <button onClick={() => toggleAlerts(cam.id)}
                      className={`px-1.5 py-1 rounded-lg text-xs transition-colors ${cam.alertsEnabled ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                      title={cam.alertsEnabled ? "Disable Alerts" : "Enable Alerts"}>
                      {cam.alertsEnabled ? <Bell size={11} /> : <BellOff size={11} />}
                    </button>
                    <button onClick={() => toggleMute(cam.id)}
                      className={`px-1.5 py-1 rounded-lg text-xs transition-colors ${cam.muted ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600"}`}
                      title={cam.muted ? "Unmute" : "Mute"}>
                      {cam.muted ? <VolumeX size={11} /> : <Volume2 size={11} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Alerts Tab ── */}
      {activeTab === "alerts" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">{unacknowledged} unacknowledged · {alerts.length} total</p>
            <Btn variant="secondary" size="sm" onClick={() => setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })))}>
              Acknowledge All
            </Btn>
          </div>
          {alerts.map(alert => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl border ${alertColors[alert.type]} ${alert.acknowledged ? "opacity-50" : ""}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alertDots[alert.type]}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs" style={{ fontWeight: 600 }}>{alert.camera}</span>
                  <span className="text-xs opacity-60">{alert.time}</span>
                  {!alert.acknowledged && <span className="px-1.5 py-0.5 rounded-full text-xs bg-white/70" style={{ fontWeight: 600 }}>NEW</span>}
                </div>
                <p className="text-xs">{alert.event}</p>
              </div>
              <div className="flex gap-1">
                {!alert.acknowledged && (
                  <button onClick={() => acknowledgeAlert(alert.id)}
                    className="p-1 rounded hover:bg-white/50 transition-colors" title="Acknowledge">
                    <Shield size={12} />
                  </button>
                )}
                <button onClick={() => dismissAlert(alert.id)}
                  className="p-1 rounded hover:bg-white/50 transition-colors" title="Dismiss">
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Shield size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No alerts — all clear</p>
            </div>
          )}
        </div>
      )}

      {/* ── GPS Tracking Tab ── */}
      {activeTab === "gps" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Map area */}
          <div>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Indoor Location Map</h3>
                <span className="text-xs text-gray-400">Updates every 30s</span>
              </div>
              {/* Simulated floor plan */}
              <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ height: 320 }}>
                {/* Rooms */}
                {[
                  { label: "Sunflower", x: "5%", y: "5%", w: "40%", h: "30%", color: "bg-yellow-100 border-yellow-300" },
                  { label: "Butterfly", x: "55%", y: "5%", w: "40%", h: "30%", color: "bg-blue-100 border-blue-300" },
                  { label: "Playground", x: "5%", y: "42%", w: "55%", h: "35%", color: "bg-green-100 border-green-300" },
                  { label: "Sleeping", x: "65%", y: "42%", w: "30%", h: "35%", color: "bg-purple-100 border-purple-300" },
                  { label: "Dining", x: "5%", y: "82%", w: "40%", h: "14%", color: "bg-amber-100 border-amber-300" },
                  { label: "Entrance", x: "50%", y: "82%", w: "45%", h: "14%", color: "bg-red-100 border-red-300" },
                ].map(room => (
                  <div key={room.label} className={`absolute border-2 rounded-lg flex items-center justify-center ${room.color}`}
                    style={{ left: room.x, top: room.y, width: room.w, height: room.h }}>
                    <span className="text-xs text-gray-500">{room.label}</span>
                  </div>
                ))}

                {/* Child location dots */}
                {locations.map((child, idx) => {
                  const positions: Record<string, { left: string; top: string }> = {
                    "Sunflower Room": { left: "22%", top: "17%" },
                    "Playground": { left: "28%", top: "57%" },
                    "Sleeping Room": { left: "76%", top: "57%" },
                    "Dining Area": { left: "22%", top: "88%" },
                    "Entrance": { left: "65%", top: "88%" },
                    "Classroom": { left: "73%", top: "17%" },
                  };
                  const pos = positions[child.zone] ?? { left: "50%", top: "50%" };
                  const offset = { left: `calc(${pos.left} + ${(idx % 3) * 18 - 18}px)`, top: `calc(${pos.top} + ${Math.floor(idx / 3) * 18}px)` };
                  return (
                    <div key={child.id} className="absolute" style={offset} title={`${child.name} — ${child.zone}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-sm ${child.status === "Alert" ? "bg-red-500 animate-pulse" : child.status === "Pickup" ? "bg-amber-500" : "bg-indigo-500"}`}
                        style={{ fontWeight: 700, fontSize: 9 }}>
                        {child.name[0]}
                      </div>
                    </div>
                  );
                })}

                {/* GPS trail animation */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/80 rounded-full px-2 py-1 text-xs text-gray-500">
                  <Navigation size={10} className="text-indigo-500 animate-spin" style={{ animationDuration: "3s" }} />
                  GPS Live
                </div>
              </div>

              {/* Zone legend */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[["Safe", "bg-indigo-500"], ["Pickup Ready", "bg-amber-500"], ["Alert", "bg-red-500"]].map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2.5 h-2.5 rounded-full ${color}`} /> {label}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Child location list */}
          <div>
            <Card className="p-4">
              <h3 className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Child Location Tracker</h3>
              <div className="space-y-2">
                {locations.map(child => (
                  <div key={child.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${child.status === "Alert" ? "bg-red-50 border-red-200" : child.status === "Pickup" ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs border-2 ${child.status === "Alert" ? "bg-red-500 border-red-300" : child.status === "Pickup" ? "bg-amber-500 border-amber-300" : "bg-indigo-500 border-indigo-300"}`}
                      style={{ fontWeight: 700 }}>
                      {child.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs" style={{ fontWeight: 600 }}>{child.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={10} /> {child.zone} · {child.lastSeen}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${child.status === "Alert" ? "bg-red-100 text-red-700" : child.status === "Pickup" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {child.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Safe zone status */}
            <Card className="p-4 mt-4">
              <h3 className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Zone Occupancy</h3>
              <div className="space-y-2">
                {ZONES.slice(0, 6).map((zone, i) => {
                  const count = locations.filter(l => l.zone === zone || l.zone.includes(zone.split(" ")[0])).length;
                  const max = [6, 6, 4, 4, 8, 3][i];
                  return (
                    <div key={zone} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600 w-28 text-xs truncate">{zone}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-indigo-400 transition-all" style={{ width: `${Math.min(100, (count / max) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">{count}/{max}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Parent Access Tab ── */}
      {activeTab === "parent" && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-700">
            <p style={{ fontWeight: 600 }} className="mb-1">Parent CCTV Access Policy</p>
            <p className="text-xs text-indigo-600">Parents can only view cameras in rooms where their child is currently assigned. Access is time-limited (30 min per session) and logged for security compliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameras.filter(c => c.parentAccessible).map((cam, i) => (
              <Card key={cam.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${FEED_GRADIENTS[i % FEED_GRADIENTS.length]} flex items-center justify-center`}>
                    <Camera size={18} className="text-white/70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ fontWeight: 600 }}>{cam.name}</p>
                    <p className="text-xs text-gray-400">{cam.category} · {cam.resolution}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${cam.status === "Live" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {cam.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Users size={11} /> {cam.children} children visible</span>
                  <span className="flex items-center gap-1"><Lock size={11} /> Encrypted stream</span>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" onClick={() => openFullscreen(cam)} disabled={cam.status === "Offline"}>
                    <Play size={12} /> Watch Live Feed
                  </Btn>
                  <Btn variant="secondary" size="sm" onClick={() => openPlayback(cam)} disabled={!cam.recording}>
                    <RefreshCw size={12} /> View Playback
                  </Btn>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4">
            <h3 className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Access Log</h3>
            <div className="space-y-2 text-sm">
              {[
                { parent: "Sarah Johnson", camera: "Sunflower Classroom", time: "10:20 AM", duration: "12 min", action: "Live View" },
                { parent: "Michael Brown", camera: "Bus CAM-1 (North)", time: "09:45 AM", duration: "5 min", action: "Live View" },
                { parent: "Emily Davis", camera: "Butterfly Classroom", time: "09:30 AM", duration: "8 min", action: "Playback" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p style={{ fontWeight: 500 }}>{log.parent}</p>
                    <p className="text-xs text-gray-400">{log.camera} · {log.time} · {log.duration}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600">{log.action}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Fullscreen Modal ── */}
      {modal === "fullscreen" && selectedCam && (
        <Modal title={`${selectedCam.name} — Live Feed`} onClose={() => setModal(null)} size="xl">
          <div className={`bg-gradient-to-br ${FEED_GRADIENTS[selectedCam.id % FEED_GRADIENTS.length]} rounded-xl overflow-hidden`} style={{ height: 400 }}>
            <div className="relative h-full flex items-center justify-center">
              <Camera size={48} className="text-white/20" />
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)" }} />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                </span>
                <span className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">{selectedCam.resolution}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-white/70 text-xs">{selectedCam.name} · {selectedCam.category}</span>
                <span className="text-white/70 text-xs">{selectedCam.children} children · {selectedCam.staff} staff</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Btn onClick={() => { setModal(null); openPlayback(selectedCam); }}><Play size={14} /> View Playback</Btn>
            <Btn variant="secondary" onClick={() => startDownload(selectedCam)}><Download size={14} /> Download</Btn>
            <Btn variant={selectedCam.alertsEnabled ? "danger" : "secondary"} onClick={() => { toggleAlerts(selectedCam.id); }}>
              {selectedCam.alertsEnabled ? <><BellOff size={14} /> Disable Alerts</> : <><Bell size={14} /> Enable Alerts</>}
            </Btn>
            <Btn variant="secondary" onClick={() => toggleMute(selectedCam.id)} className="ml-auto">
              {selectedCam.muted ? <><Volume2 size={14} /> Unmute</> : <><VolumeX size={14} /> Mute</>}
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── Playback Modal ── */}
      {modal === "playback" && selectedCam && (
        <Modal title={`${selectedCam.name} — Playback`} onClose={() => setModal(null)} size="xl">
          <div className={`bg-gradient-to-br ${FEED_GRADIENTS[selectedCam.id % FEED_GRADIENTS.length]} rounded-xl overflow-hidden`} style={{ height: 300 }}>
            <div className="relative h-full flex items-center justify-center">
              {playbackPlaying ? (
                <>
                  <Camera size={40} className="text-white/20" />
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)" }} />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/40 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 text-white text-xs mb-1">
                        <span>{playbackTime}</span>
                        <div className="flex-1 bg-white/20 rounded-full h-1">
                          <div className="bg-white h-1 rounded-full w-1/3" />
                        </div>
                        <span>17:00</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Play size={40} className="text-white/40 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">Click play to start playback</p>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">{playbackTime}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Select recording time</p>
            <div className="flex gap-1 flex-wrap">
              {playbackSlots.map(slot => (
                <button key={slot.time} onClick={() => { if (slot.hasRecording) setPlaybackTime(slot.time); }}
                  className={`px-2 py-1 rounded text-xs transition-all ${slot.time === playbackTime ? "bg-indigo-600 text-white" : slot.hasRecording ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}>
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Btn onClick={() => setPlaybackPlaying(p => !p)}>
              {playbackPlaying ? <><Square size={14} /> Stop</> : <><Play size={14} /> Play</>}
            </Btn>
            <Btn variant="secondary" onClick={() => startDownload(selectedCam)}><Download size={14} /> Download Clip</Btn>
          </div>
        </Modal>
      )}

      {/* ── Download Modal ── */}
      {modal === "download" && selectedCam && (
        <Modal title="Downloading Recording" onClose={() => { if (timerRef.current) clearInterval(timerRef.current); setModal(null); }}>
          <div className="text-center py-4">
            <Download size={36} className="text-indigo-500 mx-auto mb-3" />
            <p className="text-sm text-gray-700 mb-1" style={{ fontWeight: 500 }}>{selectedCam.name}</p>
            <p className="text-xs text-gray-400 mb-5">Encrypting and preparing download…</p>
            <div className="bg-gray-100 rounded-full h-3 mb-2">
              <div className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress ?? 0}%` }} />
            </div>
            <p className="text-sm text-indigo-600" style={{ fontWeight: 600 }}>{Math.round(downloadProgress ?? 0)}%</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

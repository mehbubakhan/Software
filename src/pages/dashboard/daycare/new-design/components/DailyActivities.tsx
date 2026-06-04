import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import {
  Plus, Clock, Users, Pencil, Trash2, Calendar, Utensils, Moon,
  BookOpen, Smile, Pill, Droplets, Camera, FileText, Bell, X,
  Check, ChevronDown, ChevronRight, Sun, CloudRain, Zap, Heart,
  AlertCircle, Coffee, Wind, Play, Minus
} from "lucide-react";
import { Card, Modal, Input, Select, Textarea, Btn, PageHeader, Avatar, StatCard } from "./ui";
import { mockActivities as initial, mockChildren } from "./mockData";
import type { Activity } from "./types";

// ── Types ──────────────────────────────────────────────────────
type MealType = "Breakfast" | "Morning Snack" | "Lunch" | "Afternoon Snack" | "Dinner";
type MoodType = "Happy" | "Sad" | "Crying" | "Active" | "Aggressive" | "Sick" | "Calm";
type SleepQuality = "Good" | "Fair" | "Poor" | "Restless";

interface FoodEntry {
  id: string;
  meal: MealType;
  items: string;
  amount: "All" | "Half" | "Little" | "None";
  waterMl: number;
  time: string;
  notes: string;
}

interface SleepEntry {
  id: string;
  sleepTime: string;
  wakeTime: string;
  duration: number;
  quality: SleepQuality;
  notes: string;
}

interface EducationEntry {
  id: string;
  activity: string;
  category: "Alphabet" | "Numbers" | "Drawing" | "Reading" | "Story" | "Craft" | "Music" | "Science";
  completed: boolean;
  notes: string;
}

interface MoodEntry {
  id: string;
  time: string;
  mood: MoodType;
  notes: string;
}

interface MedicineEntry {
  id: string;
  medicine: string;
  dosage: string;
  time: string;
  given: boolean;
  givenBy: string;
  parentApproved: boolean;
  notes: string;
}

interface BathroomEntry {
  id: string;
  time: string;
  type: "Wet" | "Soiled" | "Both" | "Dry";
}

interface ChildDailyRecord {
  childId: string;
  childName: string;
  group: string;
  date: string;
  food: FoodEntry[];
  sleep: SleepEntry[];
  education: EducationEntry[];
  mood: MoodEntry[];
  medicine: MedicineEntry[];
  bathroom: BathroomEntry[];
  photos: { id: string; caption: string; time: string }[];
  parentNotified: boolean;
  reportGenerated: boolean;
}

// ── Constants ─────────────────────────────────────────────────
const GROUPS = ["Sunflower", "Butterfly", "Rainbow", "Star"];
const ACTIVITY_TYPES: Activity["type"][] = ["Educational", "Physical", "Arts", "Social", "Meal"];
const ACTIVITY_STATUSES: Activity["status"][] = ["Scheduled", "In Progress", "Completed", "Cancelled"];

const MOOD_CONFIG: { mood: MoodType; emoji: string; color: string }[] = [
  { mood: "Happy", emoji: "😊", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { mood: "Sad", emoji: "😢", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { mood: "Crying", emoji: "😭", color: "bg-indigo-100 text-indigo-700 border-indigo-300" },
  { mood: "Active", emoji: "⚡", color: "bg-green-100 text-green-700 border-green-300" },
  { mood: "Aggressive", emoji: "😠", color: "bg-red-100 text-red-700 border-red-300" },
  { mood: "Sick", emoji: "🤒", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { mood: "Calm", emoji: "😌", color: "bg-purple-100 text-purple-700 border-purple-300" },
];

const AMOUNT_COLORS: Record<string, string> = {
  All: "bg-green-100 text-green-700",
  Half: "bg-yellow-100 text-yellow-700",
  Little: "bg-orange-100 text-orange-700",
  None: "bg-red-100 text-red-700",
};

const SLEEP_Q_COLORS: Record<SleepQuality, string> = {
  Good: "bg-green-100 text-green-700",
  Fair: "bg-yellow-100 text-yellow-700",
  Poor: "bg-orange-100 text-orange-700",
  Restless: "bg-red-100 text-red-700",
};

const typeColors: Record<string, string> = {
  Educational: "bg-blue-100 text-blue-700",
  Physical: "bg-green-100 text-green-700",
  Arts: "bg-pink-100 text-pink-700",
  Social: "bg-purple-100 text-purple-700",
  Meal: "bg-orange-100 text-orange-700",
};

const CAT_ICONS: Record<string, React.ReactNode> = {
  food: <Utensils size={16} />, sleep: <Moon size={16} />, education: <BookOpen size={16} />,
  mood: <Smile size={16} />, medicine: <Pill size={16} />, bathroom: <Droplets size={16} />,
};

// ── Seed data ──────────────────────────────────────────────────
function seedRecord(childId: string, childName: string, group: string): ChildDailyRecord {
  return {
    childId, childName, group,
    date: "2026-06-04",
    food: [
      { id: `f1-${childId}`, meal: "Breakfast", items: "Oatmeal, banana, milk", amount: "All", waterMl: 200, time: "08:00", notes: "" },
      { id: `f2-${childId}`, meal: "Morning Snack", items: "Apple slices, crackers", amount: "Half", waterMl: 150, time: "10:00", notes: "Ate slowly" },
      { id: `f3-${childId}`, meal: "Lunch", items: "Rice, chicken, vegetables", amount: "All", waterMl: 250, time: "12:00", notes: "" },
    ],
    sleep: [
      { id: `s1-${childId}`, sleepTime: "13:00", wakeTime: "14:30", duration: 1.5, quality: "Good", notes: "" },
    ],
    education: [
      { id: `e1-${childId}`, activity: "Alphabet A–D practice", category: "Alphabet", completed: true, notes: "" },
      { id: `e2-${childId}`, activity: "Finger painting flowers", category: "Drawing", completed: true, notes: "Showed creativity" },
      { id: `e3-${childId}`, activity: "Story time — The Very Hungry Caterpillar", category: "Reading", completed: false, notes: "" },
    ],
    mood: [
      { id: `m1-${childId}`, time: "08:30", mood: "Happy", notes: "Excited about activities" },
      { id: `m2-${childId}`, time: "11:00", mood: "Active", notes: "" },
    ],
    medicine: [],
    bathroom: [
      { id: `b1-${childId}`, time: "09:15", type: "Wet" },
      { id: `b2-${childId}`, time: "11:30", type: "Soiled" },
    ],
    photos: [],
    parentNotified: false,
    reportGenerated: false,
  };
}

const CHILD_LIST = mockChildren.slice(0, 6).map((c, i) => ({
  childId: c.id,
  childName: c.name,
  group: ["Sunflower", "Butterfly", "Rainbow", "Star", "Sunflower", "Butterfly"][i],
}));

// ── Component ─────────────────────────────────────────────────
type MainTab = "tracker" | "schedule" | "report";
type TrackTab = "food" | "sleep" | "education" | "mood" | "medicine" | "bathroom";
type ModalType = "addActivity" | "editActivity" | "addFood" | "addSleep" | "addEducation" | "addMood" | "addMedicine" | "addPhoto" | "report" | "notify" | null;

const emptyActivity = {
  title: "", group: "All", date: "2026-06-04", time: "09:00 AM",
  instructor: "", type: "Educational" as Activity["type"], description: "", status: "Scheduled" as Activity["status"]
};

export function DailyActivities() {
  const [activities, setActivities] = useState<Activity[]>(initial);

  useEffect(() => {
    api.get('/daycare/portal/reports')
      .then((res: any) => setActivities(res.data))
      .catch((err: any) => console.error(err));
  }, []);
  const [records, setRecords] = useState<ChildDailyRecord[]>(() => CHILD_LIST.map(c => seedRecord(c.childId, c.childName, c.group)));
  const [mainTab, setMainTab] = useState<MainTab>("tracker");
  const [trackTab, setTrackTab] = useState<TrackTab>("food");
  const [selectedChild, setSelectedChild] = useState<ChildDailyRecord>(records[0]);
  const [filterGroup, setFilterGroup] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [actForm, setActForm] = useState(emptyActivity);

  // Form state for sub-entries
  const [foodForm, setFoodForm] = useState({ meal: "Breakfast" as MealType, items: "", amount: "All" as FoodEntry["amount"], waterMl: 200, time: "", notes: "" });
  const [sleepForm, setSleepForm] = useState({ sleepTime: "13:00", wakeTime: "14:30", quality: "Good" as SleepQuality, notes: "" });
  const [eduForm, setEduForm] = useState({ activity: "", category: "Alphabet" as EducationEntry["category"], notes: "" });
  const [moodForm, setMoodForm] = useState({ mood: "Happy" as MoodType, notes: "" });
  const [medForm, setMedForm] = useState({ medicine: "", dosage: "", time: "", givenBy: "Nurse Rachel", parentApproved: false, notes: "" });
  const [photoCaption, setPhotoCaption] = useState("");
  const [notifyMsg, setNotifyMsg] = useState("");

  const cur = records.find(r => r.childId === selectedChild.childId) ?? selectedChild;

  function updateRecord(childId: string, update: Partial<ChildDailyRecord>) {
    setRecords(prev => prev.map(r => r.childId === childId ? { ...r, ...update } : r));
    if (selectedChild.childId === childId) setSelectedChild(prev => ({ ...prev, ...update }));
  }

  // Activity CRUD
  function saveActivity() {
    if (modal === "addActivity") setActivities(prev => [...prev, { ...actForm, id: `act${Date.now()}` }]);
    else if (modal === "editActivity" && selectedActivity) setActivities(prev => prev.map(a => a.id === selectedActivity.id ? { ...actForm, id: a.id } : a));
    setModal(null);
  }
  function removeActivity(id: string) { if (confirm("Remove?")) setActivities(prev => prev.filter(a => a.id !== id)); }
  function updateStatus(id: string, status: Activity["status"]) { setActivities(prev => prev.map(a => a.id === id ? { ...a, status } : a)); }

  // Add food
  function addFood() {
    const entry: FoodEntry = { id: `f-${Date.now()}`, ...foodForm };
    updateRecord(cur.childId, { food: [...cur.food, entry] });
    setModal(null);
  }

  // Add sleep
  function addSleep() {
    const [sh, sm] = sleepForm.sleepTime.split(":").map(Number);
    const [wh, wm] = sleepForm.wakeTime.split(":").map(Number);
    const duration = Math.round(((wh * 60 + wm) - (sh * 60 + sm)) / 6) / 10;
    const entry: SleepEntry = { id: `sl-${Date.now()}`, ...sleepForm, duration: Math.max(0, duration) };
    updateRecord(cur.childId, { sleep: [...cur.sleep, entry] });
    setModal(null);
  }

  // Add education
  function addEducation() {
    const entry: EducationEntry = { id: `ed-${Date.now()}`, ...eduForm, completed: false };
    updateRecord(cur.childId, { education: [...cur.education, entry] });
    setModal(null);
  }

  function toggleEducation(id: string) {
    updateRecord(cur.childId, { education: cur.education.map(e => e.id === id ? { ...e, completed: !e.completed } : e) });
  }

  // Add mood
  function addMood() {
    const entry: MoodEntry = { id: `md-${Date.now()}`, time: new Date().toTimeString().slice(0, 5), ...moodForm };
    updateRecord(cur.childId, { mood: [...cur.mood, entry] });
    setModal(null);
  }

  // Add medicine
  function addMedicine() {
    const entry: MedicineEntry = { id: `med-${Date.now()}`, ...medForm, given: false };
    updateRecord(cur.childId, { medicine: [...cur.medicine, entry] });
    setModal(null);
  }

  function markMedicineGiven(id: string) {
    updateRecord(cur.childId, { medicine: cur.medicine.map(m => m.id === id ? { ...m, given: true } : m) });
  }

  // Add photo
  function addPhoto() {
    const photo = { id: `ph-${Date.now()}`, caption: photoCaption, time: new Date().toTimeString().slice(0, 5) };
    updateRecord(cur.childId, { photos: [...cur.photos, photo] });
    setPhotoCaption("");
    setModal(null);
  }

  // Add bathroom
  function addBathroom(type: BathroomEntry["type"]) {
    const entry: BathroomEntry = { id: `bt-${Date.now()}`, time: new Date().toTimeString().slice(0, 5), type };
    updateRecord(cur.childId, { bathroom: [...cur.bathroom, entry] });
  }

  // Notify parent
  function notifyParent() {
    updateRecord(cur.childId, { parentNotified: true });
    setModal(null);
  }

  // Generate report
  function generateReport() {
    updateRecord(cur.childId, { reportGenerated: true });
    setModal(null);
  }

  const filteredActivities = activities.filter(a => {
    const g = filterGroup === "All" || a.group === filterGroup;
    const t = filterType === "All" || a.type === filterType;
    return g && t;
  });

  const totalCompleted = activities.filter(a => a.status === "Completed").length;
  const inProgress = activities.filter(a => a.status === "In Progress").length;
  const totalFood = records.reduce((s, r) => s + r.food.length, 0);
  const pendingMeds = records.reduce((s, r) => s + r.medicine.filter(m => !m.given).length, 0);

  return (
    <div>
      <PageHeader
        title="Daily Activity Management"
        subtitle="Track children's daily routines — food, sleep, education, mood & more"
        action={<Btn onClick={() => { setActForm(emptyActivity); setModal("addActivity"); }}><Plus size={16} /> Add Activity</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Activities Completed" value={totalCompleted} color="green" icon={<Check size={20} />} />
        <StatCard label="In Progress" value={inProgress} color="blue" icon={<Play size={20} />} />
        <StatCard label="Meals Logged" value={totalFood} color="amber" icon={<Utensils size={20} />} />
        <StatCard label="Pending Medicines" value={pendingMeds} color="red" icon={<Pill size={20} />} />
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {([["tracker", "Per-Child Tracker"], ["schedule", "Activity Schedule"], ["report", "Daily Reports"]] as [MainTab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setMainTab(t)}
            className={`px-4 py-2 text-sm transition-colors ${mainTab === t ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Per-Child Tracker ── */}
      {mainTab === "tracker" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Child selector */}
          <div className="lg:col-span-1">
            <Card className="p-3">
              <p className="text-xs text-gray-500 mb-3 px-1" style={{ fontWeight: 600 }}>SELECT CHILD</p>
              <div className="space-y-1">
                {records.map(r => (
                  <button key={r.childId} onClick={() => setSelectedChild(r)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${selectedChild.childId === r.childId ? "bg-indigo-50 border border-indigo-200" : "hover:bg-gray-50"}`}>
                    <Avatar name={r.childName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate" style={{ fontWeight: 500 }}>{r.childName}</p>
                      <p className="text-xs text-gray-400">{r.group}</p>
                    </div>
                    {r.parentNotified && <Bell size={10} className="text-green-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <Card className="p-4">
              {/* Child header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <Avatar name={cur.childName} size="md" />
                <div className="flex-1">
                  <h3 style={{ fontWeight: 600 }}>{cur.childName}</h3>
                  <p className="text-xs text-gray-400">{cur.group} · {cur.date}</p>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" variant="secondary" onClick={() => { setPhotoCaption(""); setModal("addPhoto"); }}>
                    <Camera size={13} /> Photo
                  </Btn>
                  <Btn size="sm" variant="secondary" onClick={() => { setNotifyMsg(""); setModal("notify"); }}
                    className={cur.parentNotified ? "text-green-600" : ""}>
                    <Bell size={13} /> {cur.parentNotified ? "Notified" : "Notify Parent"}
                  </Btn>
                  <Btn size="sm" onClick={() => setModal("report")}>
                    <FileText size={13} /> Report
                  </Btn>
                </div>
              </div>

              {/* Track category tabs */}
              <div className="flex flex-wrap gap-1 mb-4">
                {(["food", "sleep", "education", "mood", "medicine", "bathroom"] as TrackTab[]).map(t => (
                  <button key={t} onClick={() => setTrackTab(t)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all capitalize ${trackTab === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                    {CAT_ICONS[t]} {t}
                  </button>
                ))}
              </div>

              {/* ── Food ── */}
              {trackTab === "food" && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Meals & Water Intake</p>
                    <Btn size="sm" onClick={() => { setFoodForm({ meal: "Breakfast", items: "", amount: "All", waterMl: 200, time: new Date().toTimeString().slice(0, 5), notes: "" }); setModal("addFood"); }}>
                      <Plus size={13} /> Add Meal
                    </Btn>
                  </div>
                  <div className="space-y-2">
                    {cur.food.map(entry => (
                      <div key={entry.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <Utensils size={16} className="text-amber-500 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-700" style={{ fontWeight: 600 }}>{entry.meal}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${AMOUNT_COLORS[entry.amount]}`}>{entry.amount}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{entry.items}</p>
                          {entry.notes && <p className="text-xs text-gray-400">{entry.notes}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-blue-500">💧 {entry.waterMl}ml</p>
                          <p className="text-xs text-gray-400">{entry.time}</p>
                        </div>
                      </div>
                    ))}
                    {cur.food.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No meals logged yet.</p>}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                    <Droplets size={14} className="text-blue-400" />
                    Total water: <strong>{cur.food.reduce((s, f) => s + f.waterMl, 0)}ml</strong>
                  </div>
                </div>
              )}

              {/* ── Sleep ── */}
              {trackTab === "sleep" && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Sleep Records</p>
                    <Btn size="sm" onClick={() => { setSleepForm({ sleepTime: "13:00", wakeTime: "14:30", quality: "Good", notes: "" }); setModal("addSleep"); }}>
                      <Plus size={13} /> Log Sleep
                    </Btn>
                  </div>
                  <div className="space-y-2">
                    {cur.sleep.map(entry => (
                      <div key={entry.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <Moon size={16} className="text-purple-500 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ fontWeight: 600 }}>{entry.sleepTime} → {entry.wakeTime}</span>
                            <span className="text-xs text-purple-600">({entry.duration}h)</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${SLEEP_Q_COLORS[entry.quality]}`}>{entry.quality}</span>
                          </div>
                          {entry.notes && <p className="text-xs text-gray-400 mt-0.5">{entry.notes}</p>}
                        </div>
                      </div>
                    ))}
                    {cur.sleep.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No sleep records yet.</p>}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                    Total sleep today: <strong>{cur.sleep.reduce((s, sl) => s + sl.duration, 0).toFixed(1)}h</strong>
                  </div>
                </div>
              )}

              {/* ── Education ── */}
              {trackTab === "education" && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Education Activities</p>
                    <Btn size="sm" onClick={() => { setEduForm({ activity: "", category: "Alphabet", notes: "" }); setModal("addEducation"); }}>
                      <Plus size={13} /> Add Activity
                    </Btn>
                  </div>
                  <div className="space-y-2">
                    {cur.education.map(entry => (
                      <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${entry.completed ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"}`}>
                        <button onClick={() => toggleEducation(entry.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${entry.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-400"}`}>
                          {entry.completed && <Check size={12} className="text-white" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700`}>{entry.category}</span>
                          </div>
                          <p className={`text-xs mt-0.5 ${entry.completed ? "line-through text-gray-400" : "text-gray-700"}`}>{entry.activity}</p>
                          {entry.notes && <p className="text-xs text-gray-400">{entry.notes}</p>}
                        </div>
                        <span className={`text-xs ${entry.completed ? "text-green-600" : "text-gray-400"}`}>{entry.completed ? "Done" : "Pending"}</span>
                      </div>
                    ))}
                    {cur.education.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No education activities yet.</p>}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                    Completed: <strong>{cur.education.filter(e => e.completed).length}/{cur.education.length}</strong>
                  </div>
                </div>
              )}

              {/* ── Mood ── */}
              {trackTab === "mood" && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Mood Tracker</p>
                    <Btn size="sm" onClick={() => { setMoodForm({ mood: "Happy", notes: "" }); setModal("addMood"); }}>
                      <Plus size={13} /> Log Mood
                    </Btn>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {MOOD_CONFIG.map(mc => (
                      <button key={mc.mood} onClick={() => { setMoodForm({ mood: mc.mood, notes: "" }); setModal("addMood"); }}
                        className={`p-2 rounded-xl border text-center hover:shadow-sm transition-all ${mc.color}`}>
                        <span className="text-xl block mb-0.5">{mc.emoji}</span>
                        <span className="text-xs">{mc.mood}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {cur.mood.map(entry => {
                      const mc = MOOD_CONFIG.find(m => m.mood === entry.mood);
                      return (
                        <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-xl border ${mc?.color ?? ""}`}>
                          <span className="text-xl">{mc?.emoji}</span>
                          <div className="flex-1">
                            <span className="text-xs" style={{ fontWeight: 600 }}>{entry.mood}</span>
                            {entry.notes && <p className="text-xs opacity-70">{entry.notes}</p>}
                          </div>
                          <span className="text-xs opacity-60">{entry.time}</span>
                        </div>
                      );
                    })}
                    {cur.mood.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No mood entries yet.</p>}
                  </div>
                </div>
              )}

              {/* ── Medicine ── */}
              {trackTab === "medicine" && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Medicine Schedule</p>
                    <Btn size="sm" onClick={() => { setMedForm({ medicine: "", dosage: "", time: "", givenBy: "Nurse Rachel", parentApproved: false, notes: "" }); setModal("addMedicine"); }}>
                      <Plus size={13} /> Add Medicine
                    </Btn>
                  </div>
                  <div className="space-y-2">
                    {cur.medicine.map(entry => (
                      <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-xl border ${entry.given ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                        <Pill size={16} className={entry.given ? "text-green-500" : "text-red-500"} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ fontWeight: 600 }}>{entry.medicine}</span>
                            <span className="text-xs text-gray-500">{entry.dosage}</span>
                            {entry.parentApproved && <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Parent Approved</span>}
                          </div>
                          <p className="text-xs text-gray-400">{entry.time} · {entry.givenBy}</p>
                          {entry.notes && <p className="text-xs text-gray-400">{entry.notes}</p>}
                        </div>
                        {!entry.given ? (
                          <Btn size="sm" variant="success" onClick={() => markMedicineGiven(entry.id)}>
                            <Check size={12} /> Mark Given
                          </Btn>
                        ) : (
                          <span className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Given</span>
                        )}
                      </div>
                    ))}
                    {cur.medicine.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No medicines scheduled.</p>}
                  </div>
                </div>
              )}

              {/* ── Bathroom ── */}
              {trackTab === "bathroom" && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600" style={{ fontWeight: 600 }}>Bathroom Log</p>
                    <div className="flex gap-2">
                      {(["Wet", "Soiled", "Both", "Dry"] as BathroomEntry["type"][]).map(type => (
                        <button key={type} onClick={() => addBathroom(type)}
                          className="px-2 py-1 rounded-lg text-xs bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100 transition-colors">
                          + {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {cur.bathroom.map(entry => (
                      <div key={entry.id} className="flex items-center gap-3 p-2.5 bg-teal-50 rounded-xl border border-teal-100 text-sm">
                        <Droplets size={14} className="text-teal-500" />
                        <span style={{ fontWeight: 500 }}>{entry.type}</span>
                        <span className="text-gray-400 text-xs ml-auto">{entry.time}</span>
                      </div>
                    ))}
                    {cur.bathroom.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No bathroom entries yet.</p>}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Total: {cur.bathroom.length} entries today</p>
                </div>
              )}

              {/* Photos */}
              {cur.photos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>PHOTOS TODAY ({cur.photos.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {cur.photos.map(photo => (
                      <div key={photo.id} className="w-16 h-16 rounded-lg bg-indigo-100 flex flex-col items-center justify-center text-xs text-indigo-500 border border-indigo-200">
                        <Camera size={16} />
                        <span className="text-xs mt-0.5 text-center px-1 truncate w-full text-center">{photo.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── Activity Schedule Tab ── */}
      {mainTab === "schedule" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <select value={filterGroup} onChange={(e: any) => setFilterGroup(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="All">All Groups</option>
              {GROUPS.map(g => <option key={g}>{g}</option>)}
            </select>
            <select value={filterType} onChange={(e: any) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="All">All Types</option>
              {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            {filteredActivities.map(a => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 text-center shrink-0">
                    <p className="text-xs text-indigo-600" style={{ fontWeight: 600 }}>{a.time}</p>
                    <p className="text-xs text-gray-400">{a.date}</p>
                  </div>
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${a.status === "Completed" ? "bg-green-400" : a.status === "In Progress" ? "bg-blue-400 animate-pulse" : a.status === "Cancelled" ? "bg-red-300" : "bg-gray-200"}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p style={{ fontWeight: 600 }}>{a.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[a.type]}`}>{a.type}</span>
                        </div>
                        <p className="text-sm text-gray-500">{a.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Users size={12} />{a.group}</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{a.instructor}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {a.status === "Scheduled" && <Btn variant="ghost" size="sm" onClick={() => updateStatus(a.id, "In Progress")}>Start</Btn>}
                        {a.status === "In Progress" && <Btn variant="success" size="sm" onClick={() => updateStatus(a.id, "Completed")}>Complete</Btn>}
                        <button onClick={() => { setSelectedActivity(a); setActForm({ ...a }); setModal("editActivity"); }} className="p-1.5 rounded hover:bg-gray-100 text-blue-500"><Pencil size={14} /></button>
                        <button onClick={() => removeActivity(a.id)} className="p-1.5 rounded hover:bg-gray-100 text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {filteredActivities.length === 0 && (
              <div className="text-center py-12 text-gray-400"><Calendar size={32} className="mx-auto mb-2 opacity-40" /><p>No activities scheduled</p></div>
            )}
          </div>
        </div>
      )}

      {/* ── Daily Reports Tab ── */}
      {mainTab === "report" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map(r => (
            <Card key={r.childId} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={r.childName} size="md" />
                <div className="flex-1">
                  <p style={{ fontWeight: 600 }}>{r.childName}</p>
                  <p className="text-xs text-gray-400">{r.group} · {r.date}</p>
                </div>
                <div className="flex gap-1.5">
                  {r.reportGenerated && <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Report Ready</span>}
                  {r.parentNotified && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Parent Notified</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { icon: <Utensils size={12} />, label: "Meals", value: r.food.length, color: "text-amber-600 bg-amber-50" },
                  { icon: <Moon size={12} />, label: "Sleep", value: `${r.sleep.reduce((s, sl) => s + sl.duration, 0).toFixed(1)}h`, color: "text-purple-600 bg-purple-50" },
                  { icon: <BookOpen size={12} />, label: "Activities", value: `${r.education.filter(e => e.completed).length}/${r.education.length}`, color: "text-blue-600 bg-blue-50" },
                  { icon: <Smile size={12} />, label: "Mood", value: r.mood[r.mood.length - 1]?.mood ?? "—", color: "text-yellow-600 bg-yellow-50" },
                  { icon: <Pill size={12} />, label: "Medicines", value: r.medicine.length, color: "text-red-600 bg-red-50" },
                  { icon: <Droplets size={12} />, label: "Bathroom", value: r.bathroom.length, color: "text-teal-600 bg-teal-50" },
                ].map(s => (
                  <div key={s.label} className={`rounded-lg p-2 text-center ${s.color}`}>
                    <div className="flex justify-center mb-0.5">{s.icon}</div>
                    <p className="text-xs" style={{ fontWeight: 700 }}>{s.value}</p>
                    <p className="text-xs opacity-70">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Btn size="sm" onClick={() => { setSelectedChild(r); setModal("report"); }}>
                  <FileText size={12} /> Generate Report
                </Btn>
                <Btn size="sm" variant="secondary" onClick={() => { setSelectedChild(r); setNotifyMsg(""); setModal("notify"); }}>
                  <Bell size={12} /> Notify Parent
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Modals ── */}

      {/* Add/Edit Activity */}
      {(modal === "addActivity" || modal === "editActivity") && (
        <Modal title={modal === "addActivity" ? "Add Activity" : "Edit Activity"} onClose={() => setModal(null)} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Input label="Activity Title" value={actForm.title} onChange={(v: any) => setActForm(p => ({ ...p, title: v }))} /></div>
            <Select label="Group" value={actForm.group} onChange={(v: any) => setActForm(p => ({ ...p, group: v }))} options={["All", ...GROUPS]} />
            <Select label="Type" value={actForm.type} onChange={(v: any) => setActForm(p => ({ ...p, type: v as Activity["type"] }))} options={[...ACTIVITY_TYPES]} />
            <Input label="Date" type="date" value={actForm.date} onChange={(v: any) => setActForm(p => ({ ...p, date: v }))} />
            <Input label="Time" value={actForm.time} onChange={(v: any) => setActForm(p => ({ ...p, time: v }))} placeholder="09:00 AM" />
            <div className="col-span-2"><Input label="Instructor" value={actForm.instructor} onChange={(v: any) => setActForm(p => ({ ...p, instructor: v }))} /></div>
            <Select label="Status" value={actForm.status} onChange={(v: any) => setActForm(p => ({ ...p, status: v as Activity["status"] }))} options={[...ACTIVITY_STATUSES]} />
            <div className="col-span-2"><Textarea label="Description" value={actForm.description} onChange={(v: any) => setActForm(p => ({ ...p, description: v }))} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={saveActivity}>Save Activity</Btn>
          </div>
        </Modal>
      )}

      {/* Add Food */}
      {modal === "addFood" && (
        <Modal title="Log Meal" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <Select label="Meal Type" value={foodForm.meal} onChange={(v: any) => setFoodForm(p => ({ ...p, meal: v as MealType }))} options={["Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner"]} />
            <Input label="Food Items" value={foodForm.items} onChange={(v: any) => setFoodForm(p => ({ ...p, items: v }))} placeholder="e.g. Rice, chicken, apple" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Amount Eaten" value={foodForm.amount} onChange={(v: any) => setFoodForm(p => ({ ...p, amount: v as FoodEntry["amount"] }))} options={["All", "Half", "Little", "None"]} />
              <Input label="Water (ml)" type="number" value={String(foodForm.waterMl)} onChange={(v: any) => setFoodForm(p => ({ ...p, waterMl: Number(v) }))} />
            </div>
            <Input label="Time" type="time" value={foodForm.time} onChange={(v: any) => setFoodForm(p => ({ ...p, time: v }))} />
            <Textarea label="Notes" value={foodForm.notes} onChange={(v: any) => setFoodForm(p => ({ ...p, notes: v }))} rows={2} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={addFood}><Utensils size={14} /> Save Meal</Btn>
          </div>
        </Modal>
      )}

      {/* Add Sleep */}
      {modal === "addSleep" && (
        <Modal title="Log Sleep" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Sleep Time" type="time" value={sleepForm.sleepTime} onChange={(v: any) => setSleepForm(p => ({ ...p, sleepTime: v }))} />
              <Input label="Wake Time" type="time" value={sleepForm.wakeTime} onChange={(v: any) => setSleepForm(p => ({ ...p, wakeTime: v }))} />
            </div>
            <Select label="Sleep Quality" value={sleepForm.quality} onChange={(v: any) => setSleepForm(p => ({ ...p, quality: v as SleepQuality }))} options={["Good", "Fair", "Poor", "Restless"]} />
            <Textarea label="Notes" value={sleepForm.notes} onChange={(v: any) => setSleepForm(p => ({ ...p, notes: v }))} rows={2} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={addSleep}><Moon size={14} /> Save Sleep</Btn>
          </div>
        </Modal>
      )}

      {/* Add Education */}
      {modal === "addEducation" && (
        <Modal title="Add Education Activity" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <Select label="Category" value={eduForm.category} onChange={(v: any) => setEduForm(p => ({ ...p, category: v as EducationEntry["category"] }))} options={["Alphabet", "Numbers", "Drawing", "Reading", "Story", "Craft", "Music", "Science"]} />
            <Input label="Activity Description" value={eduForm.activity} onChange={(v: any) => setEduForm(p => ({ ...p, activity: v }))} placeholder="e.g. Alphabet A–D practice" />
            <Textarea label="Notes" value={eduForm.notes} onChange={(v: any) => setEduForm(p => ({ ...p, notes: v }))} rows={2} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={addEducation}><BookOpen size={14} /> Save</Btn>
          </div>
        </Modal>
      )}

      {/* Add Mood */}
      {modal === "addMood" && (
        <Modal title="Log Mood" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {MOOD_CONFIG.map(mc => (
                <button key={mc.mood} onClick={() => setMoodForm(p => ({ ...p, mood: mc.mood }))}
                  className={`p-2 rounded-xl border text-center transition-all ${moodForm.mood === mc.mood ? "ring-2 ring-indigo-400 " : ""} ${mc.color}`}>
                  <span className="text-2xl block">{mc.emoji}</span>
                  <span className="text-xs">{mc.mood}</span>
                </button>
              ))}
            </div>
            <Textarea label="Notes" value={moodForm.notes} onChange={(v: any) => setMoodForm(p => ({ ...p, notes: v }))} rows={2} placeholder="What caused this mood?" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={addMood}><Smile size={14} /> Save Mood</Btn>
          </div>
        </Modal>
      )}

      {/* Add Medicine */}
      {modal === "addMedicine" && (
        <Modal title="Add Medicine" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Medicine Name" value={medForm.medicine} onChange={(v: any) => setMedForm(p => ({ ...p, medicine: v }))} />
              <Input label="Dosage" value={medForm.dosage} onChange={(v: any) => setMedForm(p => ({ ...p, dosage: v }))} placeholder="e.g. 5ml" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Schedule Time" type="time" value={medForm.time} onChange={(v: any) => setMedForm(p => ({ ...p, time: v }))} />
              <Input label="Given By" value={medForm.givenBy} onChange={(v: any) => setMedForm(p => ({ ...p, givenBy: v }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={medForm.parentApproved} onChange={(e: any) => setMedForm(p => ({ ...p, parentApproved: e.target.checked }))} className="rounded" />
              <span className="text-sm text-gray-600">Parent has approved this medicine</span>
            </label>
            <Textarea label="Notes" value={medForm.notes} onChange={(v: any) => setMedForm(p => ({ ...p, notes: v }))} rows={2} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={addMedicine}><Pill size={14} /> Save Medicine</Btn>
          </div>
        </Modal>
      )}

      {/* Add Photo */}
      {modal === "addPhoto" && (
        <Modal title="Upload Photo" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <Camera size={28} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload or drag a photo</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
            </div>
            <Input label="Caption" value={photoCaption} onChange={setPhotoCaption} placeholder="Describe the photo…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={addPhoto}><Camera size={14} /> Save Photo</Btn>
          </div>
        </Modal>
      )}

      {/* Notify Parent */}
      {modal === "notify" && (
        <Modal title={`Notify Parent — ${selectedChild.childName}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
              A daily activity summary will be sent to the parent's registered contact.
            </div>
            <div className="flex flex-wrap gap-2">
              {["Child had a great day!", "Your child was very active today.", "Please review the medicine schedule.", "Child ate well today.", "Sleep was shorter than usual today."].map(t => (
                <button key={t} onClick={() => setNotifyMsg(t)} className="px-3 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100">{t}</button>
              ))}
            </div>
            <Textarea label="Additional Message" value={notifyMsg} onChange={setNotifyMsg} rows={3} placeholder="Add a personal note for the parent…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={notifyParent}><Bell size={14} /> Send Notification</Btn>
          </div>
        </Modal>
      )}

      {/* Generate Report */}
      {modal === "report" && (
        <Modal title={`Daily Report — ${selectedChild.childName}`} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
              <Avatar name={selectedChild.childName} size="md" />
              <div>
                <p style={{ fontWeight: 600 }}>{selectedChild.childName}</p>
                <p className="text-xs text-gray-500">{selectedChild.group} · {selectedChild.date}</p>
              </div>
            </div>
            {[
              { label: "🍽️ Food & Nutrition", items: cur.food.map(f => `${f.meal}: ${f.items} (${f.amount})`) },
              { label: "😴 Sleep", items: cur.sleep.map(s => `${s.sleepTime}–${s.wakeTime} (${s.duration}h, ${s.quality})`) },
              { label: "📚 Education", items: cur.education.map(e => `${e.category}: ${e.activity} ${e.completed ? "✅" : "⏳"}`) },
              { label: "😊 Mood", items: cur.mood.map(m => `${m.time}: ${m.mood}${m.notes ? ` — ${m.notes}` : ""}`) },
              { label: "💊 Medicine", items: cur.medicine.map(m => `${m.medicine} ${m.dosage} at ${m.time} — ${m.given ? "Given" : "Pending"}`) },
              { label: "🚿 Bathroom", items: cur.bathroom.map(b => `${b.time}: ${b.type}`) },
            ].map(section => section.items.length > 0 && (
              <div key={section.label}>
                <p className="text-sm" style={{ fontWeight: 600 }}>{section.label}</p>
                <ul className="mt-1 space-y-0.5">
                  {section.items.map((item, i) => <li key={i} className="text-xs text-gray-600 pl-3 border-l-2 border-indigo-200">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <Btn onClick={generateReport}><FileText size={14} /> Mark as Generated</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Close</Btn>
            <Btn variant="secondary" onClick={() => { notifyParent(); setModal(null); }} className="ml-auto"><Bell size={14} /> Send to Parent</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import api from "../../../../../services/api";
import {
  Plus, Search, Eye, Pencil, Trash2, Download, Upload,
  Filter, X, ChevronDown, FileText, Archive, ArrowRightLeft,
  Power, BarChart2, Clock, Camera, Video, Activity,
  Utensils, Moon, BookOpen, Pill, Heart, Baby, AlertTriangle,
  CheckCircle, Printer, RefreshCw
} from "lucide-react";
import { Card, StatusBadge, Modal, Btn, Avatar, PageHeader } from "./ui";
import { mockChildren as initial, mockStaff } from "./mockData";
import type { Child } from "./types";
import { exportToCSV } from "../../../../../utils/exportUtils";
import { importFromCSV } from "../../../../../utils/importUtils";

// ── Extended Child type for this page ────────────────────────────────────
interface ChildExtended extends Child {
  childId: string;
  nickname: string;
  bloodGroup: string;
  religion: string;
  nationality: string;
  language: string;
  vaccinationStatus: "Up to date" | "Partial" | "Not vaccinated";
  medicalConditions: string;
  disabilities: string;
  doctorNotes: string;
  learningLevel: string;
  skills: string;
  interests: string;
  hobbies: string;
  mood: string;
  socialBehaviour: string;
  emotionalCondition: string;
  specialCareInstructions: string;
  packageType: "Full Day" | "Half Day" | "Hourly";
  packageExpiry: string;
  assignedNanny: string;
  attendance: "Present" | "Absent" | "Late";
  currentActivity: string;
  healthStatus: "Good" | "Fair" | "Needs Attention";
  specialNeeds: boolean;
  archived: boolean;
  createdDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  timeline: TimelineEntry[];
  media: MediaItem[];
}

interface TimelineEntry {
  id: string;
  type: "food" | "sleep" | "play" | "education" | "medicine" | "note";
  title: string;
  detail: string;
  time: string;
  date: string;
  staff: string;
}

interface MediaItem {
  id: string;
  type: "photo" | "video" | "medical" | "activity";
  name: string;
  date: string;
  size: string;
}

const timelineIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  food: { icon: <Utensils size={13} />, color: "bg-orange-100 text-orange-600" },
  sleep: { icon: <Moon size={13} />, color: "bg-purple-100 text-purple-600" },
  play: { icon: <Activity size={13} />, color: "bg-green-100 text-green-600" },
  education: { icon: <BookOpen size={13} />, color: "bg-blue-100 text-blue-600" },
  medicine: { icon: <Pill size={13} />, color: "bg-red-100 text-red-600" },
  note: { icon: <FileText size={13} />, color: "bg-gray-100 text-gray-600" },
};

// ── Seed data ─────────────────────────────────────────────────────────────
function enrichChild(c: Child, idx: number): ChildExtended {
  const nannies = mockStaff.filter(s => s.role === "Nanny" || s.role === "Assistant Teacher");
  const activities = ["Circle Time", "Outdoor Play", "Nap Time", "Art Class", "Story Time", "Lunch", "Music"];
  const moods = ["Happy", "Calm", "Excited", "Tired", "Fussy"];
  return {
    ...c,
    childId: `TS-${1000 + idx}`,
    nickname: c.name.split(" ")[0],
    bloodGroup: ["A+", "B+", "O+", "AB+", "A-"][idx % 5],
    religion: ["Christianity", "Islam", "Hinduism", "Buddhism"][idx % 4],
    nationality: "American",
    language: "English",
    vaccinationStatus: ["Up to date", "Partial", "Up to date", "Up to date", "Partial", "Up to date", "Not vaccinated", "Up to date"][idx % 8] as ChildExtended["vaccinationStatus"],
    medicalConditions: idx % 3 === 0 ? "Mild asthma" : "None",
    disabilities: "None",
    doctorNotes: idx % 4 === 0 ? "Monitor breathing during physical activity" : "Healthy child",
    learningLevel: ["Beginner", "Intermediate", "Advanced"][idx % 3],
    skills: "Painting, Counting, Alphabet",
    interests: "Drawing, Music, Outdoor games",
    hobbies: "Coloring, Building blocks",
    mood: moods[idx % moods.length],
    socialBehaviour: ["Very social", "Shy but friendly", "Group leader", "Quiet observer"][idx % 4],
    emotionalCondition: "Stable",
    specialCareInstructions: c.allergies !== "None" ? `Avoid ${c.allergies}. Carry antihistamine.` : "No special instructions",
    packageType: (["Full Day", "Half Day", "Full Day", "Hourly", "Full Day", "Half Day", "Full Day", "Full Day"][idx % 8]) as ChildExtended["packageType"],
    packageExpiry: `2026-12-31`,
    assignedNanny: nannies[idx % nannies.length]?.name || "Amanda White",
    attendance: (["Present", "Present", "Present", "Absent", "Present", "Late", "Present", "Present"][idx % 8]) as ChildExtended["attendance"],
    currentActivity: activities[idx % activities.length],
    healthStatus: (c.allergies !== "None" ? "Needs Attention" : idx % 5 === 0 ? "Fair" : "Good") as ChildExtended["healthStatus"],
    specialNeeds: idx % 6 === 0,
    archived: c.status === "Inactive",
    createdDate: c.enrollDate,
    emergencyContact: `${c.parentName} (Parent)`,
    emergencyPhone: `+1 555-01${90 + idx}`,
    medicalHistory: idx % 3 === 0 ? "Hospitalized once for fever (2024)" : "No significant history",
    timeline: [
      { id: `tl${idx}-1`, type: "food", title: "Lunch served", detail: "Chicken soup, fruit, juice — ate well", time: "12:15 PM", date: "2026-06-04", staff: "Jennifer Clark" },
      { id: `tl${idx}-2`, type: "sleep", title: "Nap time", detail: "Slept for 1.5 hours without interruption", time: "01:00 PM", date: "2026-06-04", staff: "Amanda White" },
      { id: `tl${idx}-3`, type: "play", title: "Outdoor play", detail: "Active in sandbox and slide area", time: "11:00 AM", date: "2026-06-04", staff: "Marcus Thompson" },
      { id: `tl${idx}-4`, type: "education", title: "Circle Time", detail: "Recited alphabet and numbers 1-20", time: "09:30 AM", date: "2026-06-04", staff: "Jennifer Clark" },
      ...(c.allergies !== "None" ? [{ id: `tl${idx}-5`, type: "medicine" as const, title: "Antihistamine administered", detail: `${c.allergies} sensitivity — 5ml given`, time: "10:45 AM", date: "2026-06-04", staff: "Rachel Green" }] : []),
    ],
    media: [
      { id: `m${idx}-1`, type: "photo", name: "Circle_Time_Jun4.jpg", date: "2026-06-04", size: "1.2 MB" },
      { id: `m${idx}-2`, type: "activity", name: "Activity_Report_May.pdf", date: "2026-05-30", size: "256 KB" },
      { id: `m${idx}-3`, type: "medical", name: "Vaccination_Card.pdf", date: "2026-03-15", size: "180 KB" },
    ],
  };
}

const INITIAL_CHILDREN: ChildExtended[] = initial.map(enrichChild);

const EMPTY_FORM: Omit<ChildExtended, "id" | "childId" | "timeline" | "media"> = {
  name: "", nickname: "", age: 2, dob: "", gender: "Female",
  bloodGroup: "A+", religion: "", nationality: "American", language: "English",
  group: "Sunflower", parentId: "", parentName: "", allergies: "None",
  status: "Active", enrollDate: "", vaccinationStatus: "Up to date",
  medicalConditions: "", disabilities: "None", doctorNotes: "",
  learningLevel: "Beginner", skills: "", interests: "", hobbies: "",
  mood: "Happy", socialBehaviour: "", emotionalCondition: "Stable",
  specialCareInstructions: "", packageType: "Full Day", packageExpiry: "",
  assignedNanny: "", attendance: "Present", currentActivity: "",
  healthStatus: "Good", specialNeeds: false, archived: false,
  createdDate: "2026-06-04", emergencyContact: "", emergencyPhone: "", medicalHistory: "",
};

type ProfileTab = "basic" | "health" | "education" | "behaviour" | "media" | "timeline";

const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: "basic", label: "Basic Info" },
  { id: "health", label: "Health" },
  { id: "education", label: "Education" },
  { id: "behaviour", label: "Behaviour" },
  { id: "media", label: "Media" },
  { id: "timeline", label: "Timeline" },
];

const healthStatusColors = {
  Good: "bg-green-100 text-green-700",
  Fair: "bg-yellow-100 text-yellow-700",
  "Needs Attention": "bg-red-100 text-red-700",
};
const attendanceColors = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Late: "bg-yellow-100 text-yellow-700",
};
const vaccinColors = {
  "Up to date": "bg-green-100 text-green-700",
  "Partial": "bg-yellow-100 text-yellow-700",
  "Not vaccinated": "bg-red-100 text-red-700",
};

// ── Component ─────────────────────────────────────────────────────────────
export function Children() {
  const [children, setChildren] = useState<ChildExtended[]>(INITIAL_CHILDREN);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/daycare/portal/children')
      .then((res: any) => {
         const d = res.data?.data || [];
         setChildren([...d.map((c: any, i: number) => c.childId ? c : enrichChild(c, i)), ...INITIAL_CHILDREN]);
      })
      .catch((err: any) => console.error("Failed to load children", err));
  }, []);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({
    group: "All", gender: "All", package: "All",
    health: "All", attendance: "All", specialNeeds: "All", archived: false,
  });

  const [modal, setModal] = useState<"add" | "edit" | "profile" | "timeline" | "report" | "transfer" | null>(null);
  const [selected, setSelected] = useState<ChildExtended | null>(null);
  const [profileTab, setProfileTab] = useState<ProfileTab>("basic");
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [newTimeline, setNewTimeline] = useState({ type: "note" as TimelineEntry["type"], title: "", detail: "", time: "" });

  // ── Filtering ─────────────────────────────────────────────────────────
  const filtered = children.filter(c => {
    if (!filters.archived && c.archived) return false;
    if (filters.archived && !c.archived) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.childId.toLowerCase().includes(search.toLowerCase()) &&
        !c.parentName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.group !== "All" && c.group !== filters.group) return false;
    if (filters.gender !== "All" && c.gender !== filters.gender) return false;
    if (filters.package !== "All" && c.packageType !== filters.package) return false;
    if (filters.health !== "All" && c.healthStatus !== filters.health) return false;
    if (filters.attendance !== "All" && c.attendance !== filters.attendance) return false;
    if (filters.specialNeeds === "Yes" && !c.specialNeeds) return false;
    if (filters.specialNeeds === "No" && c.specialNeeds) return false;
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedChildren = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── Actions ───────────────────────────────────────────────────────────
  function openAdd() { setForm(EMPTY_FORM); setModal("add"); }
  function openEdit(c: ChildExtended) { setSelected(c); setForm({ ...c }); setModal("edit"); }
  function openProfile(c: ChildExtended) { setSelected(c); setProfileTab("basic"); setModal("profile"); }

  async function save() {
    const now = `TS-${Date.now()}`;
    if (modal === "add") {
      const newChild: ChildExtended = {
        ...form, id: `c${Date.now()}`, childId: now,
        timeline: [], media: [],
      };
      setChildren(prev => [newChild, ...prev]);
      try {
        await api.post('/daycare/portal/children', newChild);
      } catch (err) {
        console.error("Failed to save child to DB", err);
      }
    } else if (modal === "edit" && selected) {
      setChildren(prev => prev.map(c => c.id === selected.id ? { ...c, ...form } : c));
    }
    setModal(null);
  }

  function archiveChild(id: string) {
    setChildren(prev => prev.map(c => c.id === id ? { ...c, archived: true, status: "Inactive" } : c));
    setModal(null);
  }

  function disableProfile(id: string) {
    setChildren(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c));
  }

  function removeChild(id: string) {
    if (confirm("Permanently remove this child record?")) setChildren(prev => prev.filter(c => c.id !== id));
  }

  function addTimelineEntry(childId: string) {
    if (!newTimeline.title) return;
    const entry: TimelineEntry = {
      id: `tl${Date.now()}`,
      ...newTimeline,
      date: "2026-06-04",
      staff: "Dr. Patricia Lee",
    };
    setChildren(prev => prev.map(c =>
      c.id === childId ? { ...c, timeline: [entry, ...c.timeline] } : c
    ));
    if (selected?.id === childId) {
      setSelected(prev => prev ? { ...prev, timeline: [entry, ...prev.timeline] } : prev);
    }
    setNewTimeline({ type: "note", title: "", detail: "", time: "" });
  }

  const ff = (k: keyof typeof form, v: string | boolean | number) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const filt = (k: keyof typeof filters, v: string | boolean) =>
    setFilters(prev => ({ ...prev, [k]: v }));

  const activeCount = children.filter(c => !c.archived && c.status === "Active").length;
  const presentCount = children.filter(c => c.attendance === "Present").length;

  return (
    <div>
      <PageHeader
        title="Child Management"
        subtitle={`${activeCount} active · ${presentCount} present today`}
      />

      {/* ── Top Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e: any) => setSearch(e.target.value)}
            placeholder="Search by name, ID or parent…"
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn onClick={openAdd}><Plus size={15} /> Add Child</Btn>
        <Btn variant="secondary" onClick={() => setShowFilter(!showFilter)}>
          <Filter size={15} /> Filters {showFilter ? <ChevronDown size={13} className="rotate-180" /> : <ChevronDown size={13} />}
        </Btn>
        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if(file) {
              try {
                const data = await importFromCSV(file);
                // Simple parsing assumption for now
                setChildren(prev => [...data.map((c, i) => enrichChild(c as any, prev.length + i)), ...prev]);
                alert('Import successful!');
              } catch(err) {
                alert('Import failed');
              }
            }
          }} 
          className="hidden" 
        />
        <Btn variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={15} /> Import
        </Btn>
        <Btn variant="secondary" onClick={() => exportToCSV(filtered, 'children_export.csv')}>
          <Download size={15} /> Export
        </Btn>
        <Btn variant={filters.archived ? "primary" : "ghost"} size="sm" onClick={() => filt("archived", !filters.archived)}>
          <Archive size={14} /> {filters.archived ? "Show Active" : "Show Archived"}
        </Btn>
      </div>

      {/* ── Filter Panel ────────────────────────────────────────────────── */}
      {showFilter && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-gray-700">Filter Children</h4>
            <button onClick={() => setFilters({ group: "All", gender: "All", package: "All", health: "All", attendance: "All", specialNeeds: "All", archived: false })}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"><RefreshCw size={12} /> Reset</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              { key: "group", label: "Group", opts: ["All", "Sunflower", "Butterfly", "Rainbow", "Star"] },
              { key: "gender", label: "Gender", opts: ["All", "Male", "Female"] },
              { key: "package", label: "Package", opts: ["All", "Full Day", "Half Day", "Hourly"] },
              { key: "health", label: "Health", opts: ["All", "Good", "Fair", "Needs Attention"] },
              { key: "attendance", label: "Attendance", opts: ["All", "Present", "Absent", "Late"] },
              { key: "specialNeeds", label: "Special Needs", opts: ["All", "Yes", "No"] },
            ] as const).map(f => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{f.label}</label>
                <select value={(filters as any)[f.key]} onChange={(e: any) => filt(f.key as any, e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Child ID", "Child", "Age", "Gender", "Attendance", "Current Activity", "Health", "Package", "Nanny", "Created", "Actions"]
                  .map(h => <th key={h} className="text-left px-4 py-3 text-gray-600 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedChildren.map(c => (
                <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.archived ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{c.childId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <p style={{ fontWeight: 500 }}>{c.name}</p>
                        <p className="text-xs text-gray-400">"{c.nickname}" · {c.parentName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.age} yrs</td>
                  <td className="px-4 py-3 text-gray-600">{c.gender}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${attendanceColors[c.attendance]}`}>{c.attendance}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.currentActivity}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${healthStatusColors[c.healthStatus]}`}>{c.healthStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs" style={{ fontWeight: 500 }}>{c.packageType}</p>
                    <p className="text-xs text-gray-400">Until {c.packageExpiry}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{c.assignedNanny}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{c.createdDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <button title="View Profile" onClick={() => openProfile(c)} className="p-1.5 rounded hover:bg-indigo-50 text-indigo-500"><Eye size={14} /></button>
                      <button title="Edit" onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                      <button title="Timeline" onClick={() => { setSelected(c); setModal("timeline"); }} className="p-1.5 rounded hover:bg-purple-50 text-purple-500"><Clock size={14} /></button>
                      <button title="Report" onClick={() => { setSelected(c); setModal("report"); }} className="p-1.5 rounded hover:bg-green-50 text-green-600"><FileText size={14} /></button>
                      <button title="Archive" onClick={() => archiveChild(c.id)} className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600"><Archive size={14} /></button>
                      <button title="Toggle Disable" onClick={() => disableProfile(c.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Power size={14} /></button>
                      <button title="Delete" onClick={() => removeChild(c.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="text-center py-12 text-gray-400">
                  <Baby size={28} className="mx-auto mb-2 opacity-30" />No children found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} children
          </div>
          {totalPages > 1 && (
            <div className="flex gap-1">
              <Btn variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Btn>
              <div className="flex items-center px-2 text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
              <Btn variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Btn>
            </div>
          )}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Add / Edit Child
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)}
        title={modal === "add" ? "Add New Child" : `Edit — ${selected?.name}`} width="max-w-3xl">
        <div className="space-y-5">
          {/* Basic */}
          <section>
            <h4 className="text-gray-700 mb-3 pb-1 border-b border-gray-100">Basic Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name"><input value={form.name} onChange={(e: any) => ff("name", e.target.value)} className={INP} /></Field>
              <Field label="Nickname"><input value={form.nickname} onChange={(e: any) => ff("nickname", e.target.value)} className={INP} /></Field>
              <Field label="Date of Birth"><input type="date" value={form.dob} onChange={(e: any) => ff("dob", e.target.value)} className={INP} /></Field>
              <Field label="Age"><input type="number" value={form.age} onChange={(e: any) => ff("age", Number(e.target.value))} className={INP} min={0} max={10} /></Field>
              <Field label="Gender">
                <select value={form.gender} onChange={(e: any) => ff("gender", e.target.value)} className={SEL}>
                  <option>Female</option><option>Male</option>
                </select>
              </Field>
              <Field label="Blood Group">
                <select value={form.bloodGroup} onChange={(e: any) => ff("bloodGroup", e.target.value)} className={SEL}>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Religion"><input value={form.religion} onChange={(e: any) => ff("religion", e.target.value)} className={INP} /></Field>
              <Field label="Nationality"><input value={form.nationality} onChange={(e: any) => ff("nationality", e.target.value)} className={INP} /></Field>
              <Field label="Language"><input value={form.language} onChange={(e: any) => ff("language", e.target.value)} className={INP} /></Field>
              <Field label="Group">
                <select value={form.group} onChange={(e: any) => ff("group", e.target.value)} className={SEL}>
                  {["Sunflower","Butterfly","Rainbow","Star"].map(g => <option key={g}>{g}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* Parent & Emergency */}
          <section>
            <h4 className="text-gray-700 mb-3 pb-1 border-b border-gray-100">Parent & Emergency</h4>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Parent Name"><input value={form.parentName} onChange={(e: any) => ff("parentName", e.target.value)} className={INP} /></Field>
              <Field label="Emergency Contact"><input value={form.emergencyContact} onChange={(e: any) => ff("emergencyContact", e.target.value)} className={INP} /></Field>
              <Field label="Emergency Phone"><input value={form.emergencyPhone} onChange={(e: any) => ff("emergencyPhone", e.target.value)} className={INP} /></Field>
              <Field label="Allergies"><input value={form.allergies} onChange={(e: any) => ff("allergies", e.target.value)} placeholder="None / Peanuts…" className={INP} /></Field>
            </div>
          </section>

          {/* Package & Staff */}
          <section>
            <h4 className="text-gray-700 mb-3 pb-1 border-b border-gray-100">Package & Staff</h4>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Package Type">
                <select value={form.packageType} onChange={(e: any) => ff("packageType", e.target.value)} className={SEL}>
                  <option>Full Day</option><option>Half Day</option><option>Hourly</option>
                </select>
              </Field>
              <Field label="Package Expiry"><input type="date" value={form.packageExpiry} onChange={(e: any) => ff("packageExpiry", e.target.value)} className={INP} /></Field>
              <Field label="Enroll Date"><input type="date" value={form.enrollDate} onChange={(e: any) => ff("enrollDate", e.target.value)} className={INP} /></Field>
              <Field label="Assigned Nanny">
                <select value={form.assignedNanny} onChange={(e: any) => ff("assignedNanny", e.target.value)} className={SEL}>
                  {mockStaff.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* Health */}
          <section>
            <h4 className="text-gray-700 mb-3 pb-1 border-b border-gray-100">Health</h4>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vaccination">
                <select value={form.vaccinationStatus} onChange={(e: any) => ff("vaccinationStatus", e.target.value)} className={SEL}>
                  <option>Up to date</option><option>Partial</option><option>Not vaccinated</option>
                </select>
              </Field>
              <Field label="Health Status">
                <select value={form.healthStatus} onChange={(e: any) => ff("healthStatus", e.target.value)} className={SEL}>
                  <option>Good</option><option>Fair</option><option>Needs Attention</option>
                </select>
              </Field>
              <div className="col-span-2"><Field label="Medical Conditions"><input value={form.medicalConditions} onChange={(e: any) => ff("medicalConditions", e.target.value)} placeholder="None" className={INP} /></Field></div>
              <div className="col-span-2"><Field label="Medical History"><textarea rows={2} value={form.medicalHistory} onChange={(e: any) => ff("medicalHistory", e.target.value)} className={`${INP} resize-none`} /></Field></div>
              <div className="col-span-2"><Field label="Special Care Instructions"><textarea rows={2} value={form.specialCareInstructions} onChange={(e: any) => ff("specialCareInstructions", e.target.value)} className={`${INP} resize-none`} /></Field></div>
              <Field label="Special Needs">
                <div className="flex items-center gap-2 h-9">
                  <input type="checkbox" checked={form.specialNeeds} onChange={(e: any) => ff("specialNeeds", e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm text-gray-600">This child has special needs</span>
                </div>
              </Field>
            </div>
          </section>
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
          <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          <Btn onClick={save}>{modal === "add" ? "Add Child" : "Save Changes"}</Btn>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Full Profile
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "profile"} onClose={() => setModal(null)}
        title="" width="max-w-3xl">
        {selected && (
          <div>
            {/* Profile header */}
            <div className="flex items-start gap-4 pb-4 mb-4 border-b border-gray-100">
              <Avatar name={selected.name} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-gray-900">{selected.name}</h2>
                  <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{selected.childId}</span>
                  {selected.specialNeeds && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">Special Needs</span>}
                </div>
                <p className="text-sm text-gray-500">"{selected.nickname}" · {selected.age} yrs · {selected.gender} · {selected.group} Group</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${attendanceColors[selected.attendance]}`}>{selected.attendance}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${healthStatusColors[selected.healthStatus]}`}>{selected.healthStatus}</span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Btn size="sm" onClick={() => { setModal(null); openEdit(selected); }}><Pencil size={13} /> Edit</Btn>
                <Btn variant="danger" size="sm" onClick={() => archiveChild(selected.id)}><Archive size={13} /> Archive</Btn>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0.5 border-b border-gray-200 mb-5 overflow-x-auto">
              {PROFILE_TABS.map(t => (
                <button key={t.id} onClick={() => setProfileTab(t.id)}
                  className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${profileTab === t.id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {profileTab === "basic" && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Full Name", selected.name], ["Nickname", selected.nickname],
                  ["Date of Birth", selected.dob], ["Age", `${selected.age} years`],
                  ["Gender", selected.gender], ["Blood Group", selected.bloodGroup],
                  ["Religion", selected.religion || "—"], ["Nationality", selected.nationality],
                  ["Language", selected.language], ["Group", selected.group],
                  ["Parent", selected.parentName], ["Emergency Contact", selected.emergencyContact],
                  ["Emergency Phone", selected.emergencyPhone], ["Package Type", selected.packageType],
                  ["Package Expiry", selected.packageExpiry], ["Assigned Nanny", selected.assignedNanny],
                  ["Enrolled", selected.enrollDate], ["Current Activity", selected.currentActivity],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p style={{ fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            {profileTab === "health" && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Vaccination Status</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${vaccinColors[selected.vaccinationStatus]}`}>{selected.vaccinationStatus}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Health Status</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${healthStatusColors[selected.healthStatus]}`}>{selected.healthStatus}</span>
                  </div>
                </div>
                {[
                  ["Allergies", selected.allergies],
                  ["Medical Conditions", selected.medicalConditions || "None"],
                  ["Disabilities", selected.disabilities],
                  ["Medical History", selected.medicalHistory],
                  ["Doctor Notes", selected.doctorNotes],
                  ["Special Care Instructions", selected.specialCareInstructions],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p style={{ fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            {profileTab === "education" && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Learning Level", selected.learningLevel],
                  ["Skills", selected.skills || "—"],
                  ["Interests", selected.interests || "—"],
                  ["Hobbies", selected.hobbies || "—"],
                  ["Current Activity", selected.currentActivity],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3 col-span-1">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p style={{ fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            {profileTab === "behaviour" && (
              <div className="space-y-3 text-sm">
                {[
                  ["Mood", selected.mood],
                  ["Social Behaviour", selected.socialBehaviour || "—"],
                  ["Emotional Condition", selected.emotionalCondition],
                  ["Special Care Instructions", selected.specialCareInstructions || "None"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p style={{ fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            {profileTab === "media" && (
              <div>
                <div className="flex gap-2 mb-4">
                  {[
                    { icon: <Camera size={14} />, label: "Upload Photo" },
                    { icon: <Video size={14} />, label: "Upload Video" },
                    { icon: <Heart size={14} />, label: "Medical Report" },
                    { icon: <FileText size={14} />, label: "Activity Report" },
                  ].map(b => (
                    <Btn key={b.label} variant="secondary" size="sm">{b.icon} {b.label}</Btn>
                  ))}
                </div>
                <div className="space-y-2">
                  {selected.media.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        m.type === "photo" ? "bg-blue-100 text-blue-600" :
                        m.type === "video" ? "bg-purple-100 text-purple-600" :
                        m.type === "medical" ? "bg-red-100 text-red-600" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {m.type === "photo" ? <Camera size={14} /> : m.type === "video" ? <Video size={14} /> : <FileText size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ fontWeight: 500 }}>{m.name}</p>
                        <p className="text-xs text-gray-400">{m.date} · {m.size}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-white text-gray-500"><Eye size={13} /></button>
                        <button className="p-1.5 rounded hover:bg-white text-gray-500"><Download size={13} /></button>
                        <button className="p-1.5 rounded hover:bg-white text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                  {selected.media.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">No media uploaded yet</div>
                  )}
                </div>
              </div>
            )}

            {profileTab === "timeline" && (
              <div>
                {/* Add entry */}
                <div className="bg-indigo-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-indigo-700 mb-2" style={{ fontWeight: 600 }}>Add Timeline Entry</p>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={newTimeline.type} onChange={(e: any) => setNewTimeline(p => ({ ...p, type: e.target.value as any }))}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {["food", "sleep", "play", "education", "medicine", "note"].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input value={newTimeline.time} onChange={(e: any) => setNewTimeline(p => ({ ...p, time: e.target.value }))}
                      placeholder="Time (e.g. 02:00 PM)"
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input value={newTimeline.title} onChange={(e: any) => setNewTimeline(p => ({ ...p, title: e.target.value }))}
                      placeholder="Title"
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input value={newTimeline.detail} onChange={(e: any) => setNewTimeline(p => ({ ...p, detail: e.target.value }))}
                      placeholder="Details"
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Btn size="sm" onClick={() => addTimelineEntry(selected.id)}><Plus size={12} /> Add</Btn>
                  </div>
                </div>
                {/* Entries */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {selected.timeline.map(t => {
                    const meta = timelineIcons[t.type];
                    return (
                      <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                        <div className={`w-7 h-7 rounded-lg ${meta.color} flex items-center justify-center shrink-0`}>{meta.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm" style={{ fontWeight: 500 }}>{t.title}</p>
                            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded capitalize">{t.type}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{t.time} · {t.date} · {t.staff}</p>
                        </div>
                      </div>
                    );
                  })}
                  {selected.timeline.length === 0 && <p className="text-center text-gray-400 text-sm py-6">No timeline entries yet</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Timeline (quick access)
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "timeline"} onClose={() => setModal(null)} title={`Timeline — ${selected?.name}`} width="max-w-lg">
        {selected && (
          <div>
            <div className="bg-indigo-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-indigo-700 mb-2" style={{ fontWeight: 600 }}>Log New Entry</p>
              <div className="grid grid-cols-2 gap-2">
                <select value={newTimeline.type} onChange={(e: any) => setNewTimeline(p => ({ ...p, type: e.target.value as any }))}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {["food", "sleep", "play", "education", "medicine", "note"].map(t => <option key={t}>{t}</option>)}
                </select>
                <input value={newTimeline.time} onChange={(e: any) => setNewTimeline(p => ({ ...p, time: e.target.value }))}
                  placeholder="Time" className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input value={newTimeline.title} onChange={(e: any) => setNewTimeline(p => ({ ...p, title: e.target.value }))}
                  placeholder="Title" className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input value={newTimeline.detail} onChange={(e: any) => setNewTimeline(p => ({ ...p, detail: e.target.value }))}
                  placeholder="Details" className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="mt-2 flex justify-end">
                <Btn size="sm" onClick={() => addTimelineEntry(selected.id)}><Plus size={12} /> Log Entry</Btn>
              </div>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {selected.timeline.map(t => {
                const meta = timelineIcons[t.type];
                return (
                  <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                    <div className={`w-7 h-7 rounded-lg ${meta.color} flex items-center justify-center shrink-0`}>{meta.icon}</div>
                    <div>
                      <p className="text-sm" style={{ fontWeight: 500 }}>{t.title}</p>
                      <p className="text-xs text-gray-500">{t.detail}</p>
                      <p className="text-xs text-gray-400">{t.time} · {t.staff}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: Generate Report
      ═════════════════════════════════════════════════════════════════════ */}
      <Modal open={modal === "report"} onClose={() => setModal(null)} title={`Report — ${selected?.name}`} width="max-w-md">
        {selected && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Avatar name={selected.name} size="lg" />
              <p className="mt-2" style={{ fontWeight: 600 }}>{selected.name}</p>
              <p className="text-xs text-gray-400">{selected.childId} · {selected.group} Group</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Attendance Today", selected.attendance],
                ["Health Status", selected.healthStatus],
                ["Current Activity", selected.currentActivity],
                ["Package", selected.packageType],
                ["Vaccination", selected.vaccinationStatus],
                ["Mood Today", selected.mood],
                ["Allergies", selected.allergies],
                ["Assigned Nanny", selected.assignedNanny],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p style={{ fontWeight: 500 }} className="text-xs">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
              <p style={{ fontWeight: 600 }} className="mb-1">Today's Timeline Summary</p>
              <p className="text-xs">{selected.timeline.length} entries logged · Last: {selected.timeline[0]?.title || "None"}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Btn variant="secondary"><Printer size={14} /> Print</Btn>
              <Btn variant="secondary"><Download size={14} /> Download PDF</Btn>
              <Btn onClick={() => setModal(null)}>Done</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Tiny helper components ────────────────────────────────────────────────
const INP = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full";
const SEL = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      {children}
    </div>
  );
}

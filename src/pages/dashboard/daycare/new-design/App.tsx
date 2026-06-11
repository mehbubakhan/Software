/* MARKER-MAKE-KIT-INVOKED */
import { useState } from "react";
import "./theme.css";
import { Bell, Search } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Children } from "./components/Children";
import { Admissions } from "./components/Admissions";
import { Parents } from "./components/Parents";
import { StaffNannies } from "./components/Staff";
import { LiveMonitoring } from "./components/LiveMonitoring";
import { Transportation } from "./components/Transportation";
import { DailyActivities } from "./components/DailyActivities";
import { HealthMedicine } from "./components/HealthMedicine";
import { Billing } from "./components/Billing";
import { Complaints } from "./components/Complaints";
import { Chat } from "./components/Chat";
import { Notifications } from "./components/Notifications";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { Profile } from "./components/Profile";
import { AICenter } from "./components/AICenter";
import { Reviews } from "./components/Reviews";
import type { Section } from "./components/types";

const SECTION_TITLES: Record<Section, string> = {
  dashboard: "Dashboard",
  children: "Children",
  admissions: "Admissions",
  parents: "Parents",
  staff: "Staff & Nannies",
  "live-monitoring": "Live Monitoring",
  transportation: "Transportation",
  "daily-activities": "Daily Activities",
  "health-medicine": "Health & Medicine",
  billing: "Billing & Payments",
  complaints: "Complaints",
  chat: "Chat",
  notifications: "Notifications",
  analytics: "Reports & Analytics",
  settings: "Settings",
  profile: "Profile",
  "ai-center": "AI & Security Center",
  reviews: "Reviews & Ratings",
};

export default function App() {
  const [section, setSection] = useState<Section>("dashboard");
  const [notifOpen, setNotifOpen] = useState(false);

  function renderSection() {
    switch (section) {
      case "dashboard": return <Dashboard onNavigate={s => setSection(s as Section)} />;
      case "children": return <Children />;
      case "admissions": return <Admissions />;
      case "parents": return <Parents />;
      case "staff": return <StaffNannies />;
      case "live-monitoring": return <LiveMonitoring />;
      case "transportation": return <Transportation />;
      case "daily-activities": return <DailyActivities />;
      case "health-medicine": return <HealthMedicine />;
      case "billing": return <Billing />;
      case "complaints": return <Complaints />;
      case "chat": return <Chat />;
      case "notifications": return <Notifications />;
      case "analytics": return <Analytics />;
      case "settings": return <Settings />;
      case "profile": return <Profile />;
      case "ai-center": return <AICenter />;
      case "reviews": return <Reviews />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar active={section} onSelect={setSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 text-sm text-gray-500">
              <span>TinySteps</span>
              <span className="mx-1">/</span>
              <span className="text-gray-900" style={{ fontWeight: 500 }}>{SECTION_TITLES[section]}</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search…"
                className="pl-8 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 w-52 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            <button
              onClick={() => setSection("notifications")}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => setSection("profile")}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-fuchsia-600 flex items-center justify-center text-white text-xs" style={{ fontWeight: 700 }}>
                PL
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs text-gray-800" style={{ fontWeight: 500 }}>Dr. Patricia Lee</p>
                <p className="text-xs text-gray-400">Director</p>
              </div>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto ${section === "chat" ? "p-0" : "p-6"}`}>
          {section === "chat" ? (
            <div className="p-6 h-full">
              {renderSection()}
            </div>
          ) : (
            renderSection()
          )}
        </main>
      </div>
    </div>
  );
}

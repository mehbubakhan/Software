import { useState } from "react";
import { Sidebar, type Page } from "./components/Sidebar";
import { DashboardHome } from "./components/DashboardHome";
import { SellerManagement } from "./components/SellerManagement";
import { ProductManagement } from "./components/ProductManagement";
import { InventoryManagement } from "./components/InventoryManagement";
import { OrdersManagement } from "./components/OrdersManagement";
import { DeliveryManagement } from "./components/DeliveryManagement";
import { PaymentCommission } from "./components/PaymentCommission";
import { ComplaintsReports } from "./components/ComplaintsReports";
import { ReviewsRatings } from "./components/ReviewsRatings";
import { NotificationCenter } from "./components/NotificationCenter";
import { Analytics } from "./components/Analytics";
import { ChatPage } from "./components/ChatPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function renderPage() {
    switch (activePage) {
      case "dashboard":    return <DashboardHome onNavigate={(p) => setActivePage(p as Page)} />;
      case "sellers":      return <SellerManagement />;
      case "products":     return <ProductManagement />;
      case "inventory":    return <InventoryManagement />;
      case "orders":       return <OrdersManagement />;
      case "delivery":     return <DeliveryManagement />;
      case "payments":     return <PaymentCommission />;
      case "complaints":   return <ComplaintsReports />;
      case "reviews":      return <ReviewsRatings />;
      case "notifications":return <NotificationCenter />;
      case "analytics":    return <Analytics />;
      case "chat":         return <ChatPage />;
      case "settings":     return <SettingsPage />;
      case "profile":      return <ProfilePage />;
      default:             return <DashboardHome onNavigate={(p) => setActivePage(p as Page)} />;
    }
  }

  const isChat = activePage === "chat";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 h-12 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>KidsMarket Admin</span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>›</span>
            <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500, textTransform: "capitalize" }}>
              {activePage.replace(/-/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "monospace" }}>
              {new Date().toLocaleDateString("en-BD", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
              <span style={{ fontSize: 11, color: "#10b981" }}>System Online</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main
          className={`flex-1 min-h-0 ${isChat ? "overflow-hidden" : "overflow-y-auto"}`}
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

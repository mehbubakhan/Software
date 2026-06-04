import {
  LayoutDashboard, Users, Package, Warehouse, ShoppingCart,
  Truck, CreditCard, AlertTriangle, Star, Bell, BarChart2,
  Settings, User, ChevronLeft, ChevronRight, Store, MessageSquare
} from "lucide-react";

export type Page =
  | "dashboard" | "sellers" | "products" | "inventory" | "orders"
  | "delivery" | "payments" | "complaints" | "reviews" | "notifications"
  | "analytics" | "chat" | "settings" | "profile";

const navItems: { id: Page; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sellers", label: "Seller Management", icon: Store, badge: 5 },
  { id: "products", label: "Products", icon: Package, badge: 12 },
  { id: "inventory", label: "Inventory", icon: Warehouse },
  { id: "orders", label: "Orders", icon: ShoppingCart, badge: 8 },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "complaints", label: "Complaints", icon: AlertTriangle, badge: 3 },
  { id: "reviews", label: "Reviews & Ratings", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 7 },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile", icon: User },
];

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full transition-all duration-200"
      style={{
        width: collapsed ? 56 : 220,
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        minWidth: collapsed ? 56 : 220,
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-12 px-3 gap-2" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center justify-center w-7 h-7 rounded" style={{ background: "var(--primary)", flexShrink: 0 }}>
          <Package size={14} color="#fff" />
        </div>
        {!collapsed && (
          <span className="text-white truncate" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.01em" }}>
            KidsMarket Admin
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto rounded p-0.5 hover:bg-white/10 transition-colors"
          style={{ color: "var(--sidebar-foreground)", flexShrink: 0 }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
        {navItems.map((item) => {
          const active = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 transition-colors relative group"
              style={{
                background: active ? "var(--sidebar-accent)" : "transparent",
                color: active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)",
                borderLeft: active ? "2px solid var(--primary)" : "2px solid transparent",
                fontSize: 13,
              }}
            >
              <Icon size={15} style={{ flexShrink: 0, color: active ? "var(--primary)" : undefined }} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full" style={{ background: "#ef4444", color: "#fff", fontSize: 10 }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--primary)", flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>SA</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p style={{ fontSize: 12, color: "var(--sidebar-accent-foreground)", fontWeight: 500 }}>Super Admin</p>
              <p style={{ fontSize: 11, color: "var(--sidebar-foreground)" }} className="truncate">admin@kidsmarket.bd</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

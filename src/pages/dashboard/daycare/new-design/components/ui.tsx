import { X } from "lucide-react";

// Shared UI primitives
export function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-600",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string }> = {
    Active: { color: "green" },
    Inactive: { color: "gray" },
    Pending: { color: "yellow" },
    Approved: { color: "green" },
    Rejected: { color: "red" },
    Waitlisted: { color: "orange" },
    Paid: { color: "green" },
    Overdue: { color: "red" },
    Open: { color: "yellow" },
    "In Progress": { color: "blue" },
    Resolved: { color: "green" },
    Closed: { color: "gray" },
    "On Leave": { color: "orange" },
    "En Route": { color: "blue" },
    Scheduled: { color: "blue" },
    Completed: { color: "green" },
    Cancelled: { color: "red" },
    High: { color: "red" },
    Medium: { color: "yellow" },
    Low: { color: "green" },
  };
  return <Badge label={status} color={map[status]?.color ?? "gray"} />;
}

export function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

interface ModalProps {
  open?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP: Record<string, string> = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

export function Modal({ open = true, onClose, title, children, width, size = "md" }: ModalProps) {
  if (!open) return null;
  const w = width ?? SIZE_MAP[size];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${w} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base" style={{ fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

export function Input({ label, onChange, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & { label?: string; onChange?: any }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <input
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, options, onChange, ...props }: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & { label?: string; options?: string[]; onChange?: any }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <select
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        {...props}
      >
        {options ? options.map(o => <option key={o}>{o}</option>) : children}
      </select>
    </div>
  );
}

export function Textarea({ label, onChange, ...props }: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & { label?: string; onChange?: any }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <textarea
        rows={3}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all resize-none"
        onChange={onChange ? (e) => (onChange as (v: string) => void)(e.target.value) : undefined}
        {...props}
      />
    </div>
  );
}

export function Btn({
  children, variant = "primary", size = "md", onClick, type = "button", className = "", disabled
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  const base = "inline-flex items-center gap-2 rounded-lg font-medium transition-all cursor-pointer disabled:opacity-50";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" };
  const variants = {
    primary: "bg-fuchsia-600 text-white hover:bg-fuchsia-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-gray-600 hover:bg-gray-100",
    success: "bg-green-500 text-white hover:bg-green-600",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["bg-fuchsia-500", "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-pink-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white shrink-0`} style={{ fontWeight: 600 }}>
      {initials}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl mt-1" style={{ fontWeight: 700 }}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search…"}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white w-64 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
    />
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-sm">{message}</p>
    </div>
  );
}

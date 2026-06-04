import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, width = 480 }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col max-h-[90vh] overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", width, maxWidth: "100%" }}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{title}</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-white/10 transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success" | "warning";
  size?: "sm" | "md";
}

export function Btn({ variant = "primary", size = "md", className = "", children, ...props }: BtnProps) {
  const base = "inline-flex items-center gap-1.5 rounded transition-colors cursor-pointer disabled:opacity-50";
  const sizes = { sm: "px-2.5 py-1", md: "px-3.5 py-1.5" };
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "var(--primary)", color: "#fff", fontSize: 13 },
    secondary: { background: "var(--secondary)", color: "var(--secondary-foreground)", fontSize: 13, border: "1px solid var(--border)" },
    danger: { background: "var(--destructive)", color: "#fff", fontSize: 13 },
    ghost: { background: "transparent", color: "var(--muted-foreground)", fontSize: 13, border: "1px solid var(--border)" },
    success: { background: "#10b981", color: "#fff", fontSize: 13 },
    warning: { background: "#f59e0b", color: "#000", fontSize: 13 },
  };
  return (
    <button className={`${base} ${sizes[size]} ${className}`} style={styles[variant]} {...props}>
      {children}
    </button>
  );
}

export function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    green: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
    red: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
    yellow: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
    blue: { bg: "rgba(14,165,233,0.15)", text: "#0ea5e9" },
    gray: { bg: "rgba(100,116,139,0.15)", text: "#94a3b8" },
    cyan: { bg: "rgba(6,182,212,0.15)", text: "#06b6d4" },
    orange: { bg: "rgba(249,115,22,0.15)", text: "#f97316" },
  };
  const c = colors[color] ?? colors.gray;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export function StatCard({ label, value, sub, color = "#0ea5e9", icon }: { label: string; value: string | number; sub?: string; color?: string; icon?: ReactNode }) {
  return (
    <div className="rounded p-3 flex flex-col gap-1" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>
      <span style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "monospace" }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{sub}</span>}
    </div>
  );
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto" style={{ borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
      <table className="w-full" style={{ borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
            {headers.map((h) => (
              <th key={h} className="text-left px-3 py-2" style={{ color: "var(--muted-foreground)", fontWeight: 600, whiteSpace: "nowrap", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TR({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      className="hover:bg-white/5 transition-colors"
      style={{ borderBottom: "1px solid var(--border)", cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TD({ children, mono, style }: { children: ReactNode; mono?: boolean; style?: React.CSSProperties }) {
  return (
    <td className="px-3 py-2.5" style={{ color: "var(--foreground)", fontFamily: mono ? "monospace" : undefined, whiteSpace: "nowrap", ...style }}>
      {children}
    </td>
  );
}

export function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>{label}</label>}
      <input
        {...props}
        className="px-3 py-2 rounded outline-none w-full"
        style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13, ...props.style }}
      />
    </div>
  );
}

export function Select({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>{label}</label>}
      <select
        {...props}
        className="px-3 py-2 rounded outline-none w-full"
        style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13, ...props.style }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

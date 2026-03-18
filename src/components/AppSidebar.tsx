import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import BrandMark from "./BrandMark";

const navItems = [
  { icon: "grid_view", label: "Markets", to: "/" },
  { icon: "candlestick_chart", label: "Live Market", to: "/market" },
  { icon: "login", label: "Sign In", to: "/login" },
  { icon: "person_add", label: "Join", to: "/create-account" },
];

type AppSidebarProps = {
  footer?: ReactNode;
};

export default function AppSidebar({ footer }: AppSidebarProps) {
  return (
    <aside className="app-panel app-panel-strong flex h-full flex-col gap-8 p-5 lg:sticky lg:top-6 lg:min-h-[calc(100vh-3rem)]">
      <BrandMark />

      <div className="app-panel app-panel-soft p-4">
        <p className="eyebrow mb-3">Daily Brief</p>
        <p className="text-lg font-semibold leading-relaxed">
          Track momentum, place fast positions, and keep every market in one
          coordinated desk.
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
            end={item.to === "/"}
            to={item.to}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4 border-t border-[var(--border-soft)] pt-6">
        <button className="action-secondary w-full">
          <span className="material-symbols-outlined">add_circle</span>
          Create Market
        </button>

        {footer ?? (
          <div className="app-panel app-panel-soft p-4">
            <p className="eyebrow mb-3">Desk Balance</p>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="metric-value text-primary">$12.45K</p>
                <p className="muted-copy text-sm">24 open positions</p>
              </div>
              <span className="chip chip-soft">+8.4% week</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

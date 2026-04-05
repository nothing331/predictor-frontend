import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import BrandMark from "./BrandMark";
import { useAccountSummary } from "@/hooks/useAccount";
import { AuthStore } from "../store/authStore";
import {
  isAdminSession,
  isSessionAuthenticated,
} from "../utils/auth";
import UserProfileBadge from "./UserProfileBadge";

const primaryNavItems = [
  { icon: "grid_view", label: "Markets", to: "/" },
  { icon: "candlestick_chart", label: "Live Market", to: "/market" },
];

type AppSidebarProps = {
  footer?: ReactNode;
};

export default function AppSidebar({ footer }: AppSidebarProps) {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const profile = AuthStore((state) => state.profile);
  const role = AuthStore((state) => state.role);
  useAccountSummary();
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const isAdmin = isAdminSession(role);
  const navItems = isAuthenticated
    ? primaryNavItems
    : [
        ...primaryNavItems,
        { icon: "login", label: "Sign In", to: "/login" },
        { icon: "person_add", label: "Join", to: "/create-account" },
      ];

  return (
    <aside className="app-panel app-panel-strong flex h-full flex-col gap-8 p-5 lg:sticky lg:top-6 lg:min-h-[calc(100vh-3rem)]">
      <BrandMark />
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

      {isAuthenticated ? <UserProfileBadge compact profile={profile} /> : null}

      <div className="mt-auto flex flex-col gap-4 border-t border-[var(--border-soft)] pt-6">
        {isAdmin ? (
          <button className="action-secondary w-full">
            <span className="material-symbols-outlined">add_circle</span>
            Create Market
          </button>
        ) : null}

        {footer ?? null}
      </div>
    </aside>
  );
}

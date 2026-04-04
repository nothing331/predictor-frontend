import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutApi } from "../api/auth";
import { AuthStore } from "../store/authStore";
import { isSessionAuthenticated } from "../utils/auth";
import UserProfileBadge from "./UserProfileBadge";

export default function HeaderAccountActions() {
  const accessToken = AuthStore((state) => state.accessToken);
  const refreshToken = AuthStore((state) => state.refreshToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const profile = AuthStore((state) => state.profile);
  const role = AuthStore((state) => state.role);
  const logout = AuthStore((state) => state.logout);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap gap-3">
        <Link className="action-ghost !border-transparent !px-3" to="/login">
          Sign in
        </Link>
        <Link className="action-secondary" to="/create-account">
          Join now
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // Clear local state even if API call fails
    }
    logout();
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="relative inline-flex items-center gap-3">
      <button
        type="button"
        className="inline-flex max-w-full cursor-pointer bg-transparent border-none p-0"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Account menu"
      >
        <UserProfileBadge profile={profile} />
      </button>

      {menuOpen ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] app-panel-subtle overflow-hidden">
            <Link
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[inherit] no-underline type-body-sm font-medium uppercase tracking-wider hover:bg-[var(--surface-soft)] transition-colors"
              to="/portfolio"
              onClick={() => setMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[1.25rem]">account_balance_wallet</span>
              Portfolio
            </Link>
            {role === "ADMIN" ? (
              <Link
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[inherit] no-underline type-body-sm font-medium uppercase tracking-wider hover:bg-[var(--surface-soft)] transition-colors"
                to="/admin"
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-[1.25rem]">admin_panel_settings</span>
                Admin
              </Link>
            ) : null}
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left type-body-sm font-medium uppercase tracking-wider hover:bg-[var(--surface-soft)] transition-colors"
              onClick={handleLogout}
            >
              <span className="material-symbols-outlined text-[1.25rem]">logout</span>
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

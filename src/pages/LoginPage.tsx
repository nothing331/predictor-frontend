import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthStore } from "../store/authStore";
import {
  isSessionAuthenticated,
  normalizeProfile,
  sanitizeRedirectPath,
} from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const saveAuth = AuthStore((state) => state.saveAuth);
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const redirectPath = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) {
    return <Navigate replace to={redirectPath} />;
  }

  return (
    <AuthScaffold
      eyebrow="Member access"
      subtitle="Use your handle to sync positions, watchlists, and portfolio history from the same trading desk language."
      title="Sign in"
    >
      <div className="mx-auto w-full max-w-md space-y-7">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveAuth(
              "demo-access-token",
              "demo-refresh-token",
              60 * 60 * 24,
              normalizeProfile({ name: username }),
            );
            navigate(redirectPath, { replace: true });
          }}
        >
          <label className="block">
            <span className="eyebrow mb-3 block">Username</span>
            <div className="app-panel-subtle field-shell">
              <span className="material-symbols-outlined">alternate_email</span>
              <input
                className="app-input"
                placeholder="Enter your handle"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </label>

          <label className="block">
            <span className="eyebrow mb-3 block">Password</span>
            <div className="app-panel-subtle field-shell">
              <span className="material-symbols-outlined">lock</span>
              <input
                className="app-input"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </label>

          <div className="type-body-sm flex items-center justify-between gap-4">
            <span className="muted-copy">Protected with session recovery</span>
            <a className="eyebrow text-secondary" href="#">
              Forgot?
            </a>
          </div>

          <button className="action-primary w-full justify-center">
            Sign in
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
          <span className="eyebrow">Or continue with</span>
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
        </div>

        <GoogleSignInButton
          label="Continue with Google"
          redirectTo={redirectPath}
        />

        <p className="type-body-sm text-center text-[color:var(--text-muted)]">
          New to the desk?{" "}
          <Link
            className="font-semibold uppercase tracking-[0.18em] text-primary"
            to="/create-account"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthScaffold>
  );
}

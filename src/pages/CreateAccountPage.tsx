import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthStore } from "../store/authStore";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const saveAuth = AuthStore((state) => state.saveAuth);
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated =
    !!accessToken && !!expiresAt && Date.now() < expiresAt;

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return (
    <AuthScaffold
      eyebrow="New account"
      subtitle="Create your account to build watchlists, track your positions, and move through the product with the same clean market-board language."
      title="Create account"
    >
      <div className="mx-auto w-full max-w-md space-y-7">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveAuth("demo-access-token", "demo-refresh-token", 60 * 60 * 24);
            navigate("/", { replace: true });
          }}
        >
          <label className="block">
            <span className="eyebrow mb-3 block">Username</span>
            <div className="app-panel-subtle field-shell">
              <span className="material-symbols-outlined">person</span>
              <input
                className="app-input"
                placeholder="Choose a handle"
                type="text"
              />
            </div>
          </label>

          <label className="block">
            <span className="eyebrow mb-3 block">Email address</span>
            <div className="app-panel-subtle field-shell">
              <span className="material-symbols-outlined">mail</span>
              <input
                className="app-input"
                placeholder="name@example.com"
                type="email"
              />
            </div>
          </label>

          <label className="block">
            <span className="eyebrow mb-3 block">Password</span>
            <div className="app-panel-subtle field-shell">
              <span className="material-symbols-outlined">key</span>
              <input
                className="app-input"
                placeholder="Create a secure password"
                type="password"
              />
            </div>
          </label>

          <button className="action-secondary w-full justify-center">
            Create account
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
          <span className="eyebrow">Or continue with</span>
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
        </div>

        <GoogleSignInButton label="Sign up with Google" />

        <p className="type-body-sm text-center text-[color:var(--text-muted)]">
          Already trading?{" "}
          <Link
            className="font-semibold uppercase tracking-[0.18em] text-primary"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthScaffold>
  );
}

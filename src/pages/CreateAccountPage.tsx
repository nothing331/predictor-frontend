import { Link } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";

export default function CreateAccountPage() {
  return (
    <AuthScaffold
      eyebrow="New account"
      subtitle="Create your account to build watchlists, track your positions, and move through the product with the same clean market-board language."
      title="Create account"
    >
      <div className="mx-auto w-full max-w-md space-y-7">
        <form
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
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

        <button className="auth-google w-full" type="button">
          <span className="auth-google-mark">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </span>
          <span className="type-body-sm font-mono font-semibold uppercase tracking-[0.12em]">
            Sign up with Google
          </span>
        </button>

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

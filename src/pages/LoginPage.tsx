import { Link } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";

const highlights = [
  {
    icon: "bolt",
    title: "Fast entries",
    copy: "Jump back into active markets with one consistent desk, unified card styling, and cleaner contrast in dark mode.",
  },
  {
    icon: "hub",
    title: "Signal context",
    copy: "See who is moving, where conviction is clustering, and which contracts are accelerating before you place a trade.",
  },
  {
    icon: "verified",
    title: "Clear settlements",
    copy: "Rules, activity, and position details now read like one product instead of separate mockups stitched together.",
  },
];

const stats = [
  { label: "Open interest", value: "$94M" },
  { label: "Active traders", value: "18K" },
  { label: "Avg. settle", value: "3 min" },
];

export default function LoginPage() {
  return (
    <AuthScaffold
      eyebrow="Member access"
      highlights={highlights}
      stats={stats}
      subtitle="Sign in to pick up where you left off, monitor conviction shifts, and place trades from the same polished interface on every screen."
      title="Return to the prediction desk."
    >
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <p className="eyebrow">Welcome back</p>
          <h2 className="section-title">Sign in</h2>
          <p className="muted-copy">
            Use your handle to sync positions, watchlists, and portfolio
            history.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="block">
            <span className="eyebrow mb-3 block">Username</span>
            <div className="app-panel field-shell">
              <span className="material-symbols-outlined">alternate_email</span>
              <input
                className="app-input"
                placeholder="Enter your handle"
                type="text"
              />
            </div>
          </label>

          <label className="block">
            <span className="eyebrow mb-3 block">Password</span>
            <div className="app-panel field-shell">
              <span className="material-symbols-outlined">lock</span>
              <input
                className="app-input"
                placeholder="••••••••"
                type="password"
              />
            </div>
          </label>

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="muted-copy">Protected with session recovery</span>
            <a className="eyebrow text-secondary" href="#">
              Forgot?
            </a>
          </div>

          <button className="action-primary w-full justify-center text-base">
            Sign in
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border-soft)]" />
            <span className="eyebrow">Or continue with</span>
            <div className="h-px flex-1 bg-[var(--border-soft)]" />
          </div>

          <button
            className="action-ghost w-full justify-center bg-white !text-black"
            type="button"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-[color:var(--text-muted)]">
          New to the desk?{" "}
          <Link className="font-semibold uppercase tracking-[0.18em] text-primary" to="/create-account">
            Create account
          </Link>
        </p>
      </div>
    </AuthScaffold>
  );
}

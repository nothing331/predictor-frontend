import { Link } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";

const highlights = [
  {
    icon: "sensors",
    title: "Live market pulse",
    copy: "Watch momentum change in real time with the same visual language across discovery, market detail, and account screens.",
  },
  {
    icon: "shield",
    title: "Structured risk",
    copy: "Position cards, activity logs, and trade tickets now share one coherent system built for legibility in both light and dark themes.",
  },
  {
    icon: "groups",
    title: "Social conviction",
    copy: "Follow traders, compare sentiment, and keep your next move grounded in market behavior instead of raw headlines.",
  },
];

const stats = [
  { label: "Markets live", value: "218" },
  { label: "Creators", value: "1.4K" },
  { label: "Daily volume", value: "$9.8M" },
];

export default function CreateAccountPage() {
  return (
    <AuthScaffold
      eyebrow="New account"
      highlights={highlights}
      stats={stats}
      subtitle="Create your PredictKaro account to build watchlists, mirror high-conviction traders, and move from discovery to execution without leaving the same product language."
      title="Join the forecast exchange."
    >
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <p className="eyebrow">Create your account</p>
          <h2 className="section-title">Get started</h2>
          <p className="muted-copy">
            Set up your identity once and carry the same desk across every page.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="block">
            <span className="eyebrow mb-3 block">Username</span>
            <div className="app-panel field-shell">
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
            <div className="app-panel field-shell">
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
            <div className="app-panel field-shell">
              <span className="material-symbols-outlined">key</span>
              <input
                className="app-input"
                placeholder="Create a secure password"
                type="password"
              />
            </div>
          </label>

          <button className="action-secondary w-full justify-center text-base">
            Create account
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
            <img
              alt="Google Logo"
              className="h-5 w-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3fxYVt9uj3aYIlUhgKga5GJOUB_2gPRYApNA9Et4xwbJD1cKomNGNxi8ny7lob9qoEv1CEG-1n9J7GkVo147zOZhwR5d5DdjSJcR-MZ2-6PxveZzk_OnBXleDKipBNp3t7KexVdq9A84qvlV7fZCByuwaEJbnsOMHoLSn83FATcLAQbft1QRH3nB17f6uqOdMVz1NUEh7FVImp0DkgXCCDuO7YGHhhA9-LRazTUhEob29Q-yTjNFW7prE8isCAse1VSzz6k-Gg9sB"
            />
            Sign up with Google
          </button>
        </form>

        <p className="text-center text-sm text-[color:var(--text-muted)]">
          Already trading?{" "}
          <Link className="font-semibold uppercase tracking-[0.18em] text-primary" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </AuthScaffold>
  );
}

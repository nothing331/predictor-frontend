import { Link, Navigate } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthStore } from "../store/authStore";
import { isSessionAuthenticated } from "../utils/auth";

export default function CreateAccountPage() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return (
    <AuthScaffold
      eyebrow="New account"
      subtitle="Create your account and earn the starting currency of 1000, and enjoy predicting the future"
      title="Create account"
    >
      <div className="mx-auto w-full max-w-md space-y-7">
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

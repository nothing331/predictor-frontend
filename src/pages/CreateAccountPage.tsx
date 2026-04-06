import { Navigate } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthStore } from "../store/authStore";
import { isSessionAuthenticated } from "../utils/auth";

export default function CreateAccountPage() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const hasHydrated = AuthStore((state) => state.hasHydrated);
  const isRefreshing = AuthStore((state) => state.isRefreshing);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  if (!hasHydrated || isRefreshing) {
    return (
      <AuthScaffold
        eyebrow="Get started"
        subtitle="Checking your saved session."
        title="Restoring session"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="app-panel-subtle animate-pulse h-14 w-full rounded-full" />
        </div>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      eyebrow="Get started"
      subtitle="Create your account with Google to start making predictions."
      title="Create account"
    >
      <div className="mx-auto w-full max-w-md space-y-6">
        <GoogleSignInButton label="Sign up with Google" />

        <p className="type-body-sm text-center text-[color:var(--text-muted)]">
          By creating an account you agree to our terms of service.
        </p>
      </div>
    </AuthScaffold>
  );
}

import { Navigate, useSearchParams } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthStore } from "../store/authStore";
import {
  isSessionAuthenticated,
  sanitizeRedirectPath,
} from "../utils/auth";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const hasHydrated = AuthStore((state) => state.hasHydrated);
  const isRefreshing = AuthStore((state) => state.isRefreshing);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);
  const redirectPath = sanitizeRedirectPath(searchParams.get("redirectTo"));

  if (isAuthenticated) {
    return <Navigate replace to={redirectPath} />;
  }

  if (!hasHydrated || isRefreshing) {
    return (
      <AuthScaffold
        eyebrow="Welcome"
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
      eyebrow="Welcome"
      subtitle="Sign in with Google to start trading predictions."
      title="Sign in"
    >
      <div className="mx-auto w-full max-w-md space-y-6">
        <GoogleSignInButton
          label="Continue with Google"
          redirectTo={redirectPath}
        />

        <p className="type-body-sm text-center text-[color:var(--text-muted)]">
          By signing in you agree to our terms of service.
        </p>
      </div>
    </AuthScaffold>
  );
}

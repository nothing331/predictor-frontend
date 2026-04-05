import { Navigate } from "react-router-dom";
import AuthScaffold from "../components/AuthScaffold";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { AuthStore } from "../store/authStore";
import { isSessionAuthenticated } from "../utils/auth";
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

import { Link } from "react-router-dom";
import { AuthStore } from "../store/authStore";
import { isSessionAuthenticated } from "../utils/auth";
import UserProfileBadge from "./UserProfileBadge";

export default function HeaderAccountActions() {
  const accessToken = AuthStore((state) => state.accessToken);
  const expiresAt = AuthStore((state) => state.expiresAt);
  const profile = AuthStore((state) => state.profile);
  const isAuthenticated = isSessionAuthenticated(accessToken, expiresAt);

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

  return (
    <Link
      aria-label="Open home screen"
      className="inline-flex max-w-full"
      to="/"
    >
      <UserProfileBadge profile={profile} />
    </Link>
  );
}

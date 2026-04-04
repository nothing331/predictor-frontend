import type { AuthProfile } from "../store/authStore";
import { getProfileInitials, getProfileName } from "../utils/auth";

type UserProfileBadgeProps = {
  profile: AuthProfile | null;
  compact?: boolean;
};

export default function UserProfileBadge({
  profile,
  compact = false,
}: UserProfileBadgeProps) {
  const name = getProfileName(profile);
  const initials = getProfileInitials(profile);

  return (
    <div className={`profile-chip ${compact ? "profile-chip-compact" : ""}`}>
      <span className="profile-avatar" aria-hidden="true">
        {initials}
      </span>

      {!compact ? (
        <span className="profile-meta">
          <strong>{name}</strong>
        </span>
      ) : null}
    </div>
  );
}

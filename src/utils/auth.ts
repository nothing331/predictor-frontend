import type { AuthProfile, AuthRole } from "../store/authStore";

const fallbackProfileName = "Desk User";

type NormalizableProfile = Partial<AuthProfile> & {
  balance?: number | null;
  email?: string | null;
  name?: string | null;
  pictureUrl?: string | null;
  userId?: string | null;
};

export function isSessionAuthenticated(
  accessToken: string | null,
  expiresAt: number | null,
) {
  return !!accessToken && !!expiresAt && Date.now() < expiresAt;
}

export function hasApiBackedSession(accessToken: string | null) {
  return !!accessToken && accessToken.split(".").length === 3;
}

export function getSessionRole(role?: string | null): AuthRole {
  const normalizedRole = role?.trim().toUpperCase();

  if (normalizedRole === "ADMIN" || normalizedRole === "USER") {
    return normalizedRole;
  }

  return null;
}

export function isAdminSession(role?: string | null) {
  return getSessionRole(role) === "ADMIN";
}

export function normalizeProfile(profile?: NormalizableProfile | null) {
  const userId = profile?.userId?.trim();
  const name = profile?.name?.trim();
  const email = profile?.email?.trim();
  const pictureUrl = profile?.pictureUrl?.trim();
  const balance =
    typeof profile?.balance === "number" && Number.isFinite(profile.balance)
      ? profile.balance
      : null;

  if (!userId && !name && !email && !pictureUrl && balance === null) {
    return null;
  }

  return {
    userId: userId || null,
    name: name || deriveNameFromEmail(email) || fallbackProfileName,
    email: email || null,
    pictureUrl: pictureUrl || null,
    balance,
  } satisfies AuthProfile;
}

export function getProfileName(profile?: AuthProfile | null) {
  return normalizeProfile(profile)?.name ?? fallbackProfileName;
}

export function getProfileInitials(profile?: AuthProfile | null) {
  const parts = getProfileName(profile)
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function decodeJwtPayload<T>(token: string) {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    return JSON.parse(window.atob(normalizedPayload)) as T;
  } catch {
    return null;
  }
}

export function sanitizeRedirectPath(redirectTo?: string | null) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/";
  }

  return redirectTo;
}

function deriveNameFromEmail(email?: string | null) {
  const localPart = email?.split("@")[0]?.trim();

  if (!localPart) {
    return null;
  }

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

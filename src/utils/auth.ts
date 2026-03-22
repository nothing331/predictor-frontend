import type { AuthProfile } from "../store/authStore";

const fallbackProfileName = "Desk User";

export function isSessionAuthenticated(
  accessToken: string | null,
  expiresAt: number | null,
) {
  return !!accessToken && !!expiresAt && Date.now() < expiresAt;
}

export function normalizeProfile(profile?: Partial<AuthProfile> | null) {
  const name = profile?.name?.trim();
  const email = profile?.email?.trim();

  if (!name && !email) {
    return null;
  }

  return {
    name: name || deriveNameFromEmail(email) || fallbackProfileName,
    email: email || null,
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

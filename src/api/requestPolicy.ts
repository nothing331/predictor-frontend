export type ApiRequestErrorMode = "toast" | "inline" | "silent";
export type ApiRequestAuthMode = "none" | "optional" | "required";

export type ApiRequestMeta = {
  authMode?: ApiRequestAuthMode;
  errorMode?: ApiRequestErrorMode;
  retryOn401?: boolean;
};

export type ResolvedApiRequestMeta = {
  authMode: ApiRequestAuthMode;
  errorMode: ApiRequestErrorMode;
  retryOn401: boolean;
};

export type AttachedAppErrorMeta = {
  errorMode: ApiRequestErrorMode;
  isAuthFailure: boolean;
  shouldToast: boolean;
};

const DEFAULT_REQUEST_META: ResolvedApiRequestMeta = {
  authMode: "optional",
  errorMode: "toast",
  retryOn401: false,
};

export function resolveApiRequestMeta(
  meta?: ApiRequestMeta,
): ResolvedApiRequestMeta {
  const authMode = meta?.authMode ?? DEFAULT_REQUEST_META.authMode;

  return {
    authMode,
    errorMode: meta?.errorMode ?? DEFAULT_REQUEST_META.errorMode,
    retryOn401:
      meta?.retryOn401 ??
      (authMode === "required" ? true : DEFAULT_REQUEST_META.retryOn401),
  };
}

export function shouldAttachAccessToken(meta?: ApiRequestMeta) {
  return resolveApiRequestMeta(meta).authMode !== "none";
}

export function shouldRetryOnUnauthorized(meta?: ApiRequestMeta) {
  const resolved = resolveApiRequestMeta(meta);
  return resolved.authMode === "required" && resolved.retryOn401;
}

export function buildAttachedAppErrorMeta(
  meta?: ApiRequestMeta,
  status?: number,
  forceAuthFailure = false,
): AttachedAppErrorMeta {
  const resolved = resolveApiRequestMeta(meta);
  const isAuthFailure =
    forceAuthFailure || (resolved.authMode === "required" && status === 401);

  return {
    errorMode: resolved.errorMode,
    isAuthFailure,
    shouldToast: resolved.errorMode === "toast" && !isAuthFailure,
  };
}

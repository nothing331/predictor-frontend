import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../api/auth";
import { ErrorStore } from "../store/errorStore";
import { AuthStore } from "../store/authStore";
import {
  decodeJwtPayload,
  normalizeProfile,
  sanitizeRedirectPath,
} from "../utils/auth";
import { normalizeAppError } from "../utils/error";

type Props = {
  label?: string;
  redirectTo?: string;
};

type GoogleCredentialPayload = {
  email?: string;
  name?: string;
};

export default function GoogleSignInButton({ label, redirectTo }: Props) {
  const saveAuth = AuthStore((state) => state.saveAuth);
  const navigate = useNavigate();
  const destination = sanitizeRedirectPath(redirectTo);

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            ErrorStore.getState().pushToast({
              title: "Google sign-in failed",
              message: "Google did not return a usable credential.",
              tone: "error",
            });
            return;
          }

          try {
            const tokens = await loginWithGoogle(credentialResponse.credential);
            const googleProfile = decodeJwtPayload<GoogleCredentialPayload>(
              credentialResponse.credential,
            );
            saveAuth(
              tokens.accessToken,
              tokens.refreshToken,
              tokens.expiresInSeconds,
              normalizeProfile({
                email: googleProfile?.email,
                name: googleProfile?.name,
              }),
            );
            navigate(destination, { replace: true });
          } catch (error) {
            const normalized = normalizeAppError(
              error,
              "Authentication failed",
              "We could not sign you in with Google.",
            );

            if (!normalized.shouldToast) {
              return;
            }

            ErrorStore.getState().pushToast({
              title: normalized.title,
              message: normalized.message,
              tone: "error",
            });
          }
        }}
        onError={() => {
          ErrorStore.getState().pushToast({
            title: "Google sign-in failed",
            message: "Please try again or use another sign-in method.",
            tone: "error",
          });
        }}
        text={label?.toLowerCase().includes("sign up") ? "signup_with" : "continue_with"}
        theme="outline"
        shape="pill"
        size="large"
        width="100%"
      />
    </div>
  );
}

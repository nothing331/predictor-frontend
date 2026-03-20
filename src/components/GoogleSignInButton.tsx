import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../api/auth";
import { ErrorStore } from "../store/errorStore";
import { AuthStore } from "../store/authStore";
import { normalizeAppError } from "../utils/error";

type Props = { label?: string };

export default function GoogleSignInButton({ label }: Props) {
  const saveAuth = AuthStore((state) => state.saveAuth);
  const navigate = useNavigate();

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
            saveAuth(
              tokens.access_token,
              tokens.refresh_token,
              tokens.expires_in,
            );
            navigate("/", { replace: true });
          } catch (error) {
            if (axios.isAxiosError(error)) {
              return;
            }

            const normalized = normalizeAppError(
              error,
              "Authentication failed",
              "We could not sign you in with Google.",
            );

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

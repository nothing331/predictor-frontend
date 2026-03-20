import { apiClient } from "./client";

export async function loginWithGoogle(idToken: string) {
  const { data } = await apiClient.post("/v1/auth/google", {
    id_token: idToken,
  });
  return data;
}

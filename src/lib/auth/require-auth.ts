import { getCurrentUser } from "@/lib/auth/current-user";

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Neautentificat.");
  }

  return user;
}

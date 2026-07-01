import { requireAuth } from "@/lib/auth/require-auth";

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    throw new Error("Acces interzis. Admin necesar.");
  }

  return user;
}

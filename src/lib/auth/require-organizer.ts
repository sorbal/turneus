import { requireAuth } from "@/lib/auth/require-auth";

export async function requireOrganizer() {
  const user = await requireAuth();

  if (user.role !== "ORGANIZER" && user.role !== "ADMIN") {
    throw new Error("Acces interzis. Organizator necesar.");
  }

  return user;
}

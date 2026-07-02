import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const userName = `${user.firstName} ${user.lastName}`;

  return (
    <AdminShell userName={userName} userEmail={user.email}>
      {children}
    </AdminShell>
  );
}

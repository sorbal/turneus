import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ padding: 20, borderBottom: "1px solid #ddd" }}>
        <strong>Turneus Admin</strong>
        <span style={{ float: "right" }}>
          {user.firstName} {user.lastName}
        </span>
      </header>

      <div style={{ display: "flex" }}>
        <aside style={{ width: 240, padding: 20, borderRight: "1px solid #ddd" }}>
          <nav style={{ display: "grid", gap: 12 }}>
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/jocuri">Jocuri</Link>
            <Link href="/admin/orase">Orașe</Link>
            <Link href="/admin/organizatori">Organizatori</Link>
            <Link href="/admin/turnee">Turnee</Link>
            <Link href="/admin/utilizatori">Utilizatori</Link>
            <Link href="/admin/reclame">Reclame</Link>
            <Link href="/admin/badge-uri">Badge-uri</Link>
          </nav>
        </aside>

        <section style={{ flex: 1, padding: 30 }}>
          {children}
        </section>
      </div>
    </div>
  );
}

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

type AdminShellProps = {
  children: React.ReactNode
  userName: string
  userEmail: string
}

export function AdminShell({ children, userName, userEmail }: AdminShellProps) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="min-h-screen lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader userName={userName} userEmail={userEmail} />
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

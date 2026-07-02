import { AdminHeaderActions } from "@/components/admin/admin-header-actions"
import { AdminHeaderStatus } from "@/components/admin/admin-header-status"
import { AdminHeaderUser } from "@/components/admin/admin-header-user"

type AdminHeaderProps = {
  userName: string
  userEmail: string
}

export function AdminHeader({ userName, userEmail }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            Panou administrare
          </p>
          <h2 className="truncate text-lg font-semibold tracking-normal text-foreground">
            Turneus Admin
          </h2>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3">
          <AdminHeaderStatus />
          <AdminHeaderActions />
          <AdminHeaderUser userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </header>
  )
}

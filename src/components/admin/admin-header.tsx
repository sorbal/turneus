type AdminHeaderProps = {
  userName: string
  userEmail: string
}

export function AdminHeader({ userName, userEmail }: AdminHeaderProps) {
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Panou administrare
          </p>
          <p className="truncate text-lg font-semibold tracking-normal text-foreground">
            Turneus Admin
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-sm font-medium text-foreground">
              {userName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-sm font-semibold text-secondary-foreground">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}

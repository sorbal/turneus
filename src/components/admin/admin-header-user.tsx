type AdminHeaderUserProps = {
  userName: string
  userEmail: string
}

export function AdminHeaderUser({
  userName,
  userEmail,
}: AdminHeaderUserProps) {
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border/70 bg-card/60 px-2.5 py-2">
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
  )
}

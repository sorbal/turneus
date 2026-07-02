import type { LucideIcon } from "lucide-react"

type AdminDashboardModuleItemProps = {
  title: string
  description: string
  icon: LucideIcon
}

export function AdminDashboardModuleItem({
  title,
  description,
  icon: Icon,
}: AdminDashboardModuleItemProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-background/60 p-4 transition-colors hover:bg-background/80">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

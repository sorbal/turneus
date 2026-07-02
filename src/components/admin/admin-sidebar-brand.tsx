import { BarChart3 } from "lucide-react"

export function AdminSidebarBrand() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/60 p-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <BarChart3 className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold tracking-normal text-foreground">
          Turneus
        </p>
        <p className="truncate text-xs text-muted-foreground">
          Admin Control
        </p>
      </div>
    </div>
  )
}

import { CheckCircle2 } from "lucide-react"

export function AdminSidebarFooter() {
  return (
    <div className="rounded-lg border border-border/70 bg-background/60 p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">Sprint 2</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        Dashboard modern si fundatie admin pentru v0.3.0.
      </p>
    </div>
  )
}

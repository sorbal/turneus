import { CheckCircle2 } from "lucide-react"

export function AdminHeaderStatus() {
  return (
    <div className="hidden items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-sm xl:flex">
      <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
      <span className="font-medium text-foreground">Sprint 2</span>
      <span className="text-muted-foreground">v0.3.0 in dezvoltare</span>
    </div>
  )
}

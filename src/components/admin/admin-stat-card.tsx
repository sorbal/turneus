import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AdminStatCardProps = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  tone?: "default" | "success" | "warning" | "info"
  meta?: string
}

const toneClasses: Record<NonNullable<AdminStatCardProps["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-400",
  warning: "bg-amber-500/10 text-amber-400",
  info: "bg-sky-500/10 text-sky-400",
}

export function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "default",
  meta,
}: AdminStatCardProps) {
  return (
    <Card className="h-full overflow-hidden border-white/10 bg-card/80 transition-colors hover:bg-card">
      <CardContent className="flex min-h-36 flex-col justify-between gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-normal text-foreground">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              toneClasses[tone]
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          {meta ? (
            <p className="w-fit rounded-md border border-border bg-background/60 px-2 py-1 text-xs font-medium text-muted-foreground">
              {meta}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

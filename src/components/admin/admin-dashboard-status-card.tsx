import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatusItem = {
  title: string
  description: string
  icon: LucideIcon
  tone?: "success" | "info"
}

type AdminDashboardStatusCardProps = {
  items: StatusItem[]
}

const toneClasses: Record<NonNullable<StatusItem["tone"]>, string> = {
  success: "text-emerald-400",
  info: "text-sky-400",
}

export function AdminDashboardStatusCard({
  items,
}: AdminDashboardStatusCardProps) {
  return (
    <Card className="border-white/10 bg-card/80">
      <CardHeader>
        <CardTitle>Status platforma</CardTitle>
        <CardDescription>
          Snapshot operational pentru sprintul curent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 rounded-lg bg-background/60 p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
            <item.icon
              className={cn("size-5 shrink-0", toneClasses[item.tone ?? "info"])}
              aria-hidden="true"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

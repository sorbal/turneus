import { CheckCircle2, CircleDot } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ActivityItem = {
  title: string
  description: string
  status: "done" | "active"
}

type AdminDashboardActivityCardProps = {
  items: ActivityItem[]
}

export function AdminDashboardActivityCard({
  items,
}: AdminDashboardActivityCardProps) {
  return (
    <Card className="border-white/10 bg-card/80">
      <CardHeader>
        <CardTitle>Epic 2 progres</CardTitle>
        <CardDescription>
          Snapshot al finisarii UI pentru panoul de administrare.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const Icon = item.status === "done" ? CheckCircle2 : CircleDot

          return (
            <div
              key={item.title}
              className="flex gap-3 rounded-lg bg-background/60 p-4"
            >
              <Icon
                className={
                  item.status === "done"
                    ? "mt-0.5 size-4 shrink-0 text-emerald-400"
                    : "mt-0.5 size-4 shrink-0 text-sky-400"
                }
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

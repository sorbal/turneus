import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminDashboardInsightCardProps = {
  title: string
  description: string
  items: string[]
}

export function AdminDashboardInsightCard({
  title,
  description,
  items,
}: AdminDashboardInsightCardProps) {
  return (
    <Card className="border-white/10 bg-card/80">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg border border-border bg-background/60 p-3"
          >
            <CheckCircle2
              className="size-4 shrink-0 text-emerald-400"
              aria-hidden="true"
            />
            <p className="min-w-0 flex-1 text-sm leading-6 text-muted-foreground">
              {item}
            </p>
            {index === items.length - 1 ? (
              <ArrowRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

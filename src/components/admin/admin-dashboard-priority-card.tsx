import type { LucideIcon } from "lucide-react"

import { AdminDashboardModuleItem } from "@/components/admin/admin-dashboard-module-item"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PriorityModule = {
  title: string
  description: string
  icon: LucideIcon
}

type AdminDashboardPriorityCardProps = {
  modules: PriorityModule[]
}

export function AdminDashboardPriorityCard({
  modules,
}: AdminDashboardPriorityCardProps) {
  return (
    <Card className="h-full border-white/10 bg-card/80">
      <CardHeader>
        <CardTitle>Prioritati v0.3.0</CardTitle>
        <CardDescription>
          Ordinea de lucru ramane incrementala, cu fiecare modul dus pana la
          build.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {modules.map((module) => (
          <AdminDashboardModuleItem
            key={module.title}
            title={module.title}
            description={module.description}
            icon={module.icon}
          />
        ))}
      </CardContent>
    </Card>
  )
}

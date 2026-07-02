import type { LucideIcon } from "lucide-react"

import { AdminStatCard } from "@/components/admin/admin-stat-card"

type DashboardStat = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  tone?: "default" | "success" | "warning" | "info"
  meta?: string
}

type AdminDashboardCardGridProps = {
  stats: DashboardStat[]
}

export function AdminDashboardCardGrid({
  stats,
}: AdminDashboardCardGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => (
        <AdminStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          tone={stat.tone}
          meta={stat.meta}
        />
      ))}
    </section>
  )
}

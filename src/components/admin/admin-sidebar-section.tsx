import type { LucideIcon } from "lucide-react"

import { AdminNavLink } from "@/components/admin/admin-nav-link"

type AdminSidebarItem = {
  href: string
  label: string
  icon: LucideIcon
  badge?: string
}

type AdminSidebarSectionProps = {
  title: string
  items: AdminSidebarItem[]
}

export function AdminSidebarSection({
  title,
  items,
}: AdminSidebarSectionProps) {
  return (
    <section className="space-y-2">
      <p className="px-3 text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {title}
      </p>
      <div className="grid gap-1">
        {items.map((item) => (
          <AdminNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
          />
        ))}
      </div>
    </section>
  )
}

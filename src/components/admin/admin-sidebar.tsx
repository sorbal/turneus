"use client"

import {
  BadgeCheck,
  BarChart3,
  Gamepad2,
  LayoutDashboard,
  MapPin,
  Megaphone,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react"

import { AdminNavLink } from "@/components/admin/admin-nav-link"

const adminNavigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/jocuri",
    label: "Jocuri",
    icon: Gamepad2,
  },
  {
    href: "/admin/orase",
    label: "Orase",
    icon: MapPin,
  },
  {
    href: "/admin/organizatori",
    label: "Organizatori",
    icon: ShieldCheck,
  },
  {
    href: "/admin/turnee",
    label: "Turnee",
    icon: Trophy,
  },
  {
    href: "/admin/utilizatori",
    label: "Utilizatori",
    icon: Users,
  },
  {
    href: "/admin/reclame",
    label: "Reclame",
    icon: Megaphone,
  },
  {
    href: "/admin/badge-uri",
    label: "Badge-uri",
    icon: BadgeCheck,
  },
]

const adminGroups = [
  {
    title: "Platforma",
    items: adminNavigation.slice(0, 2),
  },
  {
    title: "Operatiuni",
    items: adminNavigation.slice(2, 6),
  },
  {
    title: "Crestere",
    items: adminNavigation.slice(6),
  },
]

export function AdminSidebar() {
  return (
    <aside className="border-b border-border bg-card/60 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-6 p-4 lg:p-5">
        <div className="flex items-center gap-3 px-1">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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

        <nav className="flex flex-1 flex-col gap-5">
          {adminGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="px-3 text-xs font-medium uppercase tracking-normal text-muted-foreground">
                {group.title}
              </p>
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <AdminNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="rounded-lg border border-border bg-background/60 p-3">
          <p className="text-sm font-medium text-foreground">Sprint 2</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Dashboard modern si fundatie admin pentru v0.3.0.
          </p>
        </div>
      </div>
    </aside>
  )
}

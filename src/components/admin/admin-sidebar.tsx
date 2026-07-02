"use client"

import {
  BadgeCheck,
  Gamepad2,
  LayoutDashboard,
  MapPin,
  Megaphone,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react"

import { AdminSidebarBrand } from "@/components/admin/admin-sidebar-brand"
import { AdminSidebarFooter } from "@/components/admin/admin-sidebar-footer"
import { AdminSidebarSection } from "@/components/admin/admin-sidebar-section"

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
    badge: "v0.3",
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
    <aside className="border-b border-border bg-card/70 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-5 p-4 lg:p-5">
        <AdminSidebarBrand />

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
          {adminGroups.map((group) => (
            <AdminSidebarSection
              key={group.title}
              title={group.title}
              items={group.items}
            />
          ))}
        </nav>

        <AdminSidebarFooter />
      </div>
    </aside>
  )
}

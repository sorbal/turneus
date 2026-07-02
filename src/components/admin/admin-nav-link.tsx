"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type AdminNavLinkProps = {
  href: string
  label: string
  icon: LucideIcon
}

export function AdminNavLink({ href, label, icon: Icon }: AdminNavLinkProps) {
  const pathname = usePathname()
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`))

  return (
    <Link
      href={href}
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
        "text-muted-foreground hover:bg-secondary hover:text-foreground",
        isActive && "bg-secondary text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </Link>
  )
}

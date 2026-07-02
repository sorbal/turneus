"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type AdminNavLinkProps = {
  href: string
  label: string
  icon: LucideIcon
  badge?: string
}

export function AdminNavLink({
  href,
  label,
  icon: Icon,
  badge,
}: AdminNavLinkProps) {
  const pathname = usePathname()
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`))

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors",
        "text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "bg-secondary text-foreground shadow-sm"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          "bg-background/60 text-muted-foreground group-hover:text-foreground",
          isActive && "bg-primary text-primary-foreground"
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge ? (
        <span className="shrink-0 rounded-md border border-border bg-background px-1.5 py-0.5 text-[0.68rem] font-medium leading-none text-muted-foreground">
          {badge}
        </span>
      ) : null}
    </Link>
  )
}

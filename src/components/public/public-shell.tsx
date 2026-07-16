import type { ReactNode } from "react"

import { PublicFooter } from "@/components/public/public-footer"
import { PublicHeader } from "@/components/public/public-header"

type PublicShellProps = {
  children: ReactNode
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}

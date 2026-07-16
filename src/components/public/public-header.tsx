import Link from "next/link"
import { Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"

const publicNavigation = [
  {
    href: "/",
    label: "Acasa",
  },
  {
    href: "/turnee",
    label: "Turnee",
  },
]

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="flex items-center gap-2 text-base font-semibold tracking-normal text-white"
            href="/"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white">
              <Trophy className="size-4" />
            </span>
            Turneus
          </Link>

          <Button asChild size="sm" variant="secondary">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        <nav className="flex flex-wrap items-center gap-1 text-sm text-zinc-300">
          {publicNavigation.map((item) => (
            <Button asChild key={item.href} size="sm" variant="ghost">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}

import type { ReactNode } from "react"

import { PublicShell } from "@/components/public/public-shell"

type PublicLegalPageProps = {
  children: ReactNode
  eyebrow: string
  title: string
  description: string
}

export function PublicLegalPage({
  children,
  eyebrow,
  title,
  description,
}: PublicLegalPageProps) {
  return (
    <PublicShell>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8 rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-8">
          {children}
        </div>
      </section>
    </PublicShell>
  )
}

export function PublicLegalSection({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-normal text-white">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-7 text-zinc-300">{children}</div>
    </section>
  )
}

export function PublicLegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

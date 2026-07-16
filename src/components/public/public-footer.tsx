import Link from "next/link"

const footerLinks = [
  {
    href: "/turnee",
    label: "Turnee",
  },
  {
    href: "/organizatori",
    label: "Organizatori",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/regulament",
    label: "Regulament",
  },
]

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-zinc-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-1">
          <p className="font-medium text-zinc-200">Turneus</p>
          <p>Platforma pentru turnee moderne si competitii locale.</p>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              className="transition-colors hover:text-zinc-200"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

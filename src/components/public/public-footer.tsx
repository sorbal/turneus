import Image from "next/image"
import Link from "next/link"

const footerLinks = [
  {
    href: "/turnee",
    label: "Turnee",
  },
  {
    href: "/termeni-si-conditii",
    label: "Termeni si conditii",
  },
  {
    href: "/confidentialitate",
    label: "Confidentialitate",
  },
  {
    href: "/anulare-si-rambursare",
    label: "Anulare si rambursare",
  },
  {
    href: "/furnizarea-serviciului",
    label: "Furnizarea serviciului",
  },
  {
    href: "/solutionarea-litigiilor",
    label: "Solutionarea litigiilor",
  },
  {
    href: "/contact",
    label: "Contact",
  },
]

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 print:hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 text-sm text-zinc-400 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-zinc-200">Turneus</p>
            <p>Platforma pentru turnee moderne si competitii locale.</p>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
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

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Plati procesate securizat prin NETOPIA Payments</p>
          <Image
            alt="NETOPIA Payments, Mastercard si Visa"
            className="h-auto w-full max-w-[260px] opacity-90 sm:w-[240px]"
            height={222}
            src="/images/payments/netopia-visa-mastercard.png"
            width={891}
          />
        </div>
      </div>
    </footer>
  )
}

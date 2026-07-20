import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import type { ReactNode } from "react"
import { CalendarDays, MapPin, Ticket, UserCircle } from "lucide-react"

import { PublicShell } from "@/components/public/public-shell"
import { PublicTicketPrintButton } from "@/components/public/public-ticket-print-button"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth/current-user"
import { getAccountTicketByRegistrationId } from "@/services/account.service"
import type { AccountTicket } from "@/services/account.service"

type AccountTicketPageProps = {
  params: Promise<{
    registrationId: string
  }>
}

export const metadata: Metadata = {
  title: "Bilet de participare | Turneus",
  description: "Bilet digital privat pentru participarea la turneu.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AccountTicketPage({
  params,
}: AccountTicketPageProps) {
  const { registrationId } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect(`/login?redirect=/cont/bilete/${registrationId}`)
  }

  const ticket = await getAccountTicketByRegistrationId(
    registrationId,
    currentUser.id
  )

  if (!ticket) {
    notFound()
  }

  return (
    <PublicShell>
      <section className="ticket-print-page border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)] print:border-0 print:bg-white print:text-[10pt] print:leading-tight">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 md:py-14 lg:px-8 print:max-w-none print:p-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <Button
              asChild
              className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              variant="outline"
            >
              <Link href="/cont">Inapoi la cont</Link>
            </Button>
            <PublicTicketPrintButton />
          </div>

          <article className="ticket-print-card overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/30 print:break-inside-avoid print:overflow-visible print:rounded print:border-zinc-300 print:bg-white print:text-zinc-950 print:shadow-none print:[page-break-inside:avoid]">
            <div className="border-b border-white/10 bg-zinc-950/80 p-6 print:border-zinc-300 print:bg-white print:p-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:gap-1">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-normal text-zinc-400 print:text-[9pt] print:text-zinc-600">
                    Turneus
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-normal text-white print:mt-0.5 print:text-[24pt] print:leading-none print:text-zinc-950">
                    Bilet de participare
                  </h1>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium print:hidden ${getTicketBadgeClassName(ticket.status)}`}
                >
                  {ticket.statusLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr] print:block">
              <div className="space-y-6 p-6 print:space-y-1.5 print:p-2">
                <TicketSection title="Participant">
                  <TicketDetail
                    icon={<UserCircle className="size-4" />}
                    label="Nume"
                    value={ticket.participant.fullName}
                  />
                  <TicketDetail
                    label="Username"
                    value={ticket.participant.username}
                  />
                </TicketSection>

                <TicketSection title="Turneu">
                  <TicketDetail label="Turneu" value={ticket.tournament.name} />
                  <TicketDetail label="Joc" value={ticket.tournament.gameName} />
                  <TicketDetail
                    icon={<MapPin className="size-4" />}
                    label="Oras"
                    value={ticket.tournament.cityName}
                  />
                  <TicketDetail
                    label="Locatie"
                    value={ticket.tournament.venueName ?? "Fara locatie"}
                  />
                  {ticket.tournament.venueAddress ? (
                    <TicketDetail
                      label="Adresa"
                      value={ticket.tournament.venueAddress}
                    />
                  ) : null}
                  <TicketDetail
                    icon={<CalendarDays className="size-4" />}
                    label="Data si ora"
                    value={formatDateTime(ticket.tournament.startsAt)}
                  />
                </TicketSection>
              </div>

              <aside className="border-t border-white/10 bg-zinc-950/40 p-6 lg:border-l lg:border-t-0 print:border-zinc-300 print:bg-white print:p-2 print:pt-0">
                <div className="space-y-4 print:grid print:grid-cols-2 print:gap-1.5 print:space-y-0">
                  <TicketDetail
                    label="Referinta bilet"
                    value={ticket.id}
                  />
                  <TicketDetail
                    label="Data inscrierii"
                    value={formatDateTime(ticket.createdAt)}
                  />
                </div>

                <div className="mt-4 space-y-4 print:mt-1.5 print:grid print:grid-cols-3 print:gap-1.5 print:space-y-0">
                  <TicketDetail
                    label="Status inscriere"
                    value={ticket.statusLabel}
                  />
                  <TicketDetail
                    label="Status plata"
                    value={ticket.payment?.statusLabel ?? "Fara plata"}
                  />
                  <TicketDetail
                    label="Suma platita"
                    value={
                      ticket.payment
                        ? formatCurrency(ticket.payment.amount)
                        : "Nu exista plata"
                    }
                  />
                </div>

                <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-zinc-300 print:mt-1.5 print:rounded print:border-zinc-300 print:bg-white print:p-2 print:text-[9pt] print:leading-snug print:text-zinc-700">
                  Identitatea participantului poate fi verificata la acces.
                  Prezinta acest bilet impreuna cu datele contului Turneus daca
                  organizatorul solicita confirmarea.
                </p>
              </aside>
            </div>
          </article>
        </div>
      </section>
    </PublicShell>
  )
}

function TicketSection({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section className="space-y-3 print:break-inside-avoid print:space-y-1 print:[page-break-inside:avoid]">
      <h2 className="text-lg font-semibold text-white print:text-[11pt] print:leading-tight print:text-zinc-950">
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-3 print:gap-1.5">
        {children}
      </div>
    </section>
  )
}

function TicketDetail({
  icon,
  label,
  value,
}: {
  icon?: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="ticket-print-detail rounded-xl border border-white/10 bg-zinc-950/50 p-4 print:break-inside-avoid print:rounded print:border-zinc-300 print:bg-white print:p-1.5 print:[page-break-inside:avoid]">
      <p className="text-xs font-medium uppercase tracking-normal text-zinc-500 print:text-[7.5pt] print:leading-tight print:text-zinc-600">
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2 break-words text-sm font-medium text-white print:mt-0.5 print:gap-1 print:text-[9.5pt] print:leading-snug print:text-zinc-950">
        {icon ? <span className="print:hidden">{icon}</span> : null}
        {value}
      </p>
    </div>
  )
}

function getTicketBadgeClassName(status: AccountTicket["status"]) {
  if (status === "CHECKED_IN") {
    return "bg-emerald-500/15 text-emerald-300 print:border print:border-emerald-700 print:bg-white print:text-emerald-800"
  }

  return "bg-sky-500/15 text-sky-300 print:border print:border-sky-700 print:bg-white print:text-sky-800"
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(value))
}

import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CalendarDays,
  Gamepad2,
  MapPin,
  Trophy,
  UserRound,
  Users,
  Wallet,
} from "lucide-react"

import { PublicShell } from "@/components/public/public-shell"
import { PublicRegistrationAction } from "@/components/public/public-registration-action"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth/current-user"
import { getTournamentStatusLabel } from "@/lib/tournament-status"
import { cn } from "@/lib/utils"
import type { PublicTournamentDetails } from "@/repositories/tournament.repository"
import { getRegistrationByTournamentAndUser } from "@/services/registration.service"
import { getPublicTournamentBySlug } from "@/services/tournament.service"

type PublicTournamentDetailsPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PublicTournamentDetailsPageProps): Promise<Metadata> {
  const { slug } = await params
  const tournament = await getPublicTournamentBySlug(slug)

  if (!tournament) {
    return {
      title: "Turneu indisponibil - Turneus",
    }
  }

  return {
    title: `${tournament.name} - Turneus`,
    description:
      tournament.description ??
      `Detalii pentru turneul ${tournament.name} pe Turneus.`,
  }
}

export default async function PublicTournamentDetailsPage({
  params,
}: PublicTournamentDetailsPageProps) {
  const { slug } = await params
  const tournament = await getPublicTournamentBySlug(slug)

  if (!tournament) {
    notFound()
  }

  const occupiedSeats = tournament.activeRegistrationsCount
  const currentUser = await getCurrentUser()
  const registration = currentUser
    ? await getRegistrationByTournamentAndUser(tournament.id, currentUser.id)
    : null

  return (
    <PublicShell>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Button
            asChild
            className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            variant="outline"
          >
            <Link href="/turnee">Inapoi la turnee</Link>
          </Button>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                  getStatusClassName(tournament.status)
                )}
              >
                {getTournamentStatusLabel(tournament.status)}
              </span>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal text-white md:text-5xl">
                {tournament.name}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
                {tournament.description ??
                  "Acest turneu nu are inca o descriere publica."}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/25">
              <p className="text-sm font-medium text-zinc-400">
                Locuri ocupate
              </p>
              <p className="mt-2 text-4xl font-semibold text-white">
                {occupiedSeats} / {tournament.maxPlayers}
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                Inscrierile anulate nu sunt incluse in acest numar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailCard
              icon={<Gamepad2 className="size-4" />}
              label="Joc"
              value={tournament.game.name}
            />
            <DetailCard
              icon={<Trophy className="size-4" />}
              label="Sezon"
              value={tournament.season.name}
            />
            <DetailCard
              icon={<MapPin className="size-4" />}
              label="Oras"
              value={tournament.city.name}
            />
            <DetailCard
              icon={<CalendarDays className="size-4" />}
              label="Data si ora"
              value={formatDateTime(tournament.startsAt)}
            />
          </div>

          <InfoPanel title="Locatie">
            {tournament.venue ? (
              <div className="space-y-1">
                <p className="font-medium text-white">{tournament.venue.name}</p>
                <p className="text-zinc-400">
                  {tournament.venue.address ??
                    "Adresa nu este disponibila momentan."}
                </p>
              </div>
            ) : (
              <p className="text-zinc-400">
                Locatia va fi comunicata de organizator.
              </p>
            )}
          </InfoPanel>

          <InfoPanel title="Organizator">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white">
                <UserRound className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="font-medium text-white">
                  {tournament.organizer.publicName}
                </p>
                <p className="text-zinc-400">
                  {tournament.organizer.description ??
                    "Organizator verificat in platforma Turneus."}
                </p>
              </div>
            </div>
          </InfoPanel>
        </div>

        <aside className="space-y-4">
          <DetailCard
            icon={<Wallet className="size-4" />}
            label="Taxa participare"
            value={formatCurrency(tournament.entryFee)}
          />
          <DetailCard
            icon={<Trophy className="size-4" />}
            label="Fond premiere"
            value={formatCurrency(tournament.prizePoolAmount)}
          />
          <DetailCard
            icon={<Users className="size-4" />}
            label="Locuri"
            value={`${occupiedSeats} ocupate din ${tournament.maxPlayers}`}
          />
          <PublicRegistrationAction
            currentUserRole={currentUser?.role ?? null}
            isTournamentOrganizer={
              currentUser?.id === tournament.organizer.user.id
            }
            maxPlayers={tournament.maxPlayers}
            occupiedSeats={occupiedSeats}
            registrationId={registration?.id ?? null}
            registrationStatus={registration?.status ?? null}
            startsAt={tournament.startsAt.toISOString()}
            tournamentId={tournament.id}
            tournamentSlug={tournament.slug}
            tournamentStatus={tournament.status}
          />
        </aside>
      </section>
    </PublicShell>
  )
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <span className="text-xs font-medium uppercase tracking-normal">
          {label}
        </span>
      </div>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function InfoPanel({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 text-sm leading-6">{children}</div>
    </div>
  )
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(value)
}

function formatCurrency(value: PublicTournamentDetails["entryFee"]) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(value))
}

function getStatusClassName(status: PublicTournamentDetails["status"]) {
  if (status === "OPEN") {
    return "bg-emerald-500/15 text-emerald-300"
  }

  if (status === "FULL" || status === "IN_PROGRESS") {
    return "bg-sky-500/15 text-sky-300"
  }

  return "bg-violet-500/15 text-violet-300"
}

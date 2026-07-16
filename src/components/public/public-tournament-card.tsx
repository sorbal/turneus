import {
  CalendarDays,
  Gamepad2,
  MapPin,
  Trophy,
  Users,
  Wallet,
} from "lucide-react"
import Link from "next/link"

import type { TournamentWithRelations } from "@/repositories/tournament.repository"
import { cn } from "@/lib/utils"
import { getTournamentStatusLabel } from "@/lib/tournament-status"

type PublicTournamentCardProps = {
  tournament: TournamentWithRelations
}

export function PublicTournamentCard({
  tournament,
}: PublicTournamentCardProps) {
  const occupiedSeats = tournament._count.registrations

  return (
    <Link
      className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.04] p-5 text-zinc-50 shadow-lg shadow-black/10 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-black/25"
      href={`/turnee/${tournament.slug}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
              getStatusClassName(tournament.status)
            )}
          >
            {getTournamentStatusLabel(tournament.status)}
          </span>
          <h3 className="text-xl font-semibold tracking-normal text-white transition-colors group-hover:text-zinc-200">
            {tournament.name}
          </h3>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white">
          <Trophy className="size-4" />
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-zinc-300">
        <TournamentMetaItem icon={<Gamepad2 className="size-4" />}>
          {tournament.game.name}
        </TournamentMetaItem>
        <TournamentMetaItem icon={<MapPin className="size-4" />}>
          {tournament.city.name}
          {tournament.venue ? ` - ${tournament.venue.name}` : ""}
        </TournamentMetaItem>
        <TournamentMetaItem icon={<CalendarDays className="size-4" />}>
          {formatDateTime(tournament.startsAt)}
        </TournamentMetaItem>
        <TournamentMetaItem icon={<Users className="size-4" />}>
          {occupiedSeats} / {tournament.maxPlayers} locuri
        </TournamentMetaItem>
        <TournamentMetaItem icon={<Wallet className="size-4" />}>
          {formatCurrency(tournament.entryFee)}
        </TournamentMetaItem>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4 text-sm text-zinc-400">
        Organizator:{" "}
        <span className="font-medium text-zinc-200">
          {tournament.organizer.publicName}
        </span>
      </div>
    </Link>
  )
}

function TournamentMetaItem({
  children,
  icon,
}: {
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-500">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

function formatCurrency(value: TournamentWithRelations["entryFee"]) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(value))
}

function getStatusClassName(status: TournamentWithRelations["status"]) {
  if (status === "OPEN") {
    return "bg-emerald-500/15 text-emerald-300"
  }

  if (status === "DRAFT") {
    return "bg-zinc-500/15 text-zinc-300"
  }

  if (status === "FULL" || status === "IN_PROGRESS") {
    return "bg-sky-500/15 text-sky-300"
  }

  if (status === "COMPLETED") {
    return "bg-violet-500/15 text-violet-300"
  }

  return "bg-red-500/15 text-red-300"
}

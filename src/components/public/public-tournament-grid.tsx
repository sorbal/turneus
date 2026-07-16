import { PublicTournamentCard } from "@/components/public/public-tournament-card"
import type { TournamentWithRelations } from "@/repositories/tournament.repository"

type PublicTournamentGridProps = {
  tournaments: TournamentWithRelations[]
  emptyTitle?: string
  emptyDescription?: string
}

export function PublicTournamentGrid({
  tournaments,
  emptyTitle = "Nu exista turnee disponibile",
  emptyDescription = "Revino curand pentru urmatoarele competitii publicate pe Turneus.",
}: PublicTournamentGridProps) {
  if (tournaments.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-10 text-center">
        <h2 className="text-lg font-semibold text-white">{emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400">
          {emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tournaments.map((tournament) => (
        <PublicTournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  )
}

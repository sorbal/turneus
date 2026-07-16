import { PublicShell } from "@/components/public/public-shell"
import {
  PublicTournamentFilters,
  type PublicTournamentFiltersValue,
} from "@/components/public/public-tournament-filters"
import { PublicTournamentGrid } from "@/components/public/public-tournament-grid"
import { getTournamentStatusLabel } from "@/lib/tournament-status"
import type { PublicTournamentDetails } from "@/repositories/tournament.repository"
import { getPublicTournaments } from "@/services/tournament.service"

type PublicTournamentsPageProps = {
  searchParams: Promise<{
    search?: string
    game?: string
    city?: string
    status?: string
    sort?: string
  }>
}

const publicStatuses: PublicTournamentDetails["status"][] = [
  "OPEN",
  "FULL",
  "IN_PROGRESS",
  "COMPLETED",
]

export default async function PublicTournamentsPage({
  searchParams,
}: PublicTournamentsPageProps) {
  const params = await searchParams
  const tournaments = await getPublicTournaments()
  const publicTournaments = tournaments.filter((tournament) =>
    publicStatuses.includes(tournament.status)
  )
  const filters = normalizeFilters(params)
  const gameOptions = getUniqueOptions(
    publicTournaments.map((tournament) => tournament.game)
  )
  const cityOptions = getUniqueOptions(
    publicTournaments.map((tournament) => tournament.city)
  )
  const filteredTournaments = sortTournaments(
    publicTournaments.filter((tournament) =>
      matchesFilters(tournament, filters)
    ),
    filters.sort
  )

  return (
    <PublicShell>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
            Turnee publice
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-white md:text-5xl">
            Gaseste competitia potrivita.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Exploreaza turnee deschise, in desfasurare sau finalizate, cu
            filtre rapide dupa joc, oras, status si cautare.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <PublicTournamentFilters
          cityOptions={cityOptions}
          filters={filters}
          gameOptions={gameOptions}
          statusOptions={publicStatuses}
        />

        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
              Rezultate
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-white">
              {filteredTournaments.length} turnee gasite
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            Sunt afisate statusurile{" "}
            {publicStatuses.map(getTournamentStatusLabel).join(", ")}.
          </p>
        </div>

        <PublicTournamentGrid
          emptyDescription="Nu exista turnee care sa corespunda filtrelor selectate."
          emptyTitle="Nu exista rezultate"
          tournaments={filteredTournaments}
        />
      </section>
    </PublicShell>
  )
}

function normalizeFilters(
  params: Awaited<PublicTournamentsPageProps["searchParams"]>
): PublicTournamentFiltersValue {
  const status = publicStatuses.includes(
    params.status as PublicTournamentDetails["status"]
  )
    ? params.status ?? ""
    : ""
  const sort = params.sort === "newest" ? "newest" : "upcoming"

  return {
    search: params.search?.trim() ?? "",
    game: params.game?.trim() ?? "",
    city: params.city?.trim() ?? "",
    status,
    sort,
  }
}

function matchesFilters(
  tournament: PublicTournamentDetails,
  filters: PublicTournamentFiltersValue
) {
  if (filters.game && tournament.gameId !== filters.game) {
    return false
  }

  if (filters.city && tournament.cityId !== filters.city) {
    return false
  }

  if (filters.status && tournament.status !== filters.status) {
    return false
  }

  if (!filters.search) {
    return true
  }

  const search = filters.search.toLocaleLowerCase("ro-RO")
  const searchableText = [
    tournament.name,
    tournament.game.name,
    tournament.city.name,
    tournament.organizer.publicName,
  ]
    .join(" ")
    .toLocaleLowerCase("ro-RO")

  return searchableText.includes(search)
}

function sortTournaments(
  tournaments: PublicTournamentDetails[],
  sort: PublicTournamentFiltersValue["sort"]
) {
  return [...tournaments].sort((firstTournament, secondTournament) => {
    if (sort === "newest") {
      return secondTournament.createdAt.getTime() - firstTournament.createdAt.getTime()
    }

    return firstTournament.startsAt.getTime() - secondTournament.startsAt.getTime()
  })
}

function getUniqueOptions(items: { id: string; name: string }[]) {
  const options = new Map<string, string>()

  for (const item of items) {
    options.set(item.id, item.name)
  }

  return [...options.entries()]
    .map(([id, name]) => ({
      id,
      name,
    }))
    .sort((firstOption, secondOption) =>
      firstOption.name.localeCompare(secondOption.name, "ro-RO")
    )
}

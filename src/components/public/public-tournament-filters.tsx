import Link from "next/link"

import type { TournamentWithRelations } from "@/repositories/tournament.repository"
import { Button } from "@/components/ui/button"
import { getTournamentStatusLabel } from "@/lib/tournament-status"

export type PublicTournamentFiltersValue = {
  search: string
  game: string
  city: string
  status: string
  sort: string
}

type PublicTournamentFiltersProps = {
  filters: PublicTournamentFiltersValue
  gameOptions: TournamentFilterOption[]
  cityOptions: TournamentFilterOption[]
  statusOptions: TournamentWithRelations["status"][]
}

type TournamentFilterOption = {
  id: string
  name: string
}

export function PublicTournamentFilters({
  filters,
  gameOptions,
  cityOptions,
  statusOptions,
}: PublicTournamentFiltersProps) {
  return (
    <form
      className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/10"
      method="GET"
    >
      <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr_auto]">
        <div className="space-y-2">
          <label
            className="text-xs font-medium uppercase tracking-normal text-zinc-500"
            htmlFor="tournament-search"
          >
            Cautare
          </label>
          <input
            className="h-10 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-white/25 focus:ring-2 focus:ring-white/10"
            defaultValue={filters.search}
            id="tournament-search"
            name="search"
            placeholder="Nume, joc, oras, organizator"
            type="search"
          />
        </div>

        <FilterSelect
          defaultValue={filters.game}
          label="Joc"
          name="game"
          options={gameOptions}
          placeholder="Toate jocurile"
        />

        <FilterSelect
          defaultValue={filters.city}
          label="Oras"
          name="city"
          options={cityOptions}
          placeholder="Toate orasele"
        />

        <div className="space-y-2">
          <label
            className="text-xs font-medium uppercase tracking-normal text-zinc-500"
            htmlFor="tournament-status"
          >
            Status
          </label>
          <select
            className="h-10 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-3 text-sm text-white outline-none transition-colors focus:border-white/25 focus:ring-2 focus:ring-white/10"
            defaultValue={filters.status}
            id="tournament-status"
            name="status"
          >
            <option value="">Toate statusurile</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {getTournamentStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-medium uppercase tracking-normal text-zinc-500"
            htmlFor="tournament-sort"
          >
            Sortare
          </label>
          <select
            className="h-10 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-3 text-sm text-white outline-none transition-colors focus:border-white/25 focus:ring-2 focus:ring-white/10"
            defaultValue={filters.sort}
            id="tournament-sort"
            name="sort"
          >
            <option value="upcoming">Cele mai apropiate</option>
            <option value="newest">Cele mai noi</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            className="h-10 bg-white text-zinc-950 hover:bg-zinc-200"
            type="submit"
          >
            Filtreaza
          </Button>
          <Button
            asChild
            className="h-10 border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            variant="outline"
          >
            <Link href="/turnee">Reset</Link>
          </Button>
        </div>
      </div>
    </form>
  )
}

function FilterSelect({
  defaultValue,
  label,
  name,
  options,
  placeholder,
}: {
  defaultValue: string
  label: string
  name: string
  options: TournamentFilterOption[]
  placeholder: string
}) {
  return (
    <div className="space-y-2">
      <label
        className="text-xs font-medium uppercase tracking-normal text-zinc-500"
        htmlFor={`tournament-${name}`}
      >
        {label}
      </label>
      <select
        className="h-10 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-3 text-sm text-white outline-none transition-colors focus:border-white/25 focus:ring-2 focus:ring-white/10"
        defaultValue={defaultValue}
        id={`tournament-${name}`}
        name={name}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

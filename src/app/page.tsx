import Link from "next/link"
import { ArrowRight, CalendarCheck, Search, Trophy } from "lucide-react"

import { PublicShell } from "@/components/public/public-shell"
import { PublicTournamentGrid } from "@/components/public/public-tournament-grid"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"
import { getGames } from "@/services/game.service"
import { getPublicTournaments } from "@/services/tournament.service"

const howItWorksSteps = [
  {
    title: "Descopera turnee",
    description:
      "Gaseste competitii deschise in orasul tau, filtrate dupa joc, data si organizator.",
    icon: Search,
  },
  {
    title: "Alege competitia",
    description:
      "Verifica detaliile turneului, locatia, taxa de participare si locurile disponibile.",
    icon: CalendarCheck,
  },
  {
    title: "Participa",
    description:
      "Inscrierea si managementul competitiei raman conectate in acelasi ecosistem Turneus.",
    icon: Trophy,
  },
]

export default async function Home() {
  const [tournaments, cities, games] = await Promise.all([
    getPublicTournaments(),
    getCities(),
    getGames(),
  ])
  const now = Date.now()
  const openTournamentsCount = tournaments.filter(
    (tournament) => tournament.status === "OPEN"
  ).length
  const openUpcomingTournaments = tournaments
    .filter(
      (tournament) =>
        tournament.status === "OPEN" && tournament.startsAt.getTime() > now
    )
    .sort((firstTournament, secondTournament) =>
      firstTournament.startsAt.getTime() - secondTournament.startsAt.getTime()
    )
    .slice(0, 6)

  return (
    <PublicShell>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32rem)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-400">
              Turnee locale. Organizare premium.
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-white md:text-5xl">
              Turneus conecteaza jucatori, organizatori si competitii reale.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
              Descopera turnee deschise, urmareste detaliile importante si
              intra in competitia potrivita fara zgomot inutil.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-white text-zinc-950 shadow-lg shadow-white/10 hover:bg-zinc-200"
                size="lg"
              >
                <Link href="/turnee">
                  Vezi turneele
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30">
            <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-5">
              <p className="text-sm font-medium text-zinc-400">
                Date publice Turneus
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <HeroMetric label="Turnee" value={tournaments.length} />
                <HeroMetric label="Turnee OPEN" value={openTournamentsCount} />
                <HeroMetric label="Orase" value={cities.length} />
                <HeroMetric label="Jocuri" value={games.length} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
              Turnee deschise
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-white">
              Urmatoarele competitii disponibile
            </h2>
          </div>
          <Button
            asChild
            className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            variant="outline"
          >
            <Link href="/turnee">Toate turneele</Link>
          </Button>
        </div>

        <PublicTournamentGrid
          emptyDescription="Nu exista momentan turnee deschise cu data in viitor."
          emptyTitle="Nu exista turnee deschise"
          tournaments={openUpcomingTournaments}
        />
      </section>

      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
              Cum functioneaza
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-white">
              De la cautare la competitie in cativa pasi clari
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {howItWorksSteps.map((step) => {
              const Icon = step.icon

              return (
                <div
                  className="rounded-lg border border-white/10 bg-zinc-950/70 p-5"
                  key={step.title}
                >
                  <span className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

function HeroMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="mt-2 block text-2xl font-semibold text-white">
        {value}
      </span>
    </div>
  )
}

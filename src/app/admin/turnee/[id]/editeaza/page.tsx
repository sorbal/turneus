import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminTournamentForm } from "@/components/admin/admin-tournament-form"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"
import { getGames } from "@/services/game.service"
import { getOrganizers } from "@/services/organizer.service"
import { getTournamentById } from "@/services/tournament.service"
import { getVenues } from "@/services/venue.service"

type EditAdminTournamentPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminTournamentPage({
  params,
}: EditAdminTournamentPageProps) {
  const { id } = await params
  const [tournament, games, cities, venues, organizers] = await Promise.all([
    getTournamentById(id),
    getGames(),
    getCities(),
    getVenues(),
    getOrganizers(),
  ])

  if (!tournament) {
    notFound()
  }

  const activeGames = games.filter((game) => game.isActive)
  const approvedOrganizers = organizers.filter(
    (organizer) => organizer.isApproved
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Tournament CRUD"
          title="Editeaza turneu"
          description={`Actualizeaza datele pentru ${tournament.name}.`}
        />

        <Button asChild variant="outline">
          <Link href="/admin/turnee">Inapoi la turnee</Link>
        </Button>
      </div>

      <AdminTournamentForm
        cities={cities}
        games={activeGames}
        initialValues={{
          id: tournament.id,
          name: tournament.name,
          description: tournament.description ?? "",
          gameId: tournament.gameId,
          cityId: tournament.cityId,
          venueId: tournament.venueId ?? "",
          organizerId: tournament.organizerId,
          startsAt: formatDateTimeLocal(tournament.startsAt),
          entryFee: tournament.entryFee.toString(),
          maxPlayers: tournament.maxPlayers.toString(),
        }}
        mode="edit"
        organizers={approvedOrganizers}
        venues={venues}
      />
    </div>
  )
}

function formatDateTimeLocal(value: Date) {
  return value.toISOString().slice(0, 16)
}

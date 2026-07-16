import Link from "next/link"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminTournamentForm } from "@/components/admin/admin-tournament-form"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"
import { getGames } from "@/services/game.service"
import { getOrganizers } from "@/services/organizer.service"
import { getVenues } from "@/services/venue.service"

export default async function AddAdminTournamentPage() {
  const [games, cities, venues, organizers] = await Promise.all([
    getGames(),
    getCities(),
    getVenues(),
    getOrganizers(),
  ])
  const activeGames = games.filter((game) => game.isActive)
  const approvedOrganizers = organizers.filter(
    (organizer) => organizer.isApproved
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Tournament CRUD"
          title="Adauga turneu"
          description="Creeaza un turneu nou pentru un joc, oras si organizator aprobat."
        />

        <Button asChild variant="outline">
          <Link href="/admin/turnee">Inapoi la turnee</Link>
        </Button>
      </div>

      <AdminTournamentForm
        cities={cities}
        games={activeGames}
        organizers={approvedOrganizers}
        venues={venues}
      />
    </div>
  )
}

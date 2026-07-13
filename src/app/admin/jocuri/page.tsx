import Link from "next/link"

import { AdminGamesTable } from "@/components/admin/admin-games-table"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getGames } from "@/services/game.service"

export default async function AdminGamesPage() {
  const games = await getGames()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Games CRUD"
          title="Jocuri"
          description="Administreaza jocurile disponibile pe platforma Turneus."
        />

        <Button asChild>
          <Link href="/admin/jocuri/adauga">Adauga joc</Link>
        </Button>
      </div>

      <AdminGamesTable games={games} />
    </div>
  )
}

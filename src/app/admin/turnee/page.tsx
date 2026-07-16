import Link from "next/link"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminTournamentsTable } from "@/components/admin/admin-tournaments-table"
import { Button } from "@/components/ui/button"
import { getTournaments } from "@/services/tournament.service"

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Tournament CRUD"
          title="Turnee"
          description="Administreaza turneele configurate in platforma Turneus."
        />

        <Button asChild>
          <Link href="/admin/turnee/adauga">Adauga turneu</Link>
        </Button>
      </div>

      <AdminTournamentsTable tournaments={tournaments} />
    </div>
  )
}

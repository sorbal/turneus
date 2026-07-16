import Link from "next/link"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminSeasonsTable } from "@/components/admin/admin-seasons-table"
import { Button } from "@/components/ui/button"
import { getSeasons } from "@/services/season.service"

export default async function AdminSeasonsPage() {
  const seasons = await getSeasons()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Seasons CRUD"
          title="Sezoane"
          description="Administreaza sezoanele competitionale folosite pentru turnee si statistici."
        />
        <Button asChild>
          <Link href="/admin/sezoane/adauga">Adauga sezon</Link>
        </Button>
      </div>

      <AdminSeasonsTable seasons={seasons} />
    </div>
  )
}

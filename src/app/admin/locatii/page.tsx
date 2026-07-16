import Link from "next/link"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminVenuesTable } from "@/components/admin/admin-venues-table"
import { Button } from "@/components/ui/button"
import { getVenues } from "@/services/venue.service"

export default async function AdminVenuesPage() {
  const venues = await getVenues()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Venues CRUD"
          title="Locatii"
          description="Administreaza locatiile fizice disponibile pentru turneele Turneus."
        />

        <Button asChild>
          <Link href="/admin/locatii/adauga">Adauga locatie</Link>
        </Button>
      </div>

      <AdminVenuesTable venues={venues} />
    </div>
  )
}

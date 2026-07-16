import Link from "next/link"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminVenueForm } from "@/components/admin/admin-venue-form"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"

export default async function AddAdminVenuePage() {
  const cities = await getCities()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Venues CRUD"
          title="Adauga locatie"
          description="Creeaza o locatie fizica disponibila pentru turnee."
        />

        <Button asChild variant="outline">
          <Link href="/admin/locatii">Inapoi la locatii</Link>
        </Button>
      </div>

      <AdminVenueForm cities={cities} />
    </div>
  )
}

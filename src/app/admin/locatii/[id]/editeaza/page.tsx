import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminVenueForm } from "@/components/admin/admin-venue-form"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"
import { getVenueById } from "@/services/venue.service"

type EditAdminVenuePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminVenuePage({
  params,
}: EditAdminVenuePageProps) {
  const { id } = await params
  const [venue, cities] = await Promise.all([getVenueById(id), getCities()])

  if (!venue) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Venues CRUD"
          title="Editeaza locatie"
          description={`Actualizeaza datele pentru ${venue.name}.`}
        />

        <Button asChild variant="outline">
          <Link href="/admin/locatii">Inapoi la locatii</Link>
        </Button>
      </div>

      <AdminVenueForm
        cities={cities}
        initialValues={{
          id: venue.id,
          name: venue.name,
          cityId: venue.cityId,
          address: venue.address ?? "",
        }}
        mode="edit"
      />
    </div>
  )
}

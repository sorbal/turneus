import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminOrganizerForm } from "@/components/admin/admin-organizer-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"
import { getOrganizerById } from "@/services/organizer.service"

type EditAdminOrganizerPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminOrganizerPage({
  params,
}: EditAdminOrganizerPageProps) {
  const { id } = await params
  const [organizer, cities] = await Promise.all([
    getOrganizerById(id),
    getCities(),
  ])

  if (!organizer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Organizers CRUD"
          title="Editeaza organizator"
          description={`Actualizeaza profilul pentru ${organizer.publicName}.`}
        />

        <Button asChild variant="outline">
          <Link href="/admin/organizatori">Inapoi la organizatori</Link>
        </Button>
      </div>

      <AdminOrganizerForm
        cities={cities}
        eligibleUsers={[]}
        initialValues={{
          id: organizer.id,
          publicName: organizer.publicName,
          slug: organizer.slug,
          logoUrl: organizer.logoUrl ?? "",
          description: organizer.description ?? "",
          cityIds: organizer.cities.map((organizerCity) => organizerCity.city.id),
        }}
        mode="edit"
        userLabel={formatOrganizerUserLabel(organizer.user)}
      />
    </div>
  )
}

function formatOrganizerUserLabel(user: {
  firstName: string
  lastName: string
  email: string
}) {
  return `${user.firstName} ${user.lastName} (${user.email})`
}

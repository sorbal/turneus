import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminCityForm } from "@/components/admin/admin-city-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getCityById } from "@/services/city.service"

type EditAdminCityPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminCityPage({
  params,
}: EditAdminCityPageProps) {
  const { id } = await params
  const city = await getCityById(id)

  if (!city) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Cities CRUD"
          title="Editeaza oras"
          description={`Actualizeaza datele pentru ${city.name}.`}
        />

        <Button asChild variant="outline">
          <Link href="/admin/orase">Inapoi la orase</Link>
        </Button>
      </div>

      <AdminCityForm
        initialValues={{
          id: city.id,
          name: city.name,
          slug: city.slug,
          county: city.county ?? "",
          country: city.country,
        }}
        mode="edit"
      />
    </div>
  )
}

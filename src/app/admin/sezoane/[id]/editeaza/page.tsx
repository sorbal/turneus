import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminSeasonForm } from "@/components/admin/admin-season-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getSeasonById } from "@/services/season.service"

type EditAdminSeasonPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminSeasonPage({
  params,
}: EditAdminSeasonPageProps) {
  const { id } = await params
  const season = await getSeasonById(id)

  if (!season) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Seasons CRUD"
          title="Editeaza sezon"
          description={`Actualizeaza datele pentru ${season.name}.`}
        />

        <Button asChild variant="outline">
          <Link href="/admin/sezoane">Inapoi la sezoane</Link>
        </Button>
      </div>

      <AdminSeasonForm
        initialValues={{
          id: season.id,
          name: season.name,
          year: season.year.toString(),
          startsAt: formatDateInput(season.startsAt),
          endsAt: formatDateInput(season.endsAt),
          isActive: season.isActive,
        }}
        mode="edit"
      />
    </div>
  )
}

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10)
}

import Link from "next/link"

import { AdminCitiesTable } from "@/components/admin/admin-cities-table"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"

export default async function AdminCitiesPage() {
  const cities = await getCities()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Cities CRUD"
          title="Orase"
          description="Administreaza orasele disponibile pentru turnee, organizatori si profiluri publice."
        />

        <Button asChild>
          <Link href="/admin/orase/adauga">Adauga oras</Link>
        </Button>
      </div>

      <AdminCitiesTable cities={cities} />
    </div>
  )
}

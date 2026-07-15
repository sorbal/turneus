import Link from "next/link"

import { AdminOrganizersTable } from "@/components/admin/admin-organizers-table"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getOrganizers } from "@/services/organizer.service"

export default async function AdminOrganizersPage() {
  const organizers = await getOrganizers()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Organizers CRUD"
          title="Organizatori"
          description="Administreaza profilurile de organizator, aprobarea si prezenta lor locala."
        />

        <Button asChild>
          <Link href="/admin/organizatori/adauga">Adauga organizator</Link>
        </Button>
      </div>

      <AdminOrganizersTable organizers={organizers} />
    </div>
  )
}

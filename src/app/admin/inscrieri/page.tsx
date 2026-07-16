import Link from "next/link"

import { AdminRegistrationsTable } from "@/components/admin/admin-registrations-table"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getRegistrations } from "@/services/registration.service"

export default async function AdminRegistrationsPage() {
  const registrations = await getRegistrations()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Tournament Registrations"
          title="Inscrieri"
          description="Monitorizeaza inscrierile jucatorilor la turneele din platforma Turneus."
        />

        <Button asChild>
          <Link href="/admin/inscrieri/adauga">Adauga inscriere</Link>
        </Button>
      </div>

      <AdminRegistrationsTable registrations={registrations} />
    </div>
  )
}

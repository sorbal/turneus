import Link from "next/link"

import { AdminOrganizerForm } from "@/components/admin/admin-organizer-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"
import { getEligibleOrganizerUsers } from "@/services/organizer.service"

export default async function AddAdminOrganizerPage() {
  const [eligibleUsers, cities] = await Promise.all([
    getEligibleOrganizerUsers(),
    getCities(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Organizers CRUD"
          title="Adauga organizator"
          description="Creeaza un profil de organizator pentru un utilizator existent."
        />

        <Button asChild variant="outline">
          <Link href="/admin/organizatori">Inapoi la organizatori</Link>
        </Button>
      </div>

      <AdminOrganizerForm cities={cities} eligibleUsers={eligibleUsers} />
    </div>
  )
}

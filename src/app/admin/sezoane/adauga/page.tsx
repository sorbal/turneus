import Link from "next/link"

import { AdminSeasonForm } from "@/components/admin/admin-season-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"

export default function AddAdminSeasonPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Seasons CRUD"
          title="Adauga sezon"
          description="Creeaza un sezon competitional pentru turnee si statistici."
        />

        <Button asChild variant="outline">
          <Link href="/admin/sezoane">Inapoi la sezoane</Link>
        </Button>
      </div>

      <AdminSeasonForm />
    </div>
  )
}

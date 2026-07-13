import Link from "next/link"

import { AdminGameForm } from "@/components/admin/admin-game-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"

export default function AddAdminGamePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Games CRUD"
          title="Adauga joc"
          description="Creeaza un joc nou disponibil pentru turneele din platforma Turneus."
        />

        <Button asChild variant="outline">
          <Link href="/admin/jocuri">Inapoi la jocuri</Link>
        </Button>
      </div>

      <AdminGameForm />
    </div>
  )
}

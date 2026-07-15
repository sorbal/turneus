import Link from "next/link"

import { AdminCityForm } from "@/components/admin/admin-city-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"

export default function AddAdminCityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Cities CRUD"
          title="Adauga oras"
          description="Creeaza un oras nou disponibil pentru turnee si profiluri locale."
        />

        <Button asChild variant="outline">
          <Link href="/admin/orase">Inapoi la orase</Link>
        </Button>
      </div>

      <AdminCityForm />
    </div>
  )
}

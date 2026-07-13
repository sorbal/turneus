import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminGameForm } from "@/components/admin/admin-game-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getGameById } from "@/services/game.service"

type EditAdminGamePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminGamePage({
  params,
}: EditAdminGamePageProps) {
  const { id } = await params
  const game = await getGameById(id)

  if (!game) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Games CRUD"
          title="Editeaza joc"
          description={`Actualizeaza setarile pentru ${game.name}.`}
        />

        <Button asChild variant="outline">
          <Link href="/admin/jocuri">Inapoi la jocuri</Link>
        </Button>
      </div>

      <AdminGameForm
        initialValues={{
          id: game.id,
          name: game.name,
          slug: game.slug,
          description: game.description ?? "",
          isActive: game.isActive,
        }}
        mode="edit"
      />
    </div>
  )
}

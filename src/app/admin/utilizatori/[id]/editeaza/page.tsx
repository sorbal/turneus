import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminUserForm } from "@/components/admin/admin-user-form"
import { Button } from "@/components/ui/button"
import { getCities } from "@/services/city.service"
import { getUserById } from "@/services/user.service"

type EditAdminUserPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminUserPage({
  params,
}: EditAdminUserPageProps) {
  const { id } = await params
  const [user, cities] = await Promise.all([getUserById(id), getCities()])

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="User Management"
          title="Editeaza utilizator"
          description={`Actualizeaza datele pentru ${formatUserName(user)}.`}
        />

        <Button asChild variant="outline">
          <Link href="/admin/utilizatori">Inapoi la utilizatori</Link>
        </Button>
      </div>

      <AdminUserForm
        cities={cities}
        initialValues={{
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          phone: user.phone ?? "",
          cityId: user.cityId ?? "",
          birthDate: formatDateInputValue(user.birthDate),
          avatarUrl: user.avatarUrl ?? "",
          bio: user.bio ?? "",
          role: user.role,
          isActive: user.isActive,
        }}
      />
    </div>
  )
}

function formatUserName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`.trim()
}

function formatDateInputValue(date: Date | null) {
  if (!date) {
    return ""
  }

  return date.toISOString().slice(0, 10)
}

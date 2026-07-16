import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminUsersTable } from "@/components/admin/admin-users-table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth/require-admin"
import { getUsers } from "@/services/user.service"

type AdminUsersPageProps = {
  searchParams: Promise<{
    search?: string
  }>
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const { search } = await searchParams
  const [currentAdmin, users] = await Promise.all([
    requireAdmin(),
    getUsers(search),
  ])
  const defaultSearch = search?.trim() ?? ""

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="User Management"
        title="Utilizatori"
        description="Administreaza conturile, rolurile si statusul utilizatorilor Turneus."
      />

      <Card>
        <CardHeader>
          <CardTitle>Cautare utilizatori</CardTitle>
          <CardDescription>
            Filtreaza lista dupa nume, username sau email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 md:flex-row" method="GET">
            <input
              className="min-h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              defaultValue={defaultSearch}
              name="search"
              placeholder="Cauta dupa nume, username sau email"
              type="search"
            />
            <Button type="submit">Cauta</Button>
          </form>
        </CardContent>
      </Card>

      <AdminUsersTable currentAdminId={currentAdmin.id} users={users} />
    </div>
  )
}

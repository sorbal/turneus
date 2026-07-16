import { AdminUserActions } from "@/components/admin/admin-user-actions"
import type { UserWithRelations } from "@/repositories/user.repository"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminUsersTableProps = {
  currentAdminId: string
  users: UserWithRelations[]
}

export function AdminUsersTable({
  currentAdminId,
  users,
}: AdminUsersTableProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista utilizatori</CardTitle>
          <CardDescription>
            Nu am gasit utilizatori pentru criteriile curente de cautare.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilizatori configurati</CardTitle>
        <CardDescription>
          Lista conturilor create prin fluxul de inregistrare Turneus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[76rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Utilizator</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Oras</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Data inscrierii</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatUserName(user)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.city?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          getRoleBadgeClassName(user.role)
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          user.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {user.isActive ? "Activ" : "Inactiv"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminUserActions
                        currentAdminId={currentAdminId}
                        fullName={formatUserName(user)}
                        id={user.id}
                        isActive={user.isActive}
                        role={user.role}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatUserName(user: UserWithRelations) {
  return `${user.firstName} ${user.lastName}`.trim()
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function getRoleBadgeClassName(role: UserWithRelations["role"]) {
  if (role === "ADMIN") {
    return "bg-sky-500/10 text-sky-400"
  }

  if (role === "ORGANIZER") {
    return "bg-amber-500/10 text-amber-400"
  }

  return "bg-muted text-muted-foreground"
}

import { AdminRegistrationActions } from "@/components/admin/admin-registration-actions"
import type { RegistrationWithRelations } from "@/repositories/registration.repository"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AdminRegistrationsTableProps = {
  registrations: RegistrationWithRelations[]
}

export function AdminRegistrationsTable({
  registrations,
}: AdminRegistrationsTableProps) {
  if (registrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista inscrieri</CardTitle>
          <CardDescription>
            Inscrierile jucatorilor vor aparea aici dupa ce sunt create.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inscrieri inregistrate</CardTitle>
        <CardDescription>
          Lista inscrierilor asociate turneelor si jucatorilor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[104rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Jucator</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Turneu</th>
                  <th className="px-4 py-3 font-medium">Joc</th>
                  <th className="px-4 py-3 font-medium">Oras</th>
                  <th className="px-4 py-3 font-medium">Data turneului</th>
                  <th className="px-4 py-3 font-medium">Status inscriere</th>
                  <th className="px-4 py-3 font-medium">Data inscrierii</th>
                  <th className="px-4 py-3 font-medium">Plata</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatUserName(registration)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {registration.user.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {registration.tournament.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {registration.tournament.game.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {registration.tournament.city.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(registration.tournament.startsAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          getRegistrationStatusClassName(registration.status)
                        )}
                      >
                        {formatStatus(registration.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(registration.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPayment(registration)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminRegistrationActions
                        id={registration.id}
                        playerName={formatUserName(registration)}
                        status={registration.status}
                        tournamentName={registration.tournament.name}
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

function formatUserName(registration: RegistrationWithRelations) {
  return `${registration.user.firstName} ${registration.user.lastName}`
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

function formatPayment(registration: RegistrationWithRelations) {
  if (!registration.payment) {
    return "-"
  }

  return `${formatCurrency(registration.payment.amount)} / ${
    registration.payment.status
  }`
}

function formatCurrency(value: { toString(): string } | number | string) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(value))
}

function formatStatus(status: RegistrationWithRelations["status"]) {
  return status.replaceAll("_", " ")
}

function getRegistrationStatusClassName(
  status: RegistrationWithRelations["status"]
) {
  if (status === "PENDING_PAYMENT") {
    return "bg-amber-500/10 text-amber-400"
  }

  if (status === "CONFIRMED") {
    return "bg-emerald-500/10 text-emerald-400"
  }

  if (status === "CHECKED_IN") {
    return "bg-sky-500/10 text-sky-400"
  }

  return "bg-muted text-muted-foreground"
}

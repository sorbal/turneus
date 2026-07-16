import Link from "next/link"

import {
  AdminRegistrationForm,
  type RegistrationTournamentOption,
  type RegistrationUserOption,
} from "@/components/admin/admin-registration-form"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { Button } from "@/components/ui/button"
import { getTournaments } from "@/services/tournament.service"
import { getUsers } from "@/services/user.service"

export default async function AddAdminRegistrationPage() {
  const [tournaments, users] = await Promise.all([getTournaments(), getUsers()])
  const tournamentOptions: RegistrationTournamentOption[] = tournaments
    .filter((tournament) => tournament.status === "OPEN")
    .map((tournament) => ({
      id: tournament.id,
      label: formatTournamentLabel(tournament),
    }))
  const userOptions: RegistrationUserOption[] = users
    .filter((user) => user.isActive)
    .map((user) => ({
      id: user.id,
      label: formatUserLabel(user),
    }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Tournament Registrations"
          title="Adauga inscriere"
          description="Creeaza manual o inscriere pentru un utilizator activ la un turneu deschis."
        />

        <Button asChild variant="outline">
          <Link href="/admin/inscrieri">Inapoi la inscrieri</Link>
        </Button>
      </div>

      <AdminRegistrationForm
        tournaments={tournamentOptions}
        users={userOptions}
      />
    </div>
  )
}

function formatTournamentLabel(
  tournament: Awaited<ReturnType<typeof getTournaments>>[number]
) {
  return `${tournament.name} - ${tournament.game.name} - ${tournament.city.name} - ${formatDateTime(tournament.startsAt)}`
}

function formatUserLabel(user: Awaited<ReturnType<typeof getUsers>>[number]) {
  const fullName = `${user.firstName} ${user.lastName}`.trim()
  const displayName = fullName || user.username

  return `${displayName} - ${user.email}`
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

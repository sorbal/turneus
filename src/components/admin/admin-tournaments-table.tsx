import Link from "next/link"

import { AdminTournamentActions } from "@/components/admin/admin-tournament-actions"
import type { TournamentWithRelations } from "@/repositories/tournament.repository"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AdminTournamentsTableProps = {
  tournaments: TournamentWithRelations[]
}

export function AdminTournamentsTable({
  tournaments,
}: AdminTournamentsTableProps) {
  if (tournaments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista turnee</CardTitle>
          <CardDescription>
            Adauga primul turneu pentru a porni administrarea competitiilor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/turnee/adauga">Adauga turneu</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Turnee configurate</CardTitle>
        <CardDescription>
          Lista turneelor disponibile in platforma Turneus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[94rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nume</th>
                  <th className="px-4 py-3 font-medium">Joc</th>
                  <th className="px-4 py-3 font-medium">Sezon</th>
                  <th className="px-4 py-3 font-medium">Oras</th>
                  <th className="px-4 py-3 font-medium">Locatie</th>
                  <th className="px-4 py-3 font-medium">Organizator</th>
                  <th className="px-4 py-3 font-medium">Data si ora</th>
                  <th className="px-4 py-3 font-medium">Taxa</th>
                  <th className="px-4 py-3 font-medium">Max. jucatori</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tournaments.map((tournament) => (
                  <tr
                    key={tournament.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {tournament.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tournament.game.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tournament.season.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tournament.city.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tournament.venue?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tournament.organizer.publicName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(tournament.startsAt)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatCurrency(tournament.entryFee)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tournament.maxPlayers}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          getStatusClassName(tournament.status)
                        )}
                      >
                        {formatStatus(tournament.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminTournamentActions
                        id={tournament.id}
                        name={tournament.name}
                        status={tournament.status}
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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

function formatCurrency(value: TournamentWithRelations["entryFee"]) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(value))
}

function formatStatus(status: TournamentWithRelations["status"]) {
  return status.replaceAll("_", " ")
}

function getStatusClassName(status: TournamentWithRelations["status"]) {
  if (status === "DRAFT") {
    return "bg-muted text-muted-foreground"
  }

  if (status === "PUBLISHED" || status === "OPEN") {
    return "bg-emerald-500/10 text-emerald-400"
  }

  if (status === "FULL" || status === "IN_PROGRESS") {
    return "bg-sky-500/10 text-sky-400"
  }

  if (status === "COMPLETED") {
    return "bg-violet-500/10 text-violet-400"
  }

  return "bg-destructive/10 text-destructive"
}

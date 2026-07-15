import Link from "next/link"

import { AdminOrganizerActions } from "@/components/admin/admin-organizer-actions"
import type { OrganizerWithRelations } from "@/repositories/organizer.repository"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminOrganizersTableProps = {
  organizers: OrganizerWithRelations[]
}

export function AdminOrganizersTable({
  organizers,
}: AdminOrganizersTableProps) {
  if (organizers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista organizatori</CardTitle>
          <CardDescription>
            Adauga primul organizator pentru a pregati fluxul de turnee locale.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/organizatori/adauga">Adauga organizator</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizatori configurati</CardTitle>
        <CardDescription>
          Lista profilurilor de organizator disponibile in platforma Turneus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[64rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nume public</th>
                  <th className="px-4 py-3 font-medium">Utilizator</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Orase</th>
                  <th className="px-4 py-3 font-medium">Status aprobare</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {organizers.map((organizer) => (
                  <tr
                    key={organizer.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {organizer.publicName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatUserName(organizer.user)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {organizer.user.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatOrganizerCities(organizer)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          organizer.isApproved
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {organizer.isApproved ? "Aprobat" : "Neaprobat"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {organizer.rating.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminOrganizerActions
                        id={organizer.id}
                        isApproved={organizer.isApproved}
                        publicName={organizer.publicName}
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

function formatUserName(organizerUser: OrganizerWithRelations["user"]) {
  return `${organizerUser.firstName} ${organizerUser.lastName}`.trim()
}

function formatOrganizerCities(organizer: OrganizerWithRelations) {
  const cities = organizer.cities.map((organizerCity) => organizerCity.city.name)

  return cities.length > 0 ? cities.join(", ") : "-"
}

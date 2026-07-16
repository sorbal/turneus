import Link from "next/link"

import { AdminVenueActions } from "@/components/admin/admin-venue-actions"
import type { VenueWithRelations } from "@/repositories/venue.repository"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminVenuesTableProps = {
  venues: VenueWithRelations[]
}

export function AdminVenuesTable({ venues }: AdminVenuesTableProps) {
  if (venues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista locatii</CardTitle>
          <CardDescription>
            Adauga prima locatie pentru a pregati turneele locale.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/locatii/adauga">Adauga locatie</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Locatii configurate</CardTitle>
        <CardDescription>
          Lista locatiilor disponibile pentru turneele din platforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nume</th>
                  <th className="px-4 py-3 font-medium">Oras</th>
                  <th className="px-4 py-3 font-medium">Adresa</th>
                  <th className="px-4 py-3 font-medium">Turnee asociate</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {venues.map((venue) => (
                  <tr
                    key={venue.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {venue.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {venue.city.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {venue.address ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {venue._count.tournaments}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminVenueActions id={venue.id} name={venue.name} />
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

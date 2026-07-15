import type { City } from "@/generated/prisma/client"
import Link from "next/link"

import { AdminCityActions } from "@/components/admin/admin-city-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type AdminCitiesTableProps = {
  cities: City[]
}

export function AdminCitiesTable({ cities }: AdminCitiesTableProps) {
  if (cities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista orase</CardTitle>
          <CardDescription>
            Adauga primul oras pentru a pregati turneele si profilurile locale.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/orase/adauga">Adauga oras</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orase configurate</CardTitle>
        <CardDescription>
          Lista oraselor disponibile pentru modulele Turneus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nume</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Judet</th>
                  <th className="px-4 py-3 font-medium">Tara</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cities.map((city) => (
                  <tr
                    key={city.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {city.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {city.slug}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {city.county ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {city.country}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminCityActions id={city.id} name={city.name} />
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

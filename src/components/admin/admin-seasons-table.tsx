import Link from "next/link"

import { AdminSeasonActions } from "@/components/admin/admin-season-actions"
import type { SeasonWithRelations } from "@/repositories/season.repository"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AdminSeasonsTableProps = {
  seasons: SeasonWithRelations[]
}

export function AdminSeasonsTable({ seasons }: AdminSeasonsTableProps) {
  if (seasons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista sezoane</CardTitle>
          <CardDescription>
            Adauga primul sezon pentru a pregati turneele si statisticile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/sezoane/adauga">Adauga sezon</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sezoane configurate</CardTitle>
        <CardDescription>
          Lista sezoanelor disponibile pentru turnee si statistici.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[72rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nume</th>
                  <th className="px-4 py-3 font-medium">An</th>
                  <th className="px-4 py-3 font-medium">Data inceput</th>
                  <th className="px-4 py-3 font-medium">Data sfarsit</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Turnee</th>
                  <th className="px-4 py-3 font-medium">Statistici</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {seasons.map((season) => (
                  <tr
                    key={season.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {season.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {season.year}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(season.startsAt)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(season.endsAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          season.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {season.isActive ? "Activ" : "Inactiv"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {season._count.tournaments}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {season._count.stats}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminSeasonActions
                        id={season.id}
                        isActive={season.isActive}
                        name={season.name}
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

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
  }).format(value)
}

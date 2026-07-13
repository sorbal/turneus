import type { Game } from "@/generated/prisma/client"
import Link from "next/link"

import { AdminGameActions } from "@/components/admin/admin-game-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminGamesTableProps = {
  games: Game[]
}

export function AdminGamesTable({ games }: AdminGamesTableProps) {
  if (games.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nu exista jocuri</CardTitle>
          <CardDescription>
            Adauga primul joc pentru a incepe configurarea turneelor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/jocuri/adauga">Adauga joc</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jocuri configurate</CardTitle>
        <CardDescription>
          Lista jocurilor disponibile pentru modulele Turneus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nume</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Actiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {games.map((game) => (
                  <tr
                    key={game.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {game.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {game.slug}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          game.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {game.isActive ? "Activ" : "Inactiv"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminGameActions
                        id={game.id}
                        isActive={game.isActive}
                        name={game.name}
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

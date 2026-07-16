import type { TournamentStatus } from "@/generated/prisma/client"

const tournamentStatusLabels: Record<TournamentStatus, string> = {
  OPEN: "Deschis",
  FULL: "Complet",
  IN_PROGRESS: "In desfasurare",
  COMPLETED: "Finalizat",
  DRAFT: "Ciorna",
  PUBLISHED: "Publicat",
  CANCELLED: "Anulat",
}

export function getTournamentStatusLabel(status: TournamentStatus) {
  return tournamentStatusLabels[status]
}

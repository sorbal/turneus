import type {
  City,
  Game,
  OrganizerProfile,
  Prisma,
  Season,
  Tournament,
  TournamentStatus,
  User,
  Venue,
} from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type TournamentWithRelations = Tournament & {
  game: Game
  season: Season
  city: City
  venue: Venue | null
  organizer: OrganizerProfile & {
    user: Pick<User, "id" | "email" | "username" | "firstName" | "lastName">
  }
  _count: TournamentRelationCounts
}

export type PublicTournamentDetails = TournamentWithRelations & {
  activeRegistrationsCount: number
}

export type TournamentCreateData = {
  name: string
  slug: string
  description: string | null
  gameId: string
  seasonId: string
  cityId: string
  venueId: string | null
  organizerId: string
  startsAt: Date
  entryFee: Prisma.Decimal | number | string
  maxPlayers: number
  status?: TournamentStatus
  prizePoolAmount?: Prisma.Decimal | number | string
  organizerCommission?: Prisma.Decimal | number | string
  platformCommission?: Prisma.Decimal | number | string
}

export type TournamentUpdateData = {
  name?: string
  slug?: string
  description?: string | null
  gameId?: string
  seasonId?: string
  cityId?: string
  venueId?: string | null
  organizerId?: string
  startsAt?: Date
  entryFee?: Prisma.Decimal | number | string
  maxPlayers?: number
  status?: TournamentStatus
  prizePoolAmount?: Prisma.Decimal | number | string
  organizerCommission?: Prisma.Decimal | number | string
  platformCommission?: Prisma.Decimal | number | string
}

export type TournamentRelationCounts = {
  registrations: number
  stages: number
  payments: number
  sponsors: number
  comments: number
  ads: number
}

export async function findTournaments(): Promise<TournamentWithRelations[]> {
  return prisma.tournament.findMany({
    include: tournamentInclude,
    orderBy: [
      {
        startsAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}

export async function findTournamentById(
  id: string
): Promise<TournamentWithRelations | null> {
  return prisma.tournament.findUnique({
    where: {
      id,
    },
    include: tournamentInclude,
  })
}

export async function findTournamentBySlug(
  slug: string
): Promise<TournamentWithRelations | null> {
  return prisma.tournament.findUnique({
    where: {
      slug,
    },
    include: tournamentInclude,
  })
}

export async function findPublicTournamentDetailsBySlug(
  slug: string
): Promise<PublicTournamentDetails | null> {
  const tournament = await prisma.tournament.findUnique({
    where: {
      slug,
    },
    include: tournamentInclude,
  })

  if (!tournament) {
    return null
  }

  const activeRegistrationsCount = await prisma.registration.count({
    where: {
      tournamentId: tournament.id,
      status: {
        not: "CANCELLED",
      },
    },
  })

  return {
    ...tournament,
    activeRegistrationsCount,
  }
}

export async function findActiveSeason(): Promise<Season | null> {
  return prisma.season.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      year: "desc",
    },
  })
}

export async function createTournament(
  data: TournamentCreateData
): Promise<TournamentWithRelations> {
  return prisma.tournament.create({
    data,
    include: tournamentInclude,
  })
}

export async function updateTournament(
  id: string,
  data: TournamentUpdateData
): Promise<TournamentWithRelations> {
  return prisma.tournament.update({
    where: {
      id,
    },
    data,
    include: tournamentInclude,
  })
}

export async function countTournamentRelations(
  id: string
): Promise<TournamentRelationCounts> {
  const [registrations, stages, payments, sponsors, comments, ads] =
    await Promise.all([
      prisma.registration.count({
        where: {
          tournamentId: id,
        },
      }),
      prisma.tournamentStage.count({
        where: {
          tournamentId: id,
        },
      }),
      prisma.payment.count({
        where: {
          tournamentId: id,
        },
      }),
      prisma.tournamentSponsor.count({
        where: {
          tournamentId: id,
        },
      }),
      prisma.comment.count({
        where: {
          tournamentId: id,
        },
      }),
      prisma.advertisement.count({
        where: {
          tournamentId: id,
        },
      }),
    ])

  return {
    registrations,
    stages,
    payments,
    sponsors,
    comments,
    ads,
  }
}

export async function deleteTournament(
  id: string
): Promise<TournamentWithRelations> {
  return prisma.tournament.delete({
    where: {
      id,
    },
    include: tournamentInclude,
  })
}

const tournamentInclude = {
  game: true,
  season: true,
  city: true,
  venue: true,
  organizer: {
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  _count: {
    select: {
      registrations: true,
      stages: true,
      payments: true,
      sponsors: true,
      comments: true,
      ads: true,
    },
  },
} as const

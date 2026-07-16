import type { Season } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type SeasonWithRelations = Season & {
  _count: {
    tournaments: number
    stats: number
  }
}

export type SeasonCreateData = {
  name: string
  year: number
  startsAt: Date
  endsAt: Date
  isActive: boolean
}

export type SeasonUpdateData = {
  name?: string
  year?: number
  startsAt?: Date
  endsAt?: Date
}

export type SeasonRelationCounts = {
  tournaments: number
  stats: number
}

export async function findSeasons(): Promise<SeasonWithRelations[]> {
  return prisma.season.findMany({
    include: seasonInclude,
    orderBy: {
      year: "desc",
    },
  })
}

export async function findSeasonById(
  id: string
): Promise<SeasonWithRelations | null> {
  return prisma.season.findUnique({
    where: {
      id,
    },
    include: seasonInclude,
  })
}

export async function findSeasonByYear(year: number): Promise<Season | null> {
  return prisma.season.findUnique({
    where: {
      year,
    },
  })
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

export async function createSeason(
  data: SeasonCreateData
): Promise<SeasonWithRelations> {
  if (!data.isActive) {
    return prisma.season.create({
      data,
      include: seasonInclude,
    })
  }

  return prisma.$transaction(async (tx) => {
    await tx.season.updateMany({
      data: {
        isActive: false,
      },
    })

    return tx.season.create({
      data,
      include: seasonInclude,
    })
  })
}

export async function updateSeason(
  id: string,
  data: SeasonUpdateData
): Promise<SeasonWithRelations> {
  return prisma.season.update({
    where: {
      id,
    },
    data,
    include: seasonInclude,
  })
}

export async function activateSeason(
  id: string
): Promise<SeasonWithRelations> {
  return prisma.$transaction(async (tx) => {
    await tx.season.updateMany({
      where: {
        id: {
          not: id,
        },
      },
      data: {
        isActive: false,
      },
    })

    return tx.season.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      include: seasonInclude,
    })
  })
}

export async function deactivateOtherSeasons(id: string): Promise<number> {
  const result = await prisma.season.updateMany({
    where: {
      id: {
        not: id,
      },
    },
    data: {
      isActive: false,
    },
  })

  return result.count
}

export async function countSeasonRelations(
  id: string
): Promise<SeasonRelationCounts> {
  const [tournaments, stats] = await Promise.all([
    prisma.tournament.count({
      where: {
        seasonId: id,
      },
    }),
    prisma.playerSeasonStats.count({
      where: {
        seasonId: id,
      },
    }),
  ])

  return {
    tournaments,
    stats,
  }
}

export async function deleteSeason(id: string): Promise<Season> {
  return prisma.season.delete({
    where: {
      id,
    },
  })
}

const seasonInclude = {
  _count: {
    select: {
      tournaments: true,
      stats: true,
    },
  },
} as const

import type { Game } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type GameCreateData = {
  name: string
  slug: string
  description: string | null
  isActive: boolean
}

export type GameUpdateData = {
  name?: string
  slug?: string
  description?: string | null
  isActive?: boolean
}

export type GameRelationCounts = {
  tournaments: number
  rankings: number
  ads: number
}

export async function findGames(): Promise<Game[]> {
  return prisma.game.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function findGameById(id: string): Promise<Game | null> {
  return prisma.game.findUnique({
    where: {
      id,
    },
  })
}

export async function findGameBySlug(slug: string): Promise<Game | null> {
  return prisma.game.findUnique({
    where: {
      slug,
    },
  })
}

export async function createGame(data: GameCreateData): Promise<Game> {
  return prisma.game.create({
    data,
  })
}

export async function updateGame(
  id: string,
  data: GameUpdateData
): Promise<Game> {
  return prisma.game.update({
    where: {
      id,
    },
    data,
  })
}

export async function countGameRelations(
  id: string
): Promise<GameRelationCounts> {
  const [tournaments, rankings, ads] = await Promise.all([
    prisma.tournament.count({
      where: {
        gameId: id,
      },
    }),
    prisma.playerSeasonStats.count({
      where: {
        gameId: id,
      },
    }),
    prisma.advertisement.count({
      where: {
        gameId: id,
      },
    }),
  ])

  return {
    tournaments,
    rankings,
    ads,
  }
}

export async function deleteGame(id: string): Promise<Game> {
  return prisma.game.delete({
    where: {
      id,
    },
  })
}

import type { City } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type CityCreateData = {
  name: string
  slug: string
  county: string | null
  country: string
}

export type CityUpdateData = {
  name?: string
  slug?: string
  county?: string | null
  country?: string
}

export type CityRelationCounts = {
  users: number
  venues: number
  tournaments: number
  organizers: number
  advertisements: number
  playerSeasonStats: number
}

export async function findCities(): Promise<City[]> {
  return prisma.city.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function findCityById(id: string): Promise<City | null> {
  return prisma.city.findUnique({
    where: {
      id,
    },
  })
}

export async function findCityBySlug(slug: string): Promise<City | null> {
  return prisma.city.findUnique({
    where: {
      slug,
    },
  })
}

export async function createCity(data: CityCreateData): Promise<City> {
  return prisma.city.create({
    data,
  })
}

export async function updateCity(
  id: string,
  data: CityUpdateData
): Promise<City> {
  return prisma.city.update({
    where: {
      id,
    },
    data,
  })
}

export async function countCityRelations(
  id: string
): Promise<CityRelationCounts> {
  const [
    users,
    venues,
    tournaments,
    organizers,
    advertisements,
    playerSeasonStats,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        cityId: id,
      },
    }),
    prisma.venue.count({
      where: {
        cityId: id,
      },
    }),
    prisma.tournament.count({
      where: {
        cityId: id,
      },
    }),
    prisma.organizerCity.count({
      where: {
        cityId: id,
      },
    }),
    prisma.advertisement.count({
      where: {
        cityId: id,
      },
    }),
    prisma.playerSeasonStats.count({
      where: {
        cityId: id,
      },
    }),
  ])

  return {
    users,
    venues,
    tournaments,
    organizers,
    advertisements,
    playerSeasonStats,
  }
}

export async function deleteCity(id: string): Promise<City> {
  return prisma.city.delete({
    where: {
      id,
    },
  })
}

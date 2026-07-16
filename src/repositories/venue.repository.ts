import type { City, Venue } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type VenueWithRelations = Venue & {
  city: City
  _count: {
    tournaments: number
  }
}

export type VenueCreateData = {
  name: string
  address: string | null
  cityId: string
}

export type VenueUpdateData = {
  name?: string
  address?: string | null
  cityId?: string
}

export async function findVenues(): Promise<VenueWithRelations[]> {
  return prisma.venue.findMany({
    include: venueInclude,
    orderBy: [
      {
        city: {
          name: "asc",
        },
      },
      {
        name: "asc",
      },
    ],
  })
}

export async function findVenueById(
  id: string
): Promise<VenueWithRelations | null> {
  return prisma.venue.findUnique({
    where: {
      id,
    },
    include: venueInclude,
  })
}

export async function findVenueByNameAndCityId(
  name: string,
  cityId: string
): Promise<Venue | null> {
  return prisma.venue.findFirst({
    where: {
      name,
      cityId,
    },
  })
}

export async function findVenueCityById(id: string): Promise<City | null> {
  return prisma.city.findUnique({
    where: {
      id,
    },
  })
}

export async function createVenue(
  data: VenueCreateData
): Promise<VenueWithRelations> {
  return prisma.venue.create({
    data,
    include: venueInclude,
  })
}

export async function updateVenue(
  id: string,
  data: VenueUpdateData
): Promise<VenueWithRelations> {
  return prisma.venue.update({
    where: {
      id,
    },
    data,
    include: venueInclude,
  })
}

export async function countVenueTournaments(id: string): Promise<number> {
  return prisma.tournament.count({
    where: {
      venueId: id,
    },
  })
}

export async function deleteVenue(id: string): Promise<VenueWithRelations> {
  return prisma.venue.delete({
    where: {
      id,
    },
    include: venueInclude,
  })
}

const venueInclude = {
  city: true,
  _count: {
    select: {
      tournaments: true,
    },
  },
} as const

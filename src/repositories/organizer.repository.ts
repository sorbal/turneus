import type { City, OrganizerProfile, User, UserRole } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type OrganizerWithRelations = OrganizerProfile & {
  user: Pick<User, "id" | "email" | "username" | "firstName" | "lastName" | "role">
  cities: Array<{
    city: City
  }>
}

export type EligibleOrganizerUser = Pick<
  User,
  "id" | "email" | "username" | "firstName" | "lastName" | "role" | "isActive"
>

export type OrganizerCreateData = {
  userId: string
  publicName: string
  slug: string
  logoUrl: string | null
  description: string | null
  isApproved: boolean
  cityIds: string[]
}

export type OrganizerUpdateData = {
  publicName?: string
  slug?: string
  logoUrl?: string | null
  description?: string | null
  cityIds?: string[]
}

export async function findOrganizers(): Promise<OrganizerWithRelations[]> {
  return prisma.organizerProfile.findMany({
    include: organizerInclude,
    orderBy: {
      publicName: "asc",
    },
  })
}

export async function findOrganizerById(
  id: string
): Promise<OrganizerWithRelations | null> {
  return prisma.organizerProfile.findUnique({
    where: {
      id,
    },
    include: organizerInclude,
  })
}

export async function findOrganizerBySlug(
  slug: string
): Promise<OrganizerProfile | null> {
  return prisma.organizerProfile.findUnique({
    where: {
      slug,
    },
  })
}

export async function findOrganizerByUserId(
  userId: string
): Promise<OrganizerProfile | null> {
  return prisma.organizerProfile.findUnique({
    where: {
      userId,
    },
  })
}

export async function findEligibleOrganizerUsers(): Promise<
  EligibleOrganizerUser[]
> {
  return prisma.user.findMany({
    where: {
      role: "PLAYER",
      organizerProfile: null,
    },
    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
    },
  })
}

export async function findUserById(userId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
}

export async function countCitiesByIds(cityIds: string[]): Promise<number> {
  return prisma.city.count({
    where: {
      id: {
        in: cityIds,
      },
    },
  })
}

export async function createOrganizer(
  data: OrganizerCreateData
): Promise<OrganizerWithRelations> {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: data.userId,
      },
      data: {
        role: "ORGANIZER",
      },
    })

    const organizer = await tx.organizerProfile.create({
      data: {
        userId: data.userId,
        publicName: data.publicName,
        slug: data.slug,
        logoUrl: data.logoUrl,
        description: data.description,
        isApproved: data.isApproved,
        cities: {
          create: data.cityIds.map((cityId) => ({
            cityId,
          })),
        },
      },
      include: organizerInclude,
    })

    return organizer
  })
}

export async function updateOrganizer(
  id: string,
  data: OrganizerUpdateData
): Promise<OrganizerWithRelations> {
  return prisma.$transaction(async (tx) => {
    if (data.cityIds !== undefined) {
      await tx.organizerCity.deleteMany({
        where: {
          organizerId: id,
        },
      })

      if (data.cityIds.length > 0) {
        await tx.organizerCity.createMany({
          data: data.cityIds.map((cityId) => ({
            organizerId: id,
            cityId,
          })),
        })
      }
    }

    return tx.organizerProfile.update({
      where: {
        id,
      },
      data: {
        publicName: data.publicName,
        slug: data.slug,
        logoUrl: data.logoUrl,
        description: data.description,
      },
      include: organizerInclude,
    })
  })
}

export async function setOrganizerApproved(
  id: string,
  isApproved: boolean
): Promise<OrganizerWithRelations> {
  return prisma.organizerProfile.update({
    where: {
      id,
    },
    data: {
      isApproved,
    },
    include: organizerInclude,
  })
}

export async function countOrganizerTournaments(id: string): Promise<number> {
  return prisma.tournament.count({
    where: {
      organizerId: id,
    },
  })
}

export async function deleteOrganizerProfile(
  id: string,
  userId: string
): Promise<OrganizerProfile> {
  return prisma.$transaction(async (tx) => {
    await tx.organizerCity.deleteMany({
      where: {
        organizerId: id,
      },
    })

    const organizer = await tx.organizerProfile.delete({
      where: {
        id,
      },
    })

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        role: "PLAYER",
      },
    })

    return organizer
  })
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<User> {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  })
}

const organizerInclude = {
  user: {
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  },
  cities: {
    include: {
      city: true,
    },
    orderBy: {
      city: {
        name: "asc",
      },
    },
  },
} as const

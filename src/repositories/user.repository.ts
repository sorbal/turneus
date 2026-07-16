import type { City, User, UserRole } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type UserWithRelations = Omit<User, "passwordHash"> & {
  city: City | null
  organizerProfile: {
    id: string
  } | null
}

export type UserUpdateData = {
  firstName?: string
  lastName?: string
  email?: string
  username?: string
  phone?: string | null
  cityId?: string | null
  birthDate?: Date | null
  avatarUrl?: string | null
  bio?: string | null
}

export async function findUsers(search?: string): Promise<UserWithRelations[]> {
  const normalizedSearch = search?.trim()

  return prisma.user.findMany({
    where: normalizedSearch
      ? {
          OR: [
            {
              firstName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    include: userInclude,
    omit: {
      passwordHash: true,
    },
    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  })
}

export async function countActiveUsers(): Promise<number> {
  return prisma.user.count({
    where: {
      isActive: true,
    },
  })
}

export async function findUserById(
  id: string
): Promise<UserWithRelations | null> {
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: userInclude,
    omit: {
      passwordHash: true,
    },
  })
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function findUserByUsername(username: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      username,
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

export async function updateUser(
  id: string,
  data: UserUpdateData
): Promise<UserWithRelations> {
  return prisma.user.update({
    where: {
      id,
    },
    data,
    include: userInclude,
    omit: {
      passwordHash: true,
    },
  })
}

export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<UserWithRelations> {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
    include: userInclude,
    omit: {
      passwordHash: true,
    },
  })
}

export async function updateUserActiveStatus(
  id: string,
  isActive: boolean
): Promise<UserWithRelations> {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
    include: userInclude,
    omit: {
      passwordHash: true,
    },
  })
}

export async function updateUserPasswordHash(
  id: string,
  passwordHash: string
): Promise<UserWithRelations> {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      passwordHash,
    },
    include: userInclude,
    omit: {
      passwordHash: true,
    },
  })
}

const userInclude = {
  city: true,
  organizerProfile: {
    select: {
      id: true,
    },
  },
} as const

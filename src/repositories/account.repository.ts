import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type AccountRegistrationRecord = Prisma.RegistrationGetPayload<{
  select: typeof accountRegistrationSelect
}>

export async function findAccountRegistrationsByUserId(
  userId: string
): Promise<AccountRegistrationRecord[]> {
  return prisma.registration.findMany({
    where: {
      userId,
    },
    select: accountRegistrationSelect,
    orderBy: [
      {
        tournament: {
          startsAt: "asc",
        },
      },
      {
        createdAt: "desc",
      },
      {
        id: "asc",
      },
    ],
  })
}

const accountRegistrationSelect = {
  id: true,
  status: true,
  createdAt: true,
  checkedInAt: true,
  tournament: {
    select: {
      name: true,
      slug: true,
      startsAt: true,
      status: true,
      entryFee: true,
      game: {
        select: {
          name: true,
        },
      },
      city: {
        select: {
          name: true,
        },
      },
    },
  },
  payment: {
    select: {
      id: true,
      amount: true,
      status: true,
      provider: true,
    },
  },
} as const

import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type AccountRegistrationRecord = Prisma.RegistrationGetPayload<{
  select: typeof accountRegistrationSelect
}>

export type AccountTicketRecord = Prisma.RegistrationGetPayload<{
  select: typeof accountTicketSelect
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

export async function findAccountTicketByRegistrationIdAndUserId(
  registrationId: string,
  userId: string
): Promise<AccountTicketRecord | null> {
  return prisma.registration.findFirst({
    where: {
      id: registrationId,
      userId,
    },
    select: accountTicketSelect,
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
  refundRequest: {
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const

const accountTicketSelect = {
  id: true,
  status: true,
  createdAt: true,
  checkedInAt: true,
  user: {
    select: {
      firstName: true,
      lastName: true,
      username: true,
    },
  },
  tournament: {
    select: {
      name: true,
      slug: true,
      startsAt: true,
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
      venue: {
        select: {
          name: true,
          address: true,
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

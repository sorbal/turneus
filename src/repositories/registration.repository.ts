import type {
  City,
  Game,
  OrganizerProfile,
  Payment,
  Registration,
  RegistrationStatus,
  Season,
  Tournament,
  User,
  Venue,
} from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type RegistrationWithRelations = Registration & {
  tournament: Tournament & {
    game: Game
    season: Season
    city: City
    venue: Venue | null
    organizer: OrganizerProfile
  }
  user: Pick<
    User,
    | "id"
    | "email"
    | "username"
    | "firstName"
    | "lastName"
    | "role"
    | "isActive"
  >
  payment: Payment | null
}

export type RegistrationCreateData = {
  tournamentId: string
  userId: string
  status?: RegistrationStatus
  checkedInAt?: Date | null
  finalPosition?: number | null
  officialPoints?: number
}

const activeRegistrationStatuses: RegistrationStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CHECKED_IN",
]

export async function findRegistrations(): Promise<
  RegistrationWithRelations[]
> {
  return prisma.registration.findMany({
    include: registrationInclude,
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function findRegistrationById(
  id: string
): Promise<RegistrationWithRelations | null> {
  return prisma.registration.findUnique({
    where: {
      id,
    },
    include: registrationInclude,
  })
}

export async function findRegistrationByTournamentAndUser(
  tournamentId: string,
  userId: string
): Promise<RegistrationWithRelations | null> {
  return prisma.registration.findUnique({
    where: {
      tournamentId_userId: {
        tournamentId,
        userId,
      },
    },
    include: registrationInclude,
  })
}

export async function findRegistrationsByTournament(
  tournamentId: string
): Promise<RegistrationWithRelations[]> {
  return prisma.registration.findMany({
    where: {
      tournamentId,
    },
    include: registrationInclude,
    orderBy: [
      {
        createdAt: "asc",
      },
      {
        user: {
          firstName: "asc",
        },
      },
      {
        user: {
          lastName: "asc",
        },
      },
    ],
  })
}

export async function createRegistration(
  data: RegistrationCreateData
): Promise<RegistrationWithRelations> {
  return prisma.registration.create({
    data,
    include: registrationInclude,
  })
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus
): Promise<RegistrationWithRelations> {
  return prisma.registration.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: registrationInclude,
  })
}

export async function updateRegistrationCheckedInAt(
  id: string,
  checkedInAt: Date | null
): Promise<RegistrationWithRelations> {
  return prisma.registration.update({
    where: {
      id,
    },
    data: {
      checkedInAt,
    },
    include: registrationInclude,
  })
}

export async function countActiveRegistrationsByTournament(
  tournamentId: string
): Promise<number> {
  return prisma.registration.count({
    where: {
      tournamentId,
      status: {
        in: activeRegistrationStatuses,
      },
    },
  })
}

export async function cancelRegistration(
  id: string
): Promise<RegistrationWithRelations> {
  return updateRegistrationStatus(id, "CANCELLED")
}

const registrationInclude = {
  tournament: {
    include: {
      game: true,
      season: true,
      city: true,
      venue: true,
      organizer: true,
    },
  },
  user: {
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
    },
  },
  payment: true,
} as const

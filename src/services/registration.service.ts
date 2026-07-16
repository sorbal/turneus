import type { RegistrationStatus } from "@/generated/prisma/client"
import {
  cancelRegistration,
  countActiveRegistrationsByTournament,
  createRegistration,
  findRegistrationById,
  findRegistrationByTournamentAndUser,
  findRegistrations,
  updateRegistrationCheckedInAt,
  updateRegistrationStatus,
} from "@/repositories/registration.repository"
import { findTournamentById } from "@/repositories/tournament.repository"
import { findUserById } from "@/repositories/user.repository"

export type CreateRegistrationInput = {
  tournamentId: string
  userId: string
}

export class RegistrationServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RegistrationServiceError"
  }
}

export async function getRegistrations() {
  return findRegistrations()
}

export async function getRegistrationById(id: string) {
  assertId(id, "ID-ul inscrierii este obligatoriu.")
  return findRegistrationById(id)
}

export async function createRegistrationRecord(
  input: CreateRegistrationInput
) {
  const tournamentId = normalizeRequiredText(
    input.tournamentId,
    "Turneul este obligatoriu."
  )
  const userId = normalizeRequiredText(
    input.userId,
    "Utilizatorul este obligatoriu."
  )

  const [tournament, user, existingRegistration] = await Promise.all([
    findTournamentById(tournamentId),
    findUserById(userId),
    findRegistrationByTournamentAndUser(tournamentId, userId),
  ])

  if (!user) {
    throw new RegistrationServiceError("Utilizatorul nu exista.")
  }

  if (!user.isActive) {
    throw new RegistrationServiceError("Utilizatorul este inactiv.")
  }

  if (!tournament) {
    throw new RegistrationServiceError("Turneul nu exista.")
  }

  assertTournamentIsOpen(tournament.status)
  assertTournamentHasNotStarted(tournament.startsAt)

  if (existingRegistration) {
    throw new RegistrationServiceError(
      "Utilizatorul este deja inscris la acest turneu."
    )
  }

  await assertTournamentHasCapacity(tournamentId, tournament.maxPlayers)

  return createRegistration({
    tournamentId,
    userId,
    status: getInitialRegistrationStatus(tournament.entryFee),
  })
}

export async function checkInRegistration(id: string) {
  assertId(id, "ID-ul inscrierii este obligatoriu.")

  const registration = await findRegistrationById(id)

  if (!registration) {
    throw new RegistrationServiceError("Inscrierea nu exista.")
  }

  if (registration.status !== "CONFIRMED") {
    throw new RegistrationServiceError(
      "Check-in-ul este permis doar pentru inscrieri confirmate."
    )
  }

  await updateRegistrationCheckedInAt(id, new Date())

  return updateRegistrationStatus(id, "CHECKED_IN")
}

export async function cancelRegistrationRecord(id: string) {
  assertId(id, "ID-ul inscrierii este obligatoriu.")

  const registration = await findRegistrationById(id)

  if (!registration) {
    throw new RegistrationServiceError("Inscrierea nu exista.")
  }

  if (registration.status === "CANCELLED") {
    throw new RegistrationServiceError("Inscrierea este deja anulata.")
  }

  return cancelRegistration(id)
}

function getInitialRegistrationStatus(
  entryFee: { toString(): string } | number | string
): RegistrationStatus {
  const entryFeeValue = Number(entryFee.toString())

  if (entryFeeValue === 0) {
    return "CONFIRMED"
  }

  return "PENDING_PAYMENT"
}

async function assertTournamentHasCapacity(
  tournamentId: string,
  maxPlayers: number
) {
  const activeRegistrations =
    await countActiveRegistrationsByTournament(tournamentId)

  if (activeRegistrations >= maxPlayers) {
    throw new RegistrationServiceError(
      "Turneul nu mai are locuri disponibile."
    )
  }
}

function assertTournamentIsOpen(status: string) {
  if (status !== "OPEN") {
    throw new RegistrationServiceError(
      "Inscrierile sunt permise doar pentru turnee OPEN."
    )
  }
}

function assertTournamentHasNotStarted(startsAt: Date) {
  if (startsAt.getTime() <= Date.now()) {
    throw new RegistrationServiceError("Turneul a inceput deja.")
  }
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new RegistrationServiceError(message)
  }

  return normalizedValue
}

function assertId(id: string, message: string) {
  if (!id.trim()) {
    throw new RegistrationServiceError(message)
  }
}

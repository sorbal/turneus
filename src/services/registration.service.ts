import type { RegistrationStatus, UserRole } from "@/generated/prisma/client"
import {
  cancelRegistration,
  createOrReactivateRegistrationWithCapacity,
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
  mode?: "admin" | "public"
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

export async function getRegistrationByTournamentAndUser(
  tournamentId: string,
  userId: string
) {
  const normalizedTournamentId = normalizeRequiredText(
    tournamentId,
    "Turneul este obligatoriu."
  )
  const normalizedUserId = normalizeRequiredText(
    userId,
    "Utilizatorul este obligatoriu."
  )

  return findRegistrationByTournamentAndUser(
    normalizedTournamentId,
    normalizedUserId
  )
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

  const [tournament, user] = await Promise.all([
    findTournamentById(tournamentId),
    findUserById(userId),
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
  assertRegistrationActorIsEligible(input.mode ?? "admin", user.role)
  assertUserIsNotTournamentOrganizer(
    input.mode ?? "admin",
    user.id,
    tournament.organizer.user.id
  )

  const initialStatus = getInitialRegistrationStatus(tournament.entryFee)

  const result = await createOrReactivateRegistrationWithCapacity(
    {
      tournamentId,
      userId,
      status: initialStatus,
    },
    tournament.maxPlayers
  )

  return handleCapacityWriteResult(result)
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

function handleCapacityWriteResult(
  result: Awaited<ReturnType<typeof createOrReactivateRegistrationWithCapacity>>
) {
  if (result.outcome === "duplicate") {
    throw new RegistrationServiceError(
      "Utilizatorul este deja inscris la acest turneu."
    )
  }

  if (result.outcome === "full") {
    throw new RegistrationServiceError(
      "Turneul nu mai are locuri disponibile."
    )
  }

  if (result.outcome === "capacity_conflict") {
    throw new RegistrationServiceError(
      "Inscrierea nu a putut fi procesata din cauza numarului mare de cereri simultane. Te rugam sa incerci din nou."
    )
  }

  return result.registration
}

function assertRegistrationActorIsEligible(
  mode: "admin" | "public",
  role: UserRole
) {
  if (mode === "admin") {
    return
  }

  if (role === "ADMIN") {
    throw new RegistrationServiceError(
      "Administratorii nu se pot inscrie prin fluxul public."
    )
  }

  if (role !== "PLAYER" && role !== "ORGANIZER") {
    throw new RegistrationServiceError(
      "Doar utilizatorii PLAYER sau ORGANIZER se pot inscrie public."
    )
  }
}

function assertUserIsNotTournamentOrganizer(
  mode: "admin" | "public",
  userId: string,
  organizerUserId: string
) {
  if (mode === "admin") {
    return
  }

  if (userId === organizerUserId) {
    throw new RegistrationServiceError(
      "Organizatorul nu se poate inscrie la propriul turneu."
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

import type { TournamentStatus } from "@/generated/prisma/client"
import { normalizeSlug } from "@/lib/slug"
import { findCityById } from "@/repositories/city.repository"
import { findGameById } from "@/repositories/game.repository"
import { findOrganizerById } from "@/repositories/organizer.repository"
import {
  countTournamentRelations,
  createTournament,
  deleteTournament,
  findActiveSeason,
  findPublicTournamentDetailsBySlug,
  findPublicTournaments,
  findTournamentById,
  findTournamentBySlug,
  findTournaments,
  updateTournament,
  type TournamentRelationCounts,
  type TournamentUpdateData,
} from "@/repositories/tournament.repository"
import { findVenueById } from "@/repositories/venue.repository"

export type CreateTournamentInput = {
  name: string
  description?: string | null
  gameId: string
  cityId: string
  venueId?: string | null
  organizerId: string
  startsAt: Date | string
  entryFee: number | string
  maxPlayers: number | string
}

export type UpdateTournamentInput = {
  name?: string
  description?: string | null
  gameId?: string
  cityId?: string
  venueId?: string | null
  organizerId?: string
  startsAt?: Date | string
  entryFee?: number | string
  maxPlayers?: number | string
}

export type TournamentLifecycleAction = "open" | "start" | "complete"

const publicTournamentStatuses = [
  "OPEN",
  "FULL",
  "IN_PROGRESS",
  "COMPLETED",
] as const

export class TournamentServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TournamentServiceError"
  }
}

export async function getTournaments() {
  return findTournaments()
}

export async function getPublicTournaments() {
  return findPublicTournaments()
}

export async function getTournamentById(id: string) {
  assertId(id)
  return findTournamentById(id)
}

export async function getPublicTournamentBySlug(slug: string) {
  const normalizedSlug = normalizeSlug(slug)

  if (!normalizedSlug) {
    return null
  }

  const tournament = await findPublicTournamentDetailsBySlug(normalizedSlug)

  if (!tournament) {
    return null
  }

  if (!isPublicTournamentStatus(tournament.status)) {
    return null
  }

  return tournament
}

export async function createTournamentRecord(input: CreateTournamentInput) {
  const name = normalizeRequiredText(
    input.name,
    "Numele turneului este obligatoriu."
  )
  const slug = normalizeTournamentSlug(name)
  const description = normalizeOptionalText(input.description)
  const gameId = normalizeRequiredText(
    input.gameId,
    "Jocul turneului este obligatoriu."
  )
  const cityId = normalizeRequiredText(
    input.cityId,
    "Orasul turneului este obligatoriu."
  )
  const venueId = normalizeOptionalText(input.venueId)
  const organizerId = normalizeRequiredText(
    input.organizerId,
    "Organizatorul turneului este obligatoriu."
  )
  const startsAt = normalizeStartsAt(input.startsAt, true)
  const entryFee = normalizeEntryFee(input.entryFee)
  const maxPlayers = normalizeMaxPlayers(input.maxPlayers)
  const activeSeason = await findActiveSeason()

  if (!activeSeason) {
    throw new TournamentServiceError("Nu exista un sezon activ.")
  }

  await assertUniqueSlug(slug)
  await assertGameIsEligible(gameId)
  await assertCityExists(cityId)
  await assertVenueIsEligible(venueId, cityId)
  await assertOrganizerIsEligible(organizerId, cityId)

  return createTournament({
    name,
    slug,
    description,
    gameId,
    seasonId: activeSeason.id,
    cityId,
    venueId,
    organizerId,
    startsAt,
    entryFee,
    maxPlayers,
    status: "DRAFT",
    prizePoolAmount: 0,
    organizerCommission: 0,
    platformCommission: 0,
  })
}

export async function updateTournamentRecord(
  id: string,
  input: UpdateTournamentInput
) {
  assertId(id)

  const existingTournament = await findTournamentById(id)

  if (!existingTournament) {
    throw new TournamentServiceError("Turneul nu exista.")
  }

  const data: TournamentUpdateData = {}

  if (input.name !== undefined) {
    data.name = normalizeRequiredText(
      input.name,
      "Numele turneului este obligatoriu."
    )
    data.slug = normalizeTournamentSlug(data.name)
  }

  if (input.description !== undefined) {
    data.description = normalizeOptionalText(input.description)
  }

  if (input.gameId !== undefined) {
    data.gameId = normalizeRequiredText(
      input.gameId,
      "Jocul turneului este obligatoriu."
    )
    await assertGameIsEligible(data.gameId)
  }

  if (input.cityId !== undefined) {
    data.cityId = normalizeRequiredText(
      input.cityId,
      "Orasul turneului este obligatoriu."
    )
    await assertCityExists(data.cityId)
  }

  if (input.venueId !== undefined) {
    data.venueId = normalizeOptionalText(input.venueId)
  }

  if (input.organizerId !== undefined) {
    data.organizerId = normalizeRequiredText(
      input.organizerId,
      "Organizatorul turneului este obligatoriu."
    )
  }

  if (input.startsAt !== undefined) {
    data.startsAt = normalizeStartsAt(input.startsAt, false)
  }

  if (input.entryFee !== undefined) {
    data.entryFee = normalizeEntryFee(input.entryFee)
  }

  if (input.maxPlayers !== undefined) {
    data.maxPlayers = normalizeMaxPlayers(input.maxPlayers)
  }

  if (data.slug) {
    await assertUniqueSlug(data.slug, id)
  }

  const nextCityId = data.cityId ?? existingTournament.cityId
  const nextVenueId =
    data.venueId !== undefined ? data.venueId : existingTournament.venueId
  const nextOrganizerId = data.organizerId ?? existingTournament.organizerId

  await assertVenueIsEligible(nextVenueId, nextCityId)
  await assertOrganizerIsEligible(nextOrganizerId, nextCityId)

  return updateTournament(id, data)
}

export async function updateTournamentLifecycleStatus(
  id: string,
  action: TournamentLifecycleAction
) {
  assertId(id)

  const existingTournament = await findTournamentById(id)

  if (!existingTournament) {
    throw new TournamentServiceError("Turneul nu exista.")
  }

  const nextStatus = getNextTournamentStatus(existingTournament.status, action)

  return updateTournament(id, {
    status: nextStatus,
  })
}

export async function deleteTournamentRecord(id: string) {
  assertId(id)

  const existingTournament = await findTournamentById(id)

  if (!existingTournament) {
    throw new TournamentServiceError("Turneul nu exista.")
  }

  if (existingTournament.status !== "DRAFT") {
    throw new TournamentServiceError(
      "Doar turneele cu status DRAFT pot fi sterse."
    )
  }

  const relationCounts = await countTournamentRelations(id)

  assertTournamentCanBeDeleted(relationCounts)

  return deleteTournament(id)
}

function getNextTournamentStatus(
  currentStatus: TournamentUpdateData["status"],
  action: TournamentLifecycleAction
) {
  if (currentStatus === "COMPLETED") {
    throw new TournamentServiceError(
      "Turneele finalizate nu mai pot fi modificate prin aceste actiuni."
    )
  }

  if (action === "open" && currentStatus === "DRAFT") {
    return "OPEN"
  }

  if (
    action === "start" &&
    (currentStatus === "OPEN" || currentStatus === "FULL")
  ) {
    return "IN_PROGRESS"
  }

  if (action === "complete" && currentStatus === "IN_PROGRESS") {
    return "COMPLETED"
  }

  throw new TournamentServiceError(
    "Tranzitia de status nu este permisa pentru acest turneu."
  )
}

function isPublicTournamentStatus(status: TournamentStatus) {
  return publicTournamentStatuses.some(
    (publicStatus) => publicStatus === status
  )
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new TournamentServiceError(message)
  }

  return normalizedValue
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}

function normalizeTournamentSlug(value: string) {
  const slug = normalizeSlug(value)

  if (!slug) {
    throw new TournamentServiceError("Slug-ul turneului este obligatoriu.")
  }

  return slug
}

function normalizeStartsAt(value: Date | string, mustBeFuture: boolean) {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new TournamentServiceError("Data turneului este invalida.")
  }

  if (mustBeFuture && date.getTime() <= Date.now()) {
    throw new TournamentServiceError(
      "Data turneului trebuie sa fie in viitor."
    )
  }

  return date
}

function normalizeEntryFee(value: number | string) {
  const entryFee = normalizeNumber(value, "Taxa de participare este invalida.")

  if (entryFee < 0) {
    throw new TournamentServiceError(
      "Taxa de participare nu poate fi negativa."
    )
  }

  return entryFee
}

function normalizeMaxPlayers(value: number | string) {
  const maxPlayers = normalizeNumber(
    value,
    "Numarul maxim de jucatori este invalid."
  )

  if (!Number.isInteger(maxPlayers)) {
    throw new TournamentServiceError(
      "Numarul maxim de jucatori trebuie sa fie intreg."
    )
  }

  if (maxPlayers < 2) {
    throw new TournamentServiceError(
      "Numarul maxim de jucatori trebuie sa fie minimum 2."
    )
  }

  return maxPlayers
}

function normalizeNumber(value: number | string, message: string) {
  const normalizedValue = typeof value === "string" ? value.trim() : value

  if (normalizedValue === "") {
    throw new TournamentServiceError(message)
  }

  const numberValue = Number(normalizedValue)

  if (!Number.isFinite(numberValue)) {
    throw new TournamentServiceError(message)
  }

  return numberValue
}

async function assertUniqueSlug(slug: string, currentTournamentId?: string) {
  const existingTournament = await findTournamentBySlug(slug)

  if (existingTournament && existingTournament.id !== currentTournamentId) {
    throw new TournamentServiceError(
      "Exista deja un turneu cu acest slug."
    )
  }
}

async function assertGameIsEligible(gameId: string) {
  const game = await findGameById(gameId)

  if (!game) {
    throw new TournamentServiceError("Jocul nu exista.")
  }

  if (!game.isActive) {
    throw new TournamentServiceError(
      "Doar jocurile active pot fi folosite pentru turnee."
    )
  }
}

async function assertCityExists(cityId: string) {
  const city = await findCityById(cityId)

  if (!city) {
    throw new TournamentServiceError("Orasul nu exista.")
  }
}

async function assertVenueIsEligible(
  venueId: string | null,
  cityId: string
) {
  if (!venueId) {
    return
  }

  const venue = await findVenueById(venueId)

  if (!venue) {
    throw new TournamentServiceError("Locatia nu exista.")
  }

  if (venue.cityId !== cityId) {
    throw new TournamentServiceError(
      "Locatia selectata nu apartine orasului selectat."
    )
  }
}

async function assertOrganizerIsEligible(organizerId: string, cityId: string) {
  const organizer = await findOrganizerById(organizerId)

  if (!organizer) {
    throw new TournamentServiceError("Organizatorul nu exista.")
  }

  if (!organizer.isApproved) {
    throw new TournamentServiceError(
      "Doar organizatorii aprobati pot crea turnee."
    )
  }

  const isAssociatedWithCity = organizer.cities.some(
    ({ city }) => city.id === cityId
  )

  if (!isAssociatedWithCity) {
    throw new TournamentServiceError(
      "Organizatorul nu este asociat orasului selectat."
    )
  }
}

function assertTournamentCanBeDeleted(
  relationCounts: TournamentRelationCounts
) {
  const relatedRecords =
    relationCounts.registrations +
    relationCounts.stages +
    relationCounts.payments +
    relationCounts.sponsors +
    relationCounts.comments +
    relationCounts.ads

  if (relatedRecords > 0) {
    throw new TournamentServiceError(
      "Turneul nu poate fi sters deoarece are relatii asociate."
    )
  }
}

function assertId(id: string) {
  if (!id.trim()) {
    throw new TournamentServiceError("ID-ul turneului este obligatoriu.")
  }
}

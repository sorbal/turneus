import {
  activateSeason,
  countSeasonRelations,
  createSeason,
  deleteSeason,
  findSeasonById,
  findSeasonByYear,
  findSeasons,
  updateSeason,
  type SeasonRelationCounts,
  type SeasonUpdateData,
} from "@/repositories/season.repository"

export type CreateSeasonInput = {
  name: string
  year: number | string
  startsAt: Date | string
  endsAt: Date | string
  isActive?: boolean
}

export type UpdateSeasonInput = {
  name?: string
  year?: number | string
  startsAt?: Date | string
  endsAt?: Date | string
}

export class SeasonServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SeasonServiceError"
  }
}

export async function getSeasons() {
  return findSeasons()
}

export async function getSeasonById(id: string) {
  assertId(id)
  return findSeasonById(id)
}

export async function createSeasonRecord(input: CreateSeasonInput) {
  const name = normalizeRequiredText(
    input.name,
    "Numele sezonului este obligatoriu."
  )
  const year = normalizeYear(input.year)
  const startsAt = normalizeDate(
    input.startsAt,
    "Data de inceput a sezonului este invalida."
  )
  const endsAt = normalizeDate(
    input.endsAt,
    "Data de final a sezonului este invalida."
  )

  assertValidSeasonInterval(startsAt, endsAt)
  await assertUniqueYear(year)

  return createSeason({
    name,
    year,
    startsAt,
    endsAt,
    isActive: input.isActive ?? false,
  })
}

export async function updateSeasonRecord(
  id: string,
  input: UpdateSeasonInput
) {
  assertId(id)

  const existingSeason = await findSeasonById(id)

  if (!existingSeason) {
    throw new SeasonServiceError("Sezonul nu exista.")
  }

  const data: SeasonUpdateData = {}

  if (input.name !== undefined) {
    data.name = normalizeRequiredText(
      input.name,
      "Numele sezonului este obligatoriu."
    )
  }

  if (input.year !== undefined) {
    data.year = normalizeYear(input.year)
    await assertUniqueYear(data.year, id)
  }

  if (input.startsAt !== undefined) {
    data.startsAt = normalizeDate(
      input.startsAt,
      "Data de inceput a sezonului este invalida."
    )
  }

  if (input.endsAt !== undefined) {
    data.endsAt = normalizeDate(
      input.endsAt,
      "Data de final a sezonului este invalida."
    )
  }

  const nextStartsAt = data.startsAt ?? existingSeason.startsAt
  const nextEndsAt = data.endsAt ?? existingSeason.endsAt

  assertValidSeasonInterval(nextStartsAt, nextEndsAt)

  return updateSeason(id, data)
}

export async function activateSeasonRecord(id: string) {
  assertId(id)

  const existingSeason = await findSeasonById(id)

  if (!existingSeason) {
    throw new SeasonServiceError("Sezonul nu exista.")
  }

  return activateSeason(id)
}

export async function deleteSeasonRecord(id: string) {
  assertId(id)

  const existingSeason = await findSeasonById(id)

  if (!existingSeason) {
    throw new SeasonServiceError("Sezonul nu exista.")
  }

  if (existingSeason.isActive) {
    throw new SeasonServiceError("Sezonul activ nu poate fi sters.")
  }

  const relationCounts = await countSeasonRelations(id)

  assertSeasonCanBeDeleted(relationCounts)

  return deleteSeason(id)
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new SeasonServiceError(message)
  }

  return normalizedValue
}

function normalizeYear(value: number | string) {
  const normalizedValue = typeof value === "string" ? value.trim() : value

  if (normalizedValue === "") {
    throw new SeasonServiceError("Anul sezonului este obligatoriu.")
  }

  const year = Number(normalizedValue)

  if (!Number.isInteger(year)) {
    throw new SeasonServiceError("Anul sezonului este invalid.")
  }

  return year
}

function normalizeDate(value: Date | string, message: string) {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new SeasonServiceError(message)
  }

  return date
}

function assertValidSeasonInterval(startsAt: Date, endsAt: Date) {
  if (startsAt.getTime() >= endsAt.getTime()) {
    throw new SeasonServiceError(
      "Data de inceput a sezonului trebuie sa fie mai mica decat data de final."
    )
  }
}

async function assertUniqueYear(year: number, currentSeasonId?: string) {
  const existingSeason = await findSeasonByYear(year)

  if (existingSeason && existingSeason.id !== currentSeasonId) {
    throw new SeasonServiceError("Exista deja un sezon cu acest an.")
  }
}

function assertSeasonCanBeDeleted(relationCounts: SeasonRelationCounts) {
  const relatedRecords = relationCounts.tournaments + relationCounts.stats

  if (relatedRecords > 0) {
    throw new SeasonServiceError(
      "Sezonul nu poate fi sters deoarece are turnee sau statistici asociate."
    )
  }
}

function assertId(id: string) {
  if (!id.trim()) {
    throw new SeasonServiceError("ID-ul sezonului este obligatoriu.")
  }
}

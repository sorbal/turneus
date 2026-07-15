import { normalizeSlug } from "@/lib/slug"
import {
  countCityRelations,
  createCity,
  deleteCity,
  findCities,
  findCityById,
  findCityBySlug,
  updateCity,
  type CityRelationCounts,
  type CityUpdateData,
} from "@/repositories/city.repository"

const DEFAULT_COUNTRY = "Romania"

export type CreateCityInput = {
  name: string
  slug?: string | null
  county?: string | null
  country?: string | null
}

export type UpdateCityInput = {
  name?: string
  slug?: string | null
  county?: string | null
  country?: string | null
}

export class CityServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CityServiceError"
  }
}

export async function getCities() {
  return findCities()
}

export async function getCityById(id: string) {
  assertId(id)
  return findCityById(id)
}

export async function createCityRecord(input: CreateCityInput) {
  const name = normalizeRequiredText(input.name, "Numele orasului este obligatoriu.")
  const slug = normalizeCitySlug(input.slug ?? name)
  const county = normalizeOptionalText(input.county)
  const country = normalizeCountry(input.country)

  await assertUniqueSlug(slug)

  return createCity({
    name,
    slug,
    county,
    country,
  })
}

export async function updateCityRecord(id: string, input: UpdateCityInput) {
  assertId(id)

  const existingCity = await findCityById(id)

  if (!existingCity) {
    throw new CityServiceError("Orasul nu exista.")
  }

  const data: CityUpdateData = {}

  if (input.name !== undefined) {
    data.name = normalizeRequiredText(
      input.name,
      "Numele orasului este obligatoriu."
    )
  }

  if (input.slug !== undefined) {
    data.slug = normalizeCitySlug(input.slug)
  } else if (input.name !== undefined) {
    data.slug = normalizeCitySlug(input.name)
  }

  if (input.county !== undefined) {
    data.county = normalizeOptionalText(input.county)
  }

  if (input.country !== undefined) {
    data.country = normalizeCountry(input.country)
  }

  if (data.slug) {
    await assertUniqueSlug(data.slug, id)
  }

  return updateCity(id, data)
}

export async function deleteCityRecord(id: string) {
  assertId(id)

  const existingCity = await findCityById(id)

  if (!existingCity) {
    throw new CityServiceError("Orasul nu exista.")
  }

  const relationCounts = await countCityRelations(id)

  assertCityCanBeDeleted(relationCounts)

  return deleteCity(id)
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new CityServiceError(message)
  }

  return normalizedValue
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}

function normalizeCountry(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : DEFAULT_COUNTRY
}

function normalizeCitySlug(value: string | null | undefined) {
  const slug = normalizeSlug(value ?? "")

  if (!slug) {
    throw new CityServiceError("Slug-ul orasului este obligatoriu.")
  }

  return slug
}

async function assertUniqueSlug(slug: string, currentCityId?: string) {
  const existingCity = await findCityBySlug(slug)

  if (existingCity && existingCity.id !== currentCityId) {
    throw new CityServiceError("Exista deja un oras cu acest slug.")
  }
}

function assertId(id: string) {
  if (!id.trim()) {
    throw new CityServiceError("ID-ul orasului este obligatoriu.")
  }
}

function assertCityCanBeDeleted(relationCounts: CityRelationCounts) {
  const relatedRecords =
    relationCounts.users +
    relationCounts.venues +
    relationCounts.tournaments +
    relationCounts.organizers +
    relationCounts.advertisements +
    relationCounts.playerSeasonStats

  if (relatedRecords > 0) {
    throw new CityServiceError(
      "Orasul nu poate fi sters deoarece este folosit de utilizatori, locatii, turnee, organizatori, reclame sau clasamente."
    )
  }
}

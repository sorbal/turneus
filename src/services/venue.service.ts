import {
  countVenueTournaments,
  createVenue,
  deleteVenue,
  findVenueById,
  findVenueByNameAndCityId,
  findVenueCityById,
  findVenues,
  updateVenue,
  type VenueUpdateData,
} from "@/repositories/venue.repository"

export type CreateVenueInput = {
  name: string
  address?: string | null
  cityId: string
}

export type UpdateVenueInput = {
  name?: string
  address?: string | null
  cityId?: string
}

export class VenueServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "VenueServiceError"
  }
}

export async function getVenues() {
  return findVenues()
}

export async function getVenueById(id: string) {
  assertId(id, "ID-ul locatiei este obligatoriu.")

  return findVenueById(id)
}

export async function createVenueRecord(input: CreateVenueInput) {
  const name = normalizeRequiredText(
    input.name,
    "Numele locatiei este obligatoriu."
  )
  const cityId = normalizeRequiredText(
    input.cityId,
    "Orasul locatiei este obligatoriu."
  )
  const address = normalizeOptionalText(input.address)

  await assertCityExists(cityId)
  await assertUniqueVenueNameInCity(name, cityId)

  return createVenue({
    name,
    address,
    cityId,
  })
}

export async function updateVenueRecord(id: string, input: UpdateVenueInput) {
  assertId(id, "ID-ul locatiei este obligatoriu.")

  const existingVenue = await findVenueById(id)

  if (!existingVenue) {
    throw new VenueServiceError("Locatia nu exista.")
  }

  const data: VenueUpdateData = {}

  if (input.name !== undefined) {
    data.name = normalizeRequiredText(
      input.name,
      "Numele locatiei este obligatoriu."
    )
  }

  if (input.cityId !== undefined) {
    data.cityId = normalizeRequiredText(
      input.cityId,
      "Orasul locatiei este obligatoriu."
    )
    await assertCityExists(data.cityId)
  }

  if (input.address !== undefined) {
    data.address = normalizeOptionalText(input.address)
  }

  const nextName = data.name ?? existingVenue.name
  const nextCityId = data.cityId ?? existingVenue.cityId

  await assertUniqueVenueNameInCity(nextName, nextCityId, id)

  return updateVenue(id, data)
}

export async function deleteVenueRecord(id: string) {
  assertId(id, "ID-ul locatiei este obligatoriu.")

  const existingVenue = await findVenueById(id)

  if (!existingVenue) {
    throw new VenueServiceError("Locatia nu exista.")
  }

  const tournamentsCount = await countVenueTournaments(id)

  if (tournamentsCount > 0) {
    throw new VenueServiceError(
      "Locatia nu poate fi stearsa deoarece are turnee asociate."
    )
  }

  return deleteVenue(id)
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new VenueServiceError(message)
  }

  return normalizedValue
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}

async function assertCityExists(cityId: string) {
  const city = await findVenueCityById(cityId)

  if (!city) {
    throw new VenueServiceError("Orasul nu exista.")
  }
}

async function assertUniqueVenueNameInCity(
  name: string,
  cityId: string,
  currentVenueId?: string
) {
  const existingVenue = await findVenueByNameAndCityId(name, cityId)

  if (existingVenue && existingVenue.id !== currentVenueId) {
    throw new VenueServiceError(
      "Exista deja o locatie cu acest nume in orasul selectat."
    )
  }
}

function assertId(id: string, message: string) {
  if (!id.trim()) {
    throw new VenueServiceError(message)
  }
}

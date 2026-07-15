import { normalizeSlug } from "@/lib/slug"
import {
  countCitiesByIds,
  countOrganizerTournaments,
  createOrganizer,
  deleteOrganizerProfile,
  findEligibleOrganizerUsers,
  findOrganizerById,
  findOrganizerBySlug,
  findOrganizerByUserId,
  findOrganizers,
  findUserById,
  setOrganizerApproved,
  updateOrganizer,
  type OrganizerUpdateData,
} from "@/repositories/organizer.repository"

export type CreateOrganizerInput = {
  userId: string
  publicName: string
  slug?: string | null
  logoUrl?: string | null
  description?: string | null
  cityIds?: string[] | null
  isApproved?: boolean
}

export type UpdateOrganizerInput = {
  publicName?: string
  slug?: string | null
  logoUrl?: string | null
  description?: string | null
  cityIds?: string[] | null
}

export class OrganizerServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OrganizerServiceError"
  }
}

export async function getOrganizers() {
  return findOrganizers()
}

export async function getOrganizerById(id: string) {
  assertId(id, "ID-ul organizatorului este obligatoriu.")
  return findOrganizerById(id)
}

export async function getEligibleOrganizerUsers() {
  return findEligibleOrganizerUsers()
}

export async function createOrganizerRecord(input: CreateOrganizerInput) {
  const userId = normalizeRequiredText(
    input.userId,
    "Userul este obligatoriu."
  )
  const publicName = normalizeRequiredText(
    input.publicName,
    "Numele public al organizatorului este obligatoriu."
  )
  const slug = normalizeOrganizerSlug(input.slug ?? publicName)
  const logoUrl = normalizeOptionalText(input.logoUrl)
  const description = normalizeOptionalText(input.description)
  const cityIds = normalizeCityIds(input.cityIds)

  await assertUserCanBecomeOrganizer(userId)
  await assertUserHasNoOrganizerProfile(userId)
  await assertUniqueSlug(slug)
  await assertCitiesExist(cityIds)

  return createOrganizer({
    userId,
    publicName,
    slug,
    logoUrl,
    description,
    isApproved: input.isApproved ?? false,
    cityIds,
  })
}

export async function updateOrganizerRecord(
  id: string,
  input: UpdateOrganizerInput
) {
  assertId(id, "ID-ul organizatorului este obligatoriu.")

  const existingOrganizer = await findOrganizerById(id)

  if (!existingOrganizer) {
    throw new OrganizerServiceError("Organizatorul nu exista.")
  }

  const data: OrganizerUpdateData = {}

  if (input.publicName !== undefined) {
    data.publicName = normalizeRequiredText(
      input.publicName,
      "Numele public al organizatorului este obligatoriu."
    )
  }

  if (input.slug !== undefined) {
    data.slug = normalizeOrganizerSlug(input.slug)
  } else if (input.publicName !== undefined) {
    data.slug = normalizeOrganizerSlug(input.publicName)
  }

  if (input.logoUrl !== undefined) {
    data.logoUrl = normalizeOptionalText(input.logoUrl)
  }

  if (input.description !== undefined) {
    data.description = normalizeOptionalText(input.description)
  }

  if (input.cityIds !== undefined) {
    data.cityIds = normalizeCityIds(input.cityIds)
    await assertCitiesExist(data.cityIds)
  }

  if (data.slug) {
    await assertUniqueSlug(data.slug, id)
  }

  return updateOrganizer(id, data)
}

export async function setOrganizerApproval(id: string, isApproved: boolean) {
  assertId(id, "ID-ul organizatorului este obligatoriu.")

  const existingOrganizer = await findOrganizerById(id)

  if (!existingOrganizer) {
    throw new OrganizerServiceError("Organizatorul nu exista.")
  }

  return setOrganizerApproved(id, isApproved)
}

export async function deleteOrganizerRecord(id: string) {
  assertId(id, "ID-ul organizatorului este obligatoriu.")

  const existingOrganizer = await findOrganizerById(id)

  if (!existingOrganizer) {
    throw new OrganizerServiceError("Organizatorul nu exista.")
  }

  const tournamentCount = await countOrganizerTournaments(id)

  if (tournamentCount > 0) {
    throw new OrganizerServiceError(
      "Organizatorul nu poate fi sters deoarece are turnee asociate."
    )
  }

  return deleteOrganizerProfile(id, existingOrganizer.userId)
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new OrganizerServiceError(message)
  }

  return normalizedValue
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}

function normalizeOrganizerSlug(value: string | null | undefined) {
  const slug = normalizeSlug(value ?? "")

  if (!slug) {
    throw new OrganizerServiceError("Slug-ul organizatorului este obligatoriu.")
  }

  return slug
}

function normalizeCityIds(value: string[] | null | undefined) {
  if (!value) {
    return []
  }

  const cityIds = value.map((cityId) => cityId.trim()).filter(Boolean)

  return Array.from(new Set(cityIds))
}

async function assertUserCanBecomeOrganizer(userId: string) {
  const user = await findUserById(userId)

  if (!user) {
    throw new OrganizerServiceError("Userul nu exista.")
  }

  if (user.role !== "PLAYER") {
    throw new OrganizerServiceError(
      "Doar userii cu rol PLAYER pot deveni organizatori."
    )
  }
}

async function assertUserHasNoOrganizerProfile(userId: string) {
  const existingOrganizer = await findOrganizerByUserId(userId)

  if (existingOrganizer) {
    throw new OrganizerServiceError(
      "Userul are deja un profil de organizator."
    )
  }
}

async function assertUniqueSlug(slug: string, currentOrganizerId?: string) {
  const existingOrganizer = await findOrganizerBySlug(slug)

  if (existingOrganizer && existingOrganizer.id !== currentOrganizerId) {
    throw new OrganizerServiceError(
      "Exista deja un organizator cu acest slug."
    )
  }
}

async function assertCitiesExist(cityIds: string[]) {
  if (cityIds.length === 0) {
    return
  }

  const existingCitiesCount = await countCitiesByIds(cityIds)

  if (existingCitiesCount !== cityIds.length) {
    throw new OrganizerServiceError("Unul sau mai multe orase nu exista.")
  }
}

function assertId(id: string, message: string) {
  if (!id.trim()) {
    throw new OrganizerServiceError(message)
  }
}

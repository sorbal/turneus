import { normalizeSlug } from "@/lib/slug"
import {
  countGameRelations,
  createGame,
  deleteGame,
  findGameById,
  findGameBySlug,
  findGames,
  updateGame,
  type GameRelationCounts,
  type GameUpdateData,
} from "@/repositories/game.repository"

export type CreateGameInput = {
  name: string
  slug?: string | null
  description?: string | null
  isActive?: boolean
}

export type UpdateGameInput = {
  name?: string
  slug?: string | null
  description?: string | null
  isActive?: boolean
}

export class GameServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GameServiceError"
  }
}

export async function getGames() {
  return findGames()
}

export async function getGameById(id: string) {
  assertId(id)
  return findGameById(id)
}

export async function createGameRecord(input: CreateGameInput) {
  const name = normalizeRequiredText(input.name, "Numele jocului este obligatoriu.")
  const slug = normalizeGameSlug(input.slug ?? name)
  const description = normalizeOptionalText(input.description)

  await assertUniqueSlug(slug)

  return createGame({
    name,
    slug,
    description,
    isActive: input.isActive ?? true,
  })
}

export async function updateGameRecord(id: string, input: UpdateGameInput) {
  assertId(id)

  const existingGame = await findGameById(id)

  if (!existingGame) {
    throw new GameServiceError("Jocul nu exista.")
  }

  const data: GameUpdateData = {}

  if (input.name !== undefined) {
    data.name = normalizeRequiredText(
      input.name,
      "Numele jocului este obligatoriu."
    )
  }

  if (input.slug !== undefined) {
    data.slug = normalizeGameSlug(input.slug)
  } else if (input.name !== undefined) {
    data.slug = normalizeGameSlug(input.name)
  }

  if (input.description !== undefined) {
    data.description = normalizeOptionalText(input.description)
  }

  if (input.isActive !== undefined) {
    data.isActive = input.isActive
  }

  if (data.slug) {
    await assertUniqueSlug(data.slug, id)
  }

  return updateGame(id, data)
}

export async function deleteGameRecord(id: string) {
  assertId(id)

  const existingGame = await findGameById(id)

  if (!existingGame) {
    throw new GameServiceError("Jocul nu exista.")
  }

  const relationCounts = await countGameRelations(id)

  assertGameCanBeDeleted(relationCounts)

  return deleteGame(id)
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new GameServiceError(message)
  }

  return normalizedValue
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}

function normalizeGameSlug(value: string | null | undefined) {
  const slug = normalizeSlug(value ?? "")

  if (!slug) {
    throw new GameServiceError("Slug-ul jocului este obligatoriu.")
  }

  return slug
}

async function assertUniqueSlug(slug: string, currentGameId?: string) {
  const existingGame = await findGameBySlug(slug)

  if (existingGame && existingGame.id !== currentGameId) {
    throw new GameServiceError("Exista deja un joc cu acest slug.")
  }
}

function assertId(id: string) {
  if (!id.trim()) {
    throw new GameServiceError("ID-ul jocului este obligatoriu.")
  }
}

function assertGameCanBeDeleted(relationCounts: GameRelationCounts) {
  const relatedRecords =
    relationCounts.tournaments + relationCounts.rankings + relationCounts.ads

  if (relatedRecords > 0) {
    throw new GameServiceError(
      "Jocul nu poate fi sters deoarece este folosit in turnee, clasamente sau reclame."
    )
  }
}

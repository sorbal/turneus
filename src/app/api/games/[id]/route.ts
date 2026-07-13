import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  deleteGameRecord,
  GameServiceError,
  getGameById,
  updateGameRecord,
  type UpdateGameInput,
} from "@/services/game.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const game = await getGameById(id)

    if (!game) {
      return NextResponse.json(
        { error: "Jocul nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      game,
    })
  } catch (error) {
    return handleGameApiError(error, "GAME_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const body = await readJsonBody(request)
    const input = parseUpdateGameInput(body)
    const game = await updateGameRecord(id, input)

    return NextResponse.json({
      message: "Joc actualizat cu succes.",
      game,
    })
  } catch (error) {
    return handleGameApiError(error, "GAME_PATCH_ERROR")
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const game = await deleteGameRecord(id)

    return NextResponse.json({
      message: "Joc sters cu succes.",
      game,
    })
  } catch (error) {
    return handleGameApiError(error, "GAME_DELETE_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new GameApiError("Body JSON invalid.", 400)
  }
}

function parseUpdateGameInput(body: unknown): UpdateGameInput {
  if (!isRecord(body)) {
    throw new GameApiError("Body JSON invalid.", 400)
  }

  return {
    name: readOptionalRequiredString(body.name, "Nume invalid."),
    slug: readOptionalString(body.slug, "Slug invalid."),
    description: readOptionalString(body.description, "Descriere invalida."),
    isActive: readOptionalBoolean(body.isActive, "Status invalid."),
  }
}

function readOptionalRequiredString(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new GameApiError(message, 400)
  }

  return value
}

function readOptionalString(value: unknown, message: string) {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value !== "string") {
    throw new GameApiError(message, 400)
  }

  return value
}

function readOptionalBoolean(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "boolean") {
    throw new GameApiError(message, 400)
  }

  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class GameApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "GameApiError"
  }
}

function handleGameApiError(error: unknown, logCode: string) {
  if (error instanceof GameApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof GameServiceError) {
    const status = getServiceErrorStatus(error)

    return NextResponse.json({ error: error.message }, { status })
  }

  if (error instanceof Error && error.message === "Neautentificat.") {
    return NextResponse.json(
      { error: "Autentificare necesara." },
      { status: 401 }
    )
  }

  if (
    error instanceof Error &&
    error.message === "Acces interzis. Admin necesar."
  ) {
    return NextResponse.json(
      { error: "Acces interzis. Admin necesar." },
      { status: 403 }
    )
  }

  console.error(logCode, error)

  return NextResponse.json(
    { error: "Eroare interna la procesarea jocului." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: GameServiceError) {
  if (error.message === "Exista deja un joc cu acest slug.") {
    return 409
  }

  if (error.message === "Jocul nu exista.") {
    return 404
  }

  return 400
}

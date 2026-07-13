import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  createGameRecord,
  GameServiceError,
  getGames,
  type CreateGameInput,
} from "@/services/game.service"

export async function GET() {
  try {
    const games = await getGames()

    return NextResponse.json({
      games,
    })
  } catch (error) {
    console.error("GAMES_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea jocurilor." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await readJsonBody(request)
    const input = parseCreateGameInput(body)
    const game = await createGameRecord(input)

    return NextResponse.json(
      {
        message: "Joc creat cu succes.",
        game,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleGameApiError(error, "GAMES_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new GameApiError("Body JSON invalid.", 400)
  }
}

function parseCreateGameInput(body: unknown): CreateGameInput {
  if (!isRecord(body)) {
    throw new GameApiError("Body JSON invalid.", 400)
  }

  if (typeof body.name !== "string") {
    throw new GameApiError("Numele jocului este obligatoriu.", 400)
  }

  return {
    name: body.name,
    slug: readOptionalString(body.slug, "Slug invalid."),
    description: readOptionalString(body.description, "Descriere invalida."),
    isActive: readOptionalBoolean(body.isActive, "Status invalid."),
  }
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

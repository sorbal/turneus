import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  deleteTournamentRecord,
  getTournamentById,
  TournamentServiceError,
  updateTournamentRecord,
  type UpdateTournamentInput,
} from "@/services/tournament.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const allowedUpdateFields = new Set([
  "name",
  "description",
  "gameId",
  "cityId",
  "venueId",
  "organizerId",
  "startsAt",
  "entryFee",
  "maxPlayers",
])

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const tournament = await getTournamentById(id)

    if (!tournament) {
      return NextResponse.json(
        { error: "Turneul nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      tournament,
    })
  } catch (error) {
    return handleTournamentApiError(error, "TOURNAMENT_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const body = await readJsonBody(request)
    const input = parseUpdateTournamentInput(body)
    const tournament = await updateTournamentRecord(id, input)

    return NextResponse.json({
      message: "Turneu actualizat cu succes.",
      tournament,
    })
  } catch (error) {
    return handleTournamentApiError(error, "TOURNAMENT_PATCH_ERROR")
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const tournament = await deleteTournamentRecord(id)

    return NextResponse.json({
      message: "Turneu sters cu succes.",
      tournament,
    })
  } catch (error) {
    return handleTournamentApiError(error, "TOURNAMENT_DELETE_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new TournamentApiError("Body JSON invalid.", 400)
  }
}

function parseUpdateTournamentInput(body: unknown): UpdateTournamentInput {
  if (!isRecord(body)) {
    throw new TournamentApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, allowedUpdateFields)

  return {
    name: readOptionalRequiredString(body.name, "Nume invalid."),
    description: readOptionalString(body.description, "Descriere invalida."),
    gameId: readOptionalRequiredString(body.gameId, "Joc invalid."),
    cityId: readOptionalRequiredString(body.cityId, "Oras invalid."),
    venueId: readOptionalString(body.venueId, "Locatie invalida."),
    organizerId: readOptionalRequiredString(
      body.organizerId,
      "Organizator invalid."
    ),
    startsAt: readOptionalDateInput(
      body.startsAt,
      "Data turneului este invalida."
    ),
    entryFee: readOptionalNumberInput(
      body.entryFee,
      "Taxa de participare este invalida."
    ),
    maxPlayers: readOptionalNumberInput(
      body.maxPlayers,
      "Numarul maxim de jucatori este invalid."
    ),
  }
}

function readOptionalRequiredString(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new TournamentApiError(message, 400)
  }

  return value
}

function readOptionalString(value: unknown, message: string) {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value !== "string") {
    throw new TournamentApiError(message, 400)
  }

  return value
}

function readOptionalDateInput(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new TournamentApiError(message, 400)
  }

  return value
}

function readOptionalNumberInput(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "number" && typeof value !== "string") {
    throw new TournamentApiError(message, 400)
  }

  return value
}

function assertOnlyAllowedFields(
  body: Record<string, unknown>,
  allowedFields: Set<string>
) {
  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      throw new TournamentApiError(`Camp invalid: ${key}.`, 400)
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class TournamentApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "TournamentApiError"
  }
}

function handleTournamentApiError(error: unknown, logCode: string) {
  if (error instanceof TournamentApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof TournamentServiceError) {
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
    { error: "Eroare interna la procesarea turneului." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: TournamentServiceError) {
  if (error.message === "Exista deja un turneu cu acest slug.") {
    return 409
  }

  if (
    error.message === "Turneul nu exista." ||
    error.message === "Jocul nu exista." ||
    error.message === "Orasul nu exista." ||
    error.message === "Locatia nu exista." ||
    error.message === "Organizatorul nu exista."
  ) {
    return 404
  }

  return 400
}

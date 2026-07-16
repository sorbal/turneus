import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  createTournamentRecord,
  getTournaments,
  TournamentServiceError,
  type CreateTournamentInput,
} from "@/services/tournament.service"

export async function GET() {
  try {
    const tournaments = await getTournaments()

    return NextResponse.json({
      tournaments,
    })
  } catch (error) {
    console.error("TOURNAMENTS_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea turneelor." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await readJsonBody(request)
    const input = parseCreateTournamentInput(body)
    const tournament = await createTournamentRecord(input)

    return NextResponse.json(
      {
        message: "Turneu creat cu succes.",
        tournament,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleTournamentApiError(error, "TOURNAMENTS_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new TournamentApiError("Body JSON invalid.", 400)
  }
}

function parseCreateTournamentInput(body: unknown): CreateTournamentInput {
  if (!isRecord(body)) {
    throw new TournamentApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(
    body,
    new Set([
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
  )

  if (typeof body.name !== "string") {
    throw new TournamentApiError("Numele turneului este obligatoriu.", 400)
  }

  if (typeof body.gameId !== "string") {
    throw new TournamentApiError("Joc invalid.", 400)
  }

  if (typeof body.cityId !== "string") {
    throw new TournamentApiError("Oras invalid.", 400)
  }

  if (typeof body.organizerId !== "string") {
    throw new TournamentApiError("Organizator invalid.", 400)
  }

  if (!isDateInput(body.startsAt)) {
    throw new TournamentApiError("Data turneului este invalida.", 400)
  }

  if (!isNumberInput(body.entryFee)) {
    throw new TournamentApiError("Taxa de participare este invalida.", 400)
  }

  if (!isNumberInput(body.maxPlayers)) {
    throw new TournamentApiError(
      "Numarul maxim de jucatori este invalid.",
      400
    )
  }

  return {
    name: body.name,
    description: readOptionalString(body.description, "Descriere invalida."),
    gameId: body.gameId,
    cityId: body.cityId,
    venueId: readOptionalString(body.venueId, "Locatie invalida."),
    organizerId: body.organizerId,
    startsAt: body.startsAt,
    entryFee: body.entryFee,
    maxPlayers: body.maxPlayers,
  }
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

function isDateInput(value: unknown): value is string {
  return typeof value === "string"
}

function isNumberInput(value: unknown): value is number | string {
  return typeof value === "number" || typeof value === "string"
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
    error.message === "Jocul nu exista." ||
    error.message === "Orasul nu exista." ||
    error.message === "Locatia nu exista." ||
    error.message === "Organizatorul nu exista."
  ) {
    return 404
  }

  return 400
}

import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  createSeasonRecord,
  getSeasons,
  SeasonServiceError,
  type CreateSeasonInput,
} from "@/services/season.service"

export async function GET() {
  try {
    const seasons = await getSeasons()

    return NextResponse.json({
      seasons,
    })
  } catch (error) {
    console.error("SEASONS_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea sezoanelor." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await readJsonBody(request)
    const input = parseCreateSeasonInput(body)
    const season = await createSeasonRecord(input)

    return NextResponse.json(
      {
        message: "Sezon creat cu succes.",
        season,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleSeasonApiError(error, "SEASONS_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new SeasonApiError("Body JSON invalid.", 400)
  }
}

function parseCreateSeasonInput(body: unknown): CreateSeasonInput {
  if (!isRecord(body)) {
    throw new SeasonApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(
    body,
    new Set(["name", "year", "startsAt", "endsAt", "isActive"])
  )

  if (typeof body.name !== "string") {
    throw new SeasonApiError("Numele sezonului este obligatoriu.", 400)
  }

  if (!isNumberInput(body.year)) {
    throw new SeasonApiError("Anul sezonului este invalid.", 400)
  }

  if (!isDateInput(body.startsAt)) {
    throw new SeasonApiError("Data de inceput este invalida.", 400)
  }

  if (!isDateInput(body.endsAt)) {
    throw new SeasonApiError("Data de final este invalida.", 400)
  }

  return {
    name: body.name,
    year: body.year,
    startsAt: body.startsAt,
    endsAt: body.endsAt,
    isActive: readOptionalBoolean(body.isActive, "Status activ invalid."),
  }
}

function readOptionalBoolean(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "boolean") {
    throw new SeasonApiError(message, 400)
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
      throw new SeasonApiError(`Camp invalid: ${key}.`, 400)
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class SeasonApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "SeasonApiError"
  }
}

function handleSeasonApiError(error: unknown, logCode: string) {
  if (error instanceof SeasonApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof SeasonServiceError) {
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
    { error: "Eroare interna la procesarea sezonului." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: SeasonServiceError) {
  if (error.message === "Exista deja un sezon cu acest an.") {
    return 409
  }

  if (error.message === "Sezonul nu exista.") {
    return 404
  }

  return 400
}

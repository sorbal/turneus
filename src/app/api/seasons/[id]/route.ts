import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  activateSeasonRecord,
  deleteSeasonRecord,
  getSeasonById,
  SeasonServiceError,
  updateSeasonRecord,
  type UpdateSeasonInput,
} from "@/services/season.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const allowedUpdateFields = new Set(["name", "year", "startsAt", "endsAt"])
const activateActionFields = new Set(["action"])

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const season = await getSeasonById(id)

    if (!season) {
      return NextResponse.json(
        { error: "Sezonul nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      season,
    })
  } catch (error) {
    return handleSeasonApiError(error, "SEASON_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const body = await readJsonBody(request)

    if (isActivateActionInput(body)) {
      const season = await activateSeasonRecord(id)

      return NextResponse.json({
        message: "Sezon activat cu succes.",
        season,
      })
    }

    const input = parseUpdateSeasonInput(body)
    const season = await updateSeasonRecord(id, input)

    return NextResponse.json({
      message: "Sezon actualizat cu succes.",
      season,
    })
  } catch (error) {
    return handleSeasonApiError(error, "SEASON_PATCH_ERROR")
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const season = await deleteSeasonRecord(id)

    return NextResponse.json({
      message: "Sezon sters cu succes.",
      season,
    })
  } catch (error) {
    return handleSeasonApiError(error, "SEASON_DELETE_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new SeasonApiError("Body JSON invalid.", 400)
  }
}

function parseUpdateSeasonInput(body: unknown): UpdateSeasonInput {
  if (!isRecord(body)) {
    throw new SeasonApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, allowedUpdateFields)

  return {
    name: readOptionalRequiredString(body.name, "Nume invalid."),
    year: readOptionalNumberInput(body.year, "An invalid."),
    startsAt: readOptionalDateInput(body.startsAt, "Data de inceput invalida."),
    endsAt: readOptionalDateInput(body.endsAt, "Data de final invalida."),
  }
}

function isActivateActionInput(body: unknown): body is { action: "activate" } {
  if (!isRecord(body)) {
    return false
  }

  if (body.action === undefined) {
    return false
  }

  assertOnlyAllowedFields(body, activateActionFields)

  if (body.action !== "activate") {
    throw new SeasonApiError("Actiune invalida.", 400)
  }

  return body.action === "activate"
}

function readOptionalRequiredString(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new SeasonApiError(message, 400)
  }

  return value
}

function readOptionalNumberInput(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "number" && typeof value !== "string") {
    throw new SeasonApiError(message, 400)
  }

  return value
}

function readOptionalDateInput(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new SeasonApiError(message, 400)
  }

  return value
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

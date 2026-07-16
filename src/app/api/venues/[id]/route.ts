import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  deleteVenueRecord,
  getVenueById,
  updateVenueRecord,
  VenueServiceError,
  type UpdateVenueInput,
} from "@/services/venue.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const allowedUpdateFields = new Set(["name", "cityId", "address"])

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const venue = await getVenueById(id)

    if (!venue) {
      return NextResponse.json(
        { error: "Locatia nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      venue,
    })
  } catch (error) {
    return handleVenueApiError(error, "VENUE_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const body = await readJsonBody(request)
    const input = parseUpdateVenueInput(body)
    const venue = await updateVenueRecord(id, input)

    return NextResponse.json({
      message: "Locatie actualizata cu succes.",
      venue,
    })
  } catch (error) {
    return handleVenueApiError(error, "VENUE_PATCH_ERROR")
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const venue = await deleteVenueRecord(id)

    return NextResponse.json({
      message: "Locatie stearsa cu succes.",
      venue,
    })
  } catch (error) {
    return handleVenueApiError(error, "VENUE_DELETE_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new VenueApiError("Body JSON invalid.", 400)
  }
}

function parseUpdateVenueInput(body: unknown): UpdateVenueInput {
  if (!isRecord(body)) {
    throw new VenueApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, allowedUpdateFields)

  return {
    name: readOptionalRequiredString(body.name, "Nume invalid."),
    cityId: readOptionalRequiredString(body.cityId, "Oras invalid."),
    address: readOptionalString(body.address, "Adresa invalida."),
  }
}

function readOptionalRequiredString(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new VenueApiError(message, 400)
  }

  return value
}

function readOptionalString(value: unknown, message: string) {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value !== "string") {
    throw new VenueApiError(message, 400)
  }

  return value
}

function assertOnlyAllowedFields(
  body: Record<string, unknown>,
  allowedFields: Set<string>
) {
  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      throw new VenueApiError(`Camp invalid: ${key}.`, 400)
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class VenueApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "VenueApiError"
  }
}

function handleVenueApiError(error: unknown, logCode: string) {
  if (error instanceof VenueApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof VenueServiceError) {
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
    { error: "Eroare interna la procesarea locatiei." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: VenueServiceError) {
  if (
    error.message ===
    "Exista deja o locatie cu acest nume in orasul selectat."
  ) {
    return 409
  }

  if (error.message === "Locatia nu exista.") {
    return 404
  }

  return 400
}

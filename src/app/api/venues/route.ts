import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  createVenueRecord,
  getVenues,
  VenueServiceError,
  type CreateVenueInput,
} from "@/services/venue.service"

export async function GET() {
  try {
    const venues = await getVenues()

    return NextResponse.json({
      venues,
    })
  } catch (error) {
    console.error("VENUES_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea locatiilor." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await readJsonBody(request)
    const input = parseCreateVenueInput(body)
    const venue = await createVenueRecord(input)

    return NextResponse.json(
      {
        message: "Locatie creata cu succes.",
        venue,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleVenueApiError(error, "VENUES_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new VenueApiError("Body JSON invalid.", 400)
  }
}

function parseCreateVenueInput(body: unknown): CreateVenueInput {
  if (!isRecord(body)) {
    throw new VenueApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, new Set(["name", "cityId", "address"]))

  if (typeof body.name !== "string") {
    throw new VenueApiError("Numele locatiei este obligatoriu.", 400)
  }

  if (typeof body.cityId !== "string") {
    throw new VenueApiError("Oras invalid.", 400)
  }

  return {
    name: body.name,
    cityId: body.cityId,
    address: readOptionalString(body.address, "Adresa invalida."),
  }
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

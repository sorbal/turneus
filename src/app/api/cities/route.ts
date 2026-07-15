import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  CityServiceError,
  createCityRecord,
  getCities,
  type CreateCityInput,
} from "@/services/city.service"

export async function GET() {
  try {
    const cities = await getCities()

    return NextResponse.json({
      cities,
    })
  } catch (error) {
    console.error("CITIES_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea oraselor." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await readJsonBody(request)
    const input = parseCreateCityInput(body)
    const city = await createCityRecord(input)

    return NextResponse.json(
      {
        message: "Oras creat cu succes.",
        city,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleCityApiError(error, "CITIES_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new CityApiError("Body JSON invalid.", 400)
  }
}

function parseCreateCityInput(body: unknown): CreateCityInput {
  if (!isRecord(body)) {
    throw new CityApiError("Body JSON invalid.", 400)
  }

  if (typeof body.name !== "string") {
    throw new CityApiError("Numele orasului este obligatoriu.", 400)
  }

  return {
    name: body.name,
    slug: readOptionalString(body.slug, "Slug invalid."),
    county: readOptionalString(body.county, "Judet invalid."),
    country: readOptionalString(body.country, "Tara invalida."),
  }
}

function readOptionalString(value: unknown, message: string) {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value !== "string") {
    throw new CityApiError(message, 400)
  }

  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class CityApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "CityApiError"
  }
}

function handleCityApiError(error: unknown, logCode: string) {
  if (error instanceof CityApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof CityServiceError) {
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
    { error: "Eroare interna la procesarea orasului." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: CityServiceError) {
  if (error.message === "Exista deja un oras cu acest slug.") {
    return 409
  }

  if (error.message === "Orasul nu exista.") {
    return 404
  }

  return 400
}

import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  CityServiceError,
  deleteCityRecord,
  getCityById,
  updateCityRecord,
  type UpdateCityInput,
} from "@/services/city.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const city = await getCityById(id)

    if (!city) {
      return NextResponse.json(
        { error: "Orasul nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      city,
    })
  } catch (error) {
    return handleCityApiError(error, "CITY_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const body = await readJsonBody(request)
    const input = parseUpdateCityInput(body)
    const city = await updateCityRecord(id, input)

    return NextResponse.json({
      message: "Oras actualizat cu succes.",
      city,
    })
  } catch (error) {
    return handleCityApiError(error, "CITY_PATCH_ERROR")
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const city = await deleteCityRecord(id)

    return NextResponse.json({
      message: "Oras sters cu succes.",
      city,
    })
  } catch (error) {
    return handleCityApiError(error, "CITY_DELETE_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new CityApiError("Body JSON invalid.", 400)
  }
}

function parseUpdateCityInput(body: unknown): UpdateCityInput {
  if (!isRecord(body)) {
    throw new CityApiError("Body JSON invalid.", 400)
  }

  return {
    name: readOptionalRequiredString(body.name, "Nume invalid."),
    slug: readOptionalString(body.slug, "Slug invalid."),
    county: readOptionalString(body.county, "Judet invalid."),
    country: readOptionalString(body.country, "Tara invalida."),
  }
}

function readOptionalRequiredString(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new CityApiError(message, 400)
  }

  return value
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

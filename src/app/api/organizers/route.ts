import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  createOrganizerRecord,
  getOrganizers,
  OrganizerServiceError,
  type CreateOrganizerInput,
} from "@/services/organizer.service"

export async function GET() {
  try {
    const organizers = await getOrganizers()

    return NextResponse.json({
      organizers,
    })
  } catch (error) {
    console.error("ORGANIZERS_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea organizatorilor." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await readJsonBody(request)
    const input = parseCreateOrganizerInput(body)
    const organizer = await createOrganizerRecord(input)

    return NextResponse.json(
      {
        message: "Organizator creat cu succes.",
        organizer,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleOrganizerApiError(error, "ORGANIZERS_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new OrganizerApiError("Body JSON invalid.", 400)
  }
}

function parseCreateOrganizerInput(body: unknown): CreateOrganizerInput {
  if (!isRecord(body)) {
    throw new OrganizerApiError("Body JSON invalid.", 400)
  }

  assertRatingNotProvided(body)

  if (typeof body.userId !== "string") {
    throw new OrganizerApiError("User invalid.", 400)
  }

  if (typeof body.publicName !== "string") {
    throw new OrganizerApiError("Nume public invalid.", 400)
  }

  return {
    userId: body.userId,
    publicName: body.publicName,
    slug: readOptionalString(body.slug, "Slug invalid."),
    logoUrl: readOptionalString(body.logoUrl, "Logo invalid."),
    description: readOptionalString(body.description, "Descriere invalida."),
    cityIds: readOptionalStringArray(body.cityIds, "Orase invalide."),
  }
}

function readOptionalString(value: unknown, message: string) {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value !== "string") {
    throw new OrganizerApiError(message, 400)
  }

  return value
}

function readOptionalStringArray(value: unknown, message: string) {
  if (value === undefined || value === null) {
    return value
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new OrganizerApiError(message, 400)
  }

  return value
}

function assertRatingNotProvided(body: Record<string, unknown>) {
  if ("rating" in body) {
    throw new OrganizerApiError("Rating-ul nu poate fi editat manual.", 400)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class OrganizerApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "OrganizerApiError"
  }
}

function handleOrganizerApiError(error: unknown, logCode: string) {
  if (error instanceof OrganizerApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof OrganizerServiceError) {
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
    { error: "Eroare interna la procesarea organizatorului." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: OrganizerServiceError) {
  if (
    error.message === "Exista deja un organizator cu acest slug." ||
    error.message === "Userul are deja un profil de organizator."
  ) {
    return 409
  }

  if (
    error.message === "Organizatorul nu exista." ||
    error.message === "Userul nu exista."
  ) {
    return 404
  }

  return 400
}

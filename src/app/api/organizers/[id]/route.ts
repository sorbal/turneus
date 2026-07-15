import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  deleteOrganizerRecord,
  getOrganizerById,
  OrganizerServiceError,
  setOrganizerApproval,
  updateOrganizerRecord,
  type UpdateOrganizerInput,
} from "@/services/organizer.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const organizer = await getOrganizerById(id)

    if (!organizer) {
      return NextResponse.json(
        { error: "Organizatorul nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      organizer,
    })
  } catch (error) {
    return handleOrganizerApiError(error, "ORGANIZER_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const body = await readJsonBody(request)

    if (isApprovalOnlyBody(body)) {
      const organizer = await setOrganizerApproval(id, body.isApproved)

      return NextResponse.json({
        message: body.isApproved
          ? "Organizator aprobat cu succes."
          : "Aprobarea organizatorului a fost retrasa.",
        organizer,
      })
    }

    const input = parseUpdateOrganizerInput(body)
    const organizer = await updateOrganizerRecord(id, input)

    return NextResponse.json({
      message: "Organizator actualizat cu succes.",
      organizer,
    })
  } catch (error) {
    return handleOrganizerApiError(error, "ORGANIZER_PATCH_ERROR")
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const organizer = await deleteOrganizerRecord(id)

    return NextResponse.json({
      message: "Organizator sters cu succes.",
      organizer,
    })
  } catch (error) {
    return handleOrganizerApiError(error, "ORGANIZER_DELETE_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new OrganizerApiError("Body JSON invalid.", 400)
  }
}

function parseUpdateOrganizerInput(body: unknown): UpdateOrganizerInput {
  if (!isRecord(body)) {
    throw new OrganizerApiError("Body JSON invalid.", 400)
  }

  assertRatingNotProvided(body)
  assertApprovalNotMixedWithUpdate(body)

  return {
    publicName: readOptionalRequiredString(
      body.publicName,
      "Nume public invalid."
    ),
    slug: readOptionalString(body.slug, "Slug invalid."),
    logoUrl: readOptionalString(body.logoUrl, "Logo invalid."),
    description: readOptionalString(body.description, "Descriere invalida."),
    cityIds: readOptionalStringArray(body.cityIds, "Orase invalide."),
  }
}

function readOptionalRequiredString(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new OrganizerApiError(message, 400)
  }

  return value
}

function isApprovalOnlyBody(
  body: unknown
): body is { isApproved: boolean } {
  return (
    isRecord(body) &&
    Object.keys(body).length === 1 &&
    typeof body.isApproved === "boolean"
  )
}

function assertApprovalNotMixedWithUpdate(body: Record<string, unknown>) {
  if ("isApproved" in body) {
    throw new OrganizerApiError(
      "Aprobarea trebuie actualizata separat.",
      400
    )
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

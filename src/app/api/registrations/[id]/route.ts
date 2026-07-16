import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  cancelRegistrationRecord,
  checkInRegistration,
  getRegistrationById,
  RegistrationServiceError,
} from "@/services/registration.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type RegistrationAction = "check-in" | "cancel"

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const registration = await getRegistrationById(id)

    if (!registration) {
      return NextResponse.json(
        { error: "Inscrierea nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      registration,
    })
  } catch (error) {
    return handleRegistrationApiError(error, "REGISTRATION_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const body = await readJsonBody(request)
    const action = parseRegistrationAction(body)
    const registration =
      action === "check-in"
        ? await checkInRegistration(id)
        : await cancelRegistrationRecord(id)

    return NextResponse.json({
      message:
        action === "check-in"
          ? "Check-in realizat cu succes."
          : "Inscriere anulata cu succes.",
      registration,
    })
  } catch (error) {
    return handleRegistrationApiError(error, "REGISTRATION_PATCH_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new RegistrationApiError("Body JSON invalid.", 400)
  }
}

function parseRegistrationAction(body: unknown): RegistrationAction {
  if (!isRecord(body)) {
    throw new RegistrationApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, new Set(["action"]))

  if (body.action !== "check-in" && body.action !== "cancel") {
    throw new RegistrationApiError("Actiune invalida.", 400)
  }

  return body.action
}

function assertOnlyAllowedFields(
  body: Record<string, unknown>,
  allowedFields: Set<string>
) {
  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      throw new RegistrationApiError(`Camp invalid: ${key}.`, 400)
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class RegistrationApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "RegistrationApiError"
  }
}

function handleRegistrationApiError(error: unknown, logCode: string) {
  if (error instanceof RegistrationApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof RegistrationServiceError) {
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
    { error: "Eroare interna la procesarea inscrierii." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: RegistrationServiceError) {
  if (
    error.message === "Utilizatorul nu exista." ||
    error.message === "Turneul nu exista." ||
    error.message === "Inscrierea nu exista."
  ) {
    return 404
  }

  if (
    error.message === "Utilizatorul este deja inscris la acest turneu." ||
    error.message === "Turneul nu mai are locuri disponibile."
  ) {
    return 409
  }

  return 400
}

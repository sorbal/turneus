import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/auth/require-auth"
import {
  createRegistrationRecord,
  getRegistrations,
  RegistrationServiceError,
  type CreateRegistrationInput,
} from "@/services/registration.service"

export async function GET() {
  try {
    const registrations = await getRegistrations()

    return NextResponse.json({
      registrations,
    })
  } catch (error) {
    console.error("REGISTRATIONS_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea inscrierilor." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireAuth()
    const body = await readJsonBody(request)
    const input = parseCreateRegistrationInput(body, currentUser.id)

    if (input.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      throw new RegistrationApiError(
        "Acces interzis. Admin necesar.",
        403
      )
    }

    const registration = await createRegistrationRecord(input)

    return NextResponse.json(
      {
        message: "Inscriere creata cu succes.",
        registration,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleRegistrationApiError(error, "REGISTRATIONS_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new RegistrationApiError("Body JSON invalid.", 400)
  }
}

function parseCreateRegistrationInput(
  body: unknown,
  currentUserId: string
): CreateRegistrationInput {
  if (!isRecord(body)) {
    throw new RegistrationApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, new Set(["tournamentId", "userId"]))

  if (typeof body.tournamentId !== "string") {
    throw new RegistrationApiError("Turneu invalid.", 400)
  }

  return {
    tournamentId: body.tournamentId,
    userId: readOptionalUserId(body.userId) ?? currentUserId,
  }
}

function readOptionalUserId(value: unknown) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new RegistrationApiError("Utilizator invalid.", 400)
  }

  return value
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

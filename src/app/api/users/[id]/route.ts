import type { UserRole } from "@/generated/prisma/client"
import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  getUserById,
  resetUserPassword,
  setUserActiveStatus,
  setUserRole,
  updateUserRecord,
  UserServiceError,
  type UpdateUserInput,
} from "@/services/user.service"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const generalUpdateFields = new Set([
  "firstName",
  "lastName",
  "email",
  "username",
  "phone",
  "cityId",
  "birthDate",
  "avatarUrl",
  "bio",
])

const specialActionFields = new Set([
  "role",
  "isActive",
  "newPassword",
  "password",
  "passwordHash",
])

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await context.params
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json(
        { error: "Utilizatorul nu exista." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user,
    })
  } catch (error) {
    return handleUserApiError(error, "USER_GET_ERROR")
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentAdmin = await requireAdmin()
    const { id } = await context.params
    const body = await readJsonBody(request)

    if (isRoleActionBody(body)) {
      const role = readUserRole(body.role)
      const user = await setUserRole(id, role, currentAdmin.id)

      return NextResponse.json({
        message: "Rol actualizat cu succes.",
        user,
      })
    }

    if (isActiveStatusActionBody(body)) {
      const user = await setUserActiveStatus(
        id,
        body.isActive,
        currentAdmin.id
      )

      return NextResponse.json({
        message: body.isActive
          ? "Utilizator activat cu succes."
          : "Utilizator dezactivat cu succes.",
        user,
      })
    }

    if (isPasswordResetActionBody(body)) {
      const user = await resetUserPassword(id, body.newPassword)

      return NextResponse.json({
        message: "Parola a fost resetata cu succes.",
        user,
      })
    }

    const input = parseUpdateUserInput(body)
    const user = await updateUserRecord(id, input)

    return NextResponse.json({
      message: "Utilizator actualizat cu succes.",
      user,
    })
  } catch (error) {
    return handleUserApiError(error, "USER_PATCH_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new UserApiError("Body JSON invalid.", 400)
  }
}

function parseUpdateUserInput(body: unknown): UpdateUserInput {
  if (!isRecord(body)) {
    throw new UserApiError("Body JSON invalid.", 400)
  }

  assertSpecialActionsNotMixed(body)
  assertOnlyAllowedGeneralFields(body)

  return {
    firstName: readOptionalRequiredString(body.firstName, "Prenume invalid."),
    lastName: readOptionalRequiredString(body.lastName, "Nume invalid."),
    email: readOptionalRequiredString(body.email, "Email invalid."),
    username: readOptionalRequiredString(body.username, "Username invalid."),
    phone: readOptionalNullableString(body.phone, "Telefon invalid."),
    cityId: readOptionalNullableString(body.cityId, "Oras invalid."),
    birthDate: readOptionalNullableString(
      body.birthDate,
      "Data nasterii invalida."
    ),
    avatarUrl: readOptionalNullableString(body.avatarUrl, "Avatar invalid."),
    bio: readOptionalNullableString(body.bio, "Bio invalid."),
  }
}

function isRoleActionBody(body: unknown): body is { role: unknown } {
  return isRecord(body) && Object.keys(body).length === 1 && "role" in body
}

function isActiveStatusActionBody(
  body: unknown
): body is { isActive: boolean } {
  return (
    isRecord(body) &&
    Object.keys(body).length === 1 &&
    typeof body.isActive === "boolean"
  )
}

function isPasswordResetActionBody(
  body: unknown
): body is { newPassword: string } {
  return (
    isRecord(body) &&
    Object.keys(body).length === 1 &&
    typeof body.newPassword === "string"
  )
}

function readUserRole(value: unknown): UserRole {
  if (value === "ORGANIZER") {
    throw new UserApiError(
      "Rolul ORGANIZER se gestioneaza prin modulul Organizers.",
      400
    )
  }

  if (value !== "PLAYER" && value !== "ADMIN") {
    throw new UserApiError("Rol invalid.", 400)
  }

  return value
}

function assertSpecialActionsNotMixed(body: Record<string, unknown>) {
  const keys = Object.keys(body)
  const hasSpecialField = keys.some((key) => specialActionFields.has(key))

  if (hasSpecialField) {
    throw new UserApiError("Actiunile speciale trebuie trimise separat.", 400)
  }
}

function assertOnlyAllowedGeneralFields(body: Record<string, unknown>) {
  for (const key of Object.keys(body)) {
    if (!generalUpdateFields.has(key)) {
      throw new UserApiError(`Camp invalid: ${key}.`, 400)
    }
  }
}

function readOptionalRequiredString(value: unknown, message: string) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== "string") {
    throw new UserApiError(message, 400)
  }

  return value
}

function readOptionalNullableString(value: unknown, message: string) {
  if (value === undefined || value === null) {
    return value
  }

  if (typeof value !== "string") {
    throw new UserApiError(message, 400)
  }

  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class UserApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "UserApiError"
  }
}

function handleUserApiError(error: unknown, logCode: string) {
  if (error instanceof UserApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof UserServiceError) {
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
    { error: "Eroare interna la procesarea utilizatorului." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: UserServiceError) {
  if (
    error.message === "Exista deja un utilizator cu acest email." ||
    error.message === "Exista deja un utilizator cu acest username."
  ) {
    return 409
  }

  if (
    error.message === "Utilizatorul nu exista." ||
    error.message === "Orasul nu exista."
  ) {
    return 404
  }

  return 400
}

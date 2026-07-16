import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import { getUsers, UserServiceError } from "@/services/user.service"

export async function GET(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") ?? undefined
    const users = await getUsers(search)

    return NextResponse.json({
      users,
    })
  } catch (error) {
    return handleUserApiError(error, "USERS_GET_ERROR")
  }
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
    { error: "Eroare interna la procesarea utilizatorilor." },
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

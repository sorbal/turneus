import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/require-admin"
import { getEligibleOrganizerUsers } from "@/services/organizer.service"

export async function GET() {
  try {
    await requireAdmin()

    const users = await getEligibleOrganizerUsers()

    return NextResponse.json({
      users,
    })
  } catch (error) {
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

    console.error("ORGANIZER_ELIGIBLE_USERS_GET_ERROR", error)

    return NextResponse.json(
      { error: "Eroare interna la listarea userilor eligibili." },
      { status: 500 }
    )
  }
}

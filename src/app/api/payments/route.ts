import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/auth/require-auth"
import { generateNetopiaPaymentRequest } from "@/lib/netopia"
import {
  initiateRegistrationPayment,
  PaymentServiceError,
} from "@/services/payment.service"

export async function POST(request: Request) {
  try {
    const currentUser = await requireAuth()
    const body = await readJsonBody(request)
    const registrationId = parseRegistrationId(body)
    const payment = await initiateRegistrationPayment({
      registrationId,
      currentUserId: currentUser.id,
    })
    const netopiaRequest = generateNetopiaPaymentRequest(payment)

    return NextResponse.json(
      {
        endpoint: netopiaRequest.endpoint,
        orderId: netopiaRequest.orderId,
        amount: netopiaRequest.amount,
        currency: netopiaRequest.currency,
        fields: netopiaRequest.fields,
      },
      { status: 201 }
    )
  } catch (error) {
    return handlePaymentApiError(error, "PAYMENTS_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new PaymentApiError("Body JSON invalid.", 400)
  }
}

function parseRegistrationId(body: unknown) {
  if (!isRecord(body)) {
    throw new PaymentApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, new Set(["registrationId"]))

  if (typeof body.registrationId !== "string") {
    throw new PaymentApiError("Inscriere invalida.", 400)
  }

  return body.registrationId
}

function assertOnlyAllowedFields(
  body: Record<string, unknown>,
  allowedFields: Set<string>
) {
  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      throw new PaymentApiError(`Camp invalid: ${key}.`, 400)
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class PaymentApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "PaymentApiError"
  }
}

function handlePaymentApiError(error: unknown, logCode: string) {
  if (error instanceof PaymentApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof PaymentServiceError) {
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
    { error: "Eroare interna la initializarea platii." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: PaymentServiceError) {
  if (error.message === "Inscrierea nu exista.") {
    return 404
  }

  if (
    error.message === "Doar proprietarul inscrierii poate initia plata."
  ) {
    return 403
  }

  if (
    error.message === "Plata a fost deja confirmata." ||
    error.message === "Platile rambursate nu pot fi reinitiate automat." ||
    error.message === "Plata nu poate fi initiata dupa inceperea turneului."
  ) {
    return 409
  }

  return 400
}

import { NextResponse } from "next/server"

import { requireAuth } from "@/lib/auth/require-auth"
import {
  createUserRefundRequestRecord,
  RefundRequestServiceError,
} from "@/services/refund-request.service"

export async function POST(request: Request) {
  try {
    const currentUser = await requireAuth()
    const body = await readJsonBody(request)
    const input = parseCreateRefundRequestInput(body)
    const result = await createUserRefundRequestRecord({
      currentUserId: currentUser.id,
      reason: input.reason,
      registrationId: input.registrationId,
    })

    return NextResponse.json(
      {
        message: result.message,
        refundRequest: result.refundRequest,
      },
      {
        status: getSuccessStatus(result),
      }
    )
  } catch (error) {
    return handleRefundRequestApiError(error, "REFUND_REQUESTS_POST_ERROR")
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new RefundRequestApiError("Body JSON invalid.", 400)
  }
}

function parseCreateRefundRequestInput(body: unknown) {
  if (!isRecord(body)) {
    throw new RefundRequestApiError("Body JSON invalid.", 400)
  }

  assertOnlyAllowedFields(body, new Set(["registrationId", "reason"]))

  if (typeof body.registrationId !== "string") {
    throw new RefundRequestApiError("Inscriere invalida.", 400)
  }

  if (typeof body.reason !== "string") {
    throw new RefundRequestApiError("Motiv invalid.", 400)
  }

  return {
    reason: body.reason,
    registrationId: body.registrationId,
  }
}

function assertOnlyAllowedFields(
  body: Record<string, unknown>,
  allowedFields: Set<string>
) {
  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      throw new RefundRequestApiError(`Camp invalid: ${key}.`, 400)
    }
  }
}

function getSuccessStatus(
  result: Awaited<ReturnType<typeof createUserRefundRequestRecord>>
) {
  if (result.idempotent) {
    return 200
  }

  if (result.rejectedAutomatically) {
    return 409
  }

  return 201
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

class RefundRequestApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = "RefundRequestApiError"
  }
}

function handleRefundRequestApiError(error: unknown, logCode: string) {
  if (error instanceof RefundRequestApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  if (error instanceof RefundRequestServiceError) {
    return NextResponse.json(
      { error: error.message },
      { status: getServiceErrorStatus(error) }
    )
  }

  if (error instanceof Error && error.message === "Neautentificat.") {
    return NextResponse.json(
      { error: "Autentificare necesara." },
      { status: 401 }
    )
  }

  console.error(logCode, error)

  return NextResponse.json(
    { error: "Eroare interna la procesarea solicitarii de rambursare." },
    { status: 500 }
  )
}

function getServiceErrorStatus(error: RefundRequestServiceError) {
  if (error.code === "not_found") {
    return 404
  }

  if (error.code === "forbidden") {
    return 403
  }

  if (error.code === "conflict" || error.code === "write_conflict") {
    return 409
  }

  return 400
}

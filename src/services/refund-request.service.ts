import type { RefundRequestStatus } from "@/generated/prisma/client"
import { getPaymentStatusLabel } from "@/lib/payment-status"
import { getRefundRequestStatusLabel } from "@/lib/refund-request-status"
import { getRegistrationStatusLabel } from "@/lib/registration-status"
import {
  createUserRefundRequest,
  findRefundRequestTargetByRegistrationAndUser,
  type RefundRequestRecord,
  type RefundRequestTargetRecord,
  type UserRefundRequestWriteResult,
} from "@/repositories/refund-request.repository"

export type CreateUserRefundRequestInput = {
  registrationId: string
  reason: string
  currentUserId: string
}

export type RefundRequestDto = {
  id: string
  registrationId: string
  paymentId: string
  source: "USER" | "TOURNAMENT_CANCELLATION" | "ADMIN"
  requestedAmount: string
  refundedAmount: string | null
  status: RefundRequestStatus
  statusLabel: string
  publicMessage: string
  processedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type RefundRequestPageData = {
  registrationId: string
  registrationStatus: string
  registrationStatusLabel: string
  tournament: {
    name: string
    slug: string
    startsAt: Date
    gameName: string
    cityName: string
  }
  payment: {
    id: string
    amount: string
    status: string
    statusLabel: string
  } | null
  refundRequest: RefundRequestDto | null
  canSubmitRequest: boolean
  unavailableReason: string | null
}

const refundRequestWindowMs = 24 * 60 * 60 * 1000

export type CreateUserRefundRequestResult = {
  refundRequest: RefundRequestDto
  idempotent: boolean
  rejectedAutomatically: boolean
  message: string
}

export class RefundRequestServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | "bad_request"
      | "not_found"
      | "forbidden"
      | "conflict"
      | "write_conflict" = "bad_request"
  ) {
    super(message)
    this.name = "RefundRequestServiceError"
  }
}

export async function getUserRefundRequestPageData(
  registrationId: string,
  currentUserId: string
): Promise<RefundRequestPageData | null> {
  const normalizedRegistrationId = normalizeRequiredText(
    registrationId,
    "ID-ul inscrierii este obligatoriu."
  )
  const normalizedCurrentUserId = normalizeRequiredText(
    currentUserId,
    "ID-ul utilizatorului curent este obligatoriu."
  )

  const registration = await findRefundRequestTargetByRegistrationAndUser(
    normalizedRegistrationId,
    normalizedCurrentUserId
  )

  if (!registration) {
    return null
  }

  const now = new Date()
  const canSubmitRequest = canSubmitUserRefundRequest(registration, now)

  return {
    canSubmitRequest,
    payment: registration.payment
      ? {
          amount: registration.payment.amount.toString(),
          id: registration.payment.id,
          status: registration.payment.status,
          statusLabel: getPaymentStatusLabel(registration.payment.status),
        }
      : null,
    refundRequest: registration.refundRequest
      ? toRefundRequestDto(registration.refundRequest)
      : null,
    registrationId: registration.id,
    registrationStatus: registration.status,
    registrationStatusLabel: getRegistrationStatusLabel(registration.status),
    tournament: {
      cityName: registration.tournament.city.name,
      gameName: registration.tournament.game.name,
      name: registration.tournament.name,
      slug: registration.tournament.slug,
      startsAt: registration.tournament.startsAt,
    },
    unavailableReason: getRefundRequestUnavailableReason(
      registration,
      now,
      canSubmitRequest
    ),
  }
}

export async function createUserRefundRequestRecord(
  input: CreateUserRefundRequestInput
): Promise<CreateUserRefundRequestResult> {
  const registrationId = normalizeRequiredText(
    input.registrationId,
    "ID-ul inscrierii este obligatoriu."
  )
  const currentUserId = normalizeRequiredText(
    input.currentUserId,
    "ID-ul utilizatorului curent este obligatoriu."
  )
  const reason = normalizeReason(input.reason)

  const result = await createUserRefundRequest({
    now: new Date(),
    reason,
    registrationId,
    userId: currentUserId,
  })

  return handleWriteResult(result)
}

function handleWriteResult(
  result: UserRefundRequestWriteResult
): CreateUserRefundRequestResult {
  if (result.outcome === "not_found") {
    throw new RefundRequestServiceError("Inscrierea nu exista.", "not_found")
  }

  if (result.outcome === "forbidden") {
    throw new RefundRequestServiceError(
      "Nu poti solicita rambursarea pentru inscrierea altui utilizator.",
      "forbidden"
    )
  }

  if (result.outcome === "registration_not_confirmed") {
    throw new RefundRequestServiceError(
      "Rambursarea poate fi solicitata doar pentru inscrieri confirmate.",
      "conflict"
    )
  }

  if (
    result.outcome === "payment_not_paid" ||
    result.outcome === "payment_not_linked"
  ) {
    throw new RefundRequestServiceError(
      "Rambursarea poate fi solicitata doar pentru plati confirmate.",
      "conflict"
    )
  }

  if (result.outcome === "tournament_started") {
    throw new RefundRequestServiceError(
      "Rambursarea nu poate fi solicitata dupa inceperea turneului.",
      "conflict"
    )
  }

  if (result.outcome === "write_conflict") {
    throw new RefundRequestServiceError(
      "Solicitarea nu a putut fi procesata din cauza numarului mare de cereri simultane. Te rugam sa incerci din nou.",
      "write_conflict"
    )
  }

  if (result.outcome === "existing") {
    const refundRequest = toRefundRequestDto(result.refundRequest)

    return {
      idempotent: true,
      message: "Exista deja o solicitare de rambursare pentru aceasta inscriere.",
      refundRequest,
      rejectedAutomatically: refundRequest.status === "REJECTED",
    }
  }

  if (result.outcome === "created_rejected") {
    const refundRequest = toRefundRequestDto(result.refundRequest)

    return {
      idempotent: false,
      message:
        "Solicitarea a fost inregistrata, dar nu este eligibila deoarece a fost trimisa cu mai putin de 24 de ore inainte de inceperea turneului.",
      refundRequest,
      rejectedAutomatically: true,
    }
  }

  if (result.outcome === "created_pending") {
    const refundRequest = toRefundRequestDto(result.refundRequest)

    return {
      idempotent: false,
      message: "Solicitarea de rambursare a fost trimisa cu succes.",
      refundRequest,
      rejectedAutomatically: false,
    }
  }

  throw new RefundRequestServiceError(
    "Solicitarea nu a putut fi procesata.",
    "bad_request"
  )
}

function toRefundRequestDto(
  refundRequest: RefundRequestRecord
): RefundRequestDto {
  return {
    createdAt: refundRequest.createdAt,
    id: refundRequest.id,
    paymentId: refundRequest.paymentId,
    processedAt: refundRequest.processedAt,
    publicMessage: getRefundRequestPublicMessage(refundRequest.status),
    refundedAmount: refundRequest.refundedAmount?.toString() ?? null,
    registrationId: refundRequest.registrationId,
    requestedAmount: refundRequest.requestedAmount.toString(),
    source: refundRequest.source,
    status: refundRequest.status,
    statusLabel: getRefundRequestStatusLabel(refundRequest.status),
    updatedAt: refundRequest.updatedAt,
  }
}

function canSubmitUserRefundRequest(
  registration: RefundRequestTargetRecord,
  now: Date
) {
  return (
    registration.status === "CONFIRMED" &&
    registration.payment?.status === "PAID" &&
    !registration.refundRequest &&
    registration.tournament.startsAt.getTime() - now.getTime() >=
      refundRequestWindowMs
  )
}

function getRefundRequestUnavailableReason(
  registration: RefundRequestTargetRecord,
  now: Date,
  canSubmitRequest: boolean
) {
  if (registration.refundRequest || canSubmitRequest) {
    return null
  }

  if (
    registration.tournament.startsAt.getTime() - now.getTime() <
    refundRequestWindowMs
  ) {
    return "Termenul de rambursare a expirat. Solicitarile sunt disponibile doar cu minimum 24 de ore complete inainte de inceperea turneului."
  }

  return "Aceasta inscriere nu este eligibila pentru solicitarea unei rambursari."
}

function getRefundRequestPublicMessage(status: RefundRequestStatus) {
  if (status === "PENDING") {
    return "Solicitarea ta este in asteptare si va fi verificata de echipa Turneus."
  }

  if (status === "APPROVED") {
    return "Solicitarea ta a fost aprobata."
  }

  if (status === "PROCESSED") {
    return "Rambursarea a fost procesata."
  }

  return "Solicitarea ta nu este eligibila pentru rambursare."
}

function normalizeReason(value: string) {
  const normalizedValue = normalizeRequiredText(
    value,
    "Motivul solicitarii este obligatoriu."
  )

  if (normalizedValue.length < 10) {
    throw new RefundRequestServiceError(
      "Motivul trebuie sa aiba minimum 10 caractere."
    )
  }

  if (normalizedValue.length > 500) {
    throw new RefundRequestServiceError(
      "Motivul trebuie sa aiba maximum 500 caractere."
    )
  }

  return normalizedValue
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new RefundRequestServiceError(message)
  }

  return normalizedValue
}

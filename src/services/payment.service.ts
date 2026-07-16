import {
  applyNetopiaPaymentStatusUpdate,
  createPayment,
  findPaymentById,
  findPaymentByRegistrationId,
  updatePayment,
} from "@/repositories/payment.repository"
import { findRegistrationById } from "@/repositories/registration.repository"
import { getNetopiaConfig } from "@/lib/netopia/config"
import {
  decryptNetopiaIpn,
  NetopiaIpnError,
  type EncryptedNetopiaIpnInput,
  type NetopiaIpnPayload,
} from "@/lib/netopia/ipn"

const netopiaProvider = "NETOPIA"

export type InitiateRegistrationPaymentInput = {
  registrationId: string
  currentUserId: string
}

export type NetopiaIpnProcessingResult = {
  paymentId: string
  action: string
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
}

export class PaymentServiceError extends Error {
  constructor(
    message: string,
    readonly errorType: "business" | "permanent" | "temporary" = "business",
    readonly diagnosticCode?: string
  ) {
    super(message)
    this.name = "PaymentServiceError"
  }
}

export async function getPaymentById(id: string) {
  assertId(id, "ID-ul platii este obligatoriu.")

  return findPaymentById(id)
}

export async function getPaymentByRegistrationId(registrationId: string) {
  assertId(registrationId, "ID-ul inscrierii este obligatoriu.")

  return findPaymentByRegistrationId(registrationId)
}

export async function initiateRegistrationPayment(
  input: InitiateRegistrationPaymentInput
) {
  const registrationId = normalizeRequiredText(
    input.registrationId,
    "ID-ul inscrierii este obligatoriu."
  )
  const currentUserId = normalizeRequiredText(
    input.currentUserId,
    "ID-ul utilizatorului curent este obligatoriu."
  )

  const registration = await findRegistrationById(registrationId)

  if (!registration) {
    throw new PaymentServiceError("Inscrierea nu exista.")
  }

  if (registration.user.id !== currentUserId) {
    throw new PaymentServiceError(
      "Doar proprietarul inscrierii poate initia plata."
    )
  }

  if (registration.status !== "PENDING_PAYMENT") {
    throw new PaymentServiceError(
      "Plata poate fi initiata doar pentru inscrieri in asteptarea platii."
    )
  }

  if (registration.tournament.startsAt.getTime() <= Date.now()) {
    throw new PaymentServiceError(
      "Plata nu poate fi initiata dupa inceperea turneului."
    )
  }

  const amount = normalizePaymentAmount(registration.tournament.entryFee)
  const existingPayment = await findPaymentByRegistrationId(registration.id)

  if (!existingPayment) {
    return createPayment({
      amount,
      provider: netopiaProvider,
      providerRef: null,
      registrationId: registration.id,
      status: "PENDING",
      tournamentId: registration.tournament.id,
      userId: registration.user.id,
    })
  }

  if (existingPayment.status === "PENDING") {
    return existingPayment
  }

  if (existingPayment.status === "FAILED") {
    return updatePayment(existingPayment.id, {
      amount,
      provider: netopiaProvider,
      providerRef: null,
      status: "PENDING",
    })
  }

  if (existingPayment.status === "PAID") {
    throw new PaymentServiceError("Plata a fost deja confirmata.")
  }

  throw new PaymentServiceError(
    "Platile rambursate nu pot fi reinitiate automat."
  )
}

export async function processNetopiaIpn(
  input: EncryptedNetopiaIpnInput
): Promise<NetopiaIpnProcessingResult> {
  const payload = decryptNetopiaIpnPayload(input)
  const config = getNetopiaConfig()

  if (payload.signature !== config.signature) {
    throw new PaymentServiceError(
      "Semnatura NETOPIA invalida.",
      "permanent",
      "SIGNATURE_INVALID"
    )
  }

  if (payload.currency !== "RON") {
    throw new PaymentServiceError("Moneda NETOPIA invalida.", "permanent")
  }

  const payment = await findPaymentById(payload.orderId)

  if (!payment) {
    throw new PaymentServiceError(
      "Plata nu exista.",
      "permanent",
      "PAYMENT_NOT_FOUND"
    )
  }

  assertNetopiaAmountMatchesPayment(payload, payment.amount)

  const statusUpdate = getNetopiaStatusUpdate(payload)
  const updatedPayment = await applyNetopiaPaymentStatusUpdate(payment.id, {
    ...statusUpdate,
    providerRef: payload.purchase,
  })

  if (!updatedPayment) {
    throw new PaymentServiceError(
      "Plata nu exista.",
      "permanent",
      "PAYMENT_NOT_FOUND"
    )
  }

  return {
    paymentId: updatedPayment.id,
    action: payload.action,
    paymentStatus: updatedPayment.status,
  }
}

function decryptNetopiaIpnPayload(input: EncryptedNetopiaIpnInput) {
  try {
    return decryptNetopiaIpn(input)
  } catch (error) {
    if (error instanceof NetopiaIpnError) {
      throw new PaymentServiceError(
        "IPN NETOPIA invalid.",
        "permanent",
        error.diagnosticCode
      )
    }

    throw new PaymentServiceError(
      "IPN NETOPIA invalid.",
      "permanent",
      "XML_PARSE_FAILED"
    )
  }
}

function normalizePaymentAmount(value: { toString(): string }) {
  const amount = Number(value.toString())

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new PaymentServiceError("Suma de plata este invalida.")
  }

  return value.toString()
}

function assertNetopiaAmountMatchesPayment(
  payload: NetopiaIpnPayload,
  paymentAmount: { toString(): string }
) {
  const expectedAmount = normalizeComparableAmount(paymentAmount.toString())
  const callbackAmounts = [
    payload.invoiceAmount,
    payload.originalAmount,
    payload.processedAmount,
  ].filter((value): value is string => Boolean(value))

  if (callbackAmounts.length === 0) {
    throw new PaymentServiceError(
      "Suma NETOPIA lipseste.",
      "permanent",
      "AMOUNT_INVALID"
    )
  }

  const hasMatchingAmount = callbackAmounts.some(
    (value) => normalizeComparableAmount(value) === expectedAmount
  )

  if (!hasMatchingAmount) {
    throw new PaymentServiceError(
      "Suma NETOPIA invalida.",
      "permanent",
      "AMOUNT_INVALID"
    )
  }
}

function normalizeComparableAmount(value: string) {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    throw new PaymentServiceError(
      "Suma NETOPIA invalida.",
      "permanent",
      "AMOUNT_INVALID"
    )
  }

  return amount.toFixed(2)
}

function getNetopiaStatusUpdate(payload: NetopiaIpnPayload) {
  const action = payload.action.toLowerCase()
  const isSuccessful = payload.errorCode === "0"

  if (isSuccessful && (action === "confirmed" || action === "paid")) {
    return {
      paymentStatus: "PAID" as const,
      registrationStatus: "CONFIRMED" as const,
    }
  }

  if (
    isSuccessful &&
    (action === "paid_pending" || action === "confirmed_pending")
  ) {
    return {
      paymentStatus: "PENDING" as const,
    }
  }

  if (isSuccessful && action === "credit") {
    return {
      paymentStatus: "REFUNDED" as const,
      registrationStatus: "CANCELLED" as const,
    }
  }

  return {
    paymentStatus: "FAILED" as const,
  }
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new PaymentServiceError(message)
  }

  return normalizedValue
}

function assertId(id: string, message: string) {
  if (!id.trim()) {
    throw new PaymentServiceError(message)
  }
}

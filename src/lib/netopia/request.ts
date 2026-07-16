import type { PaymentWithRelations } from "@/repositories/payment.repository"
import { loadNetopiaCertificates } from "@/lib/netopia/certificates"
import { getNetopiaConfig, type NetopiaMode } from "@/lib/netopia/config"
import { encryptNetopiaPayload } from "@/lib/netopia/crypto"
import { buildNetopiaPaymentXml } from "@/lib/netopia/xml"

export type NetopiaPaymentRequest = {
  endpoint: string
  mode: NetopiaMode
  orderId: string
  amount: string
  currency: "RON"
  fields: {
    env_key: string
    data: string
    cipher: "aes-256-cbc"
    iv: string
  }
}

export function generateNetopiaPaymentRequest(
  payment: PaymentWithRelations
): NetopiaPaymentRequest {
  const config = getNetopiaConfig()
  const certificates = loadNetopiaCertificates(config)
  const amount = formatAmount(payment.amount)
  const confirmUrl = buildAppUrl(config.appUrl, "/api/payments/netopia/ipn")
  const returnUrl = buildAppUrl(
    config.appUrl,
    `/plata/rezultat?paymentId=${encodeURIComponent(payment.id)}`
  )
  const xml = buildNetopiaPaymentXml({
    orderId: payment.id,
    signature: config.signature,
    amount,
    currency: "RON",
    details: `Taxa participare - ${payment.tournament.name}`,
    payer: {
      email: payment.user.email,
      firstName: payment.user.firstName,
      lastName: payment.user.lastName,
    },
    confirmUrl,
    returnUrl,
  })
  const encryptedPayload = encryptNetopiaPayload(
    xml,
    certificates.publicCertificate
  )

  return {
    endpoint: config.endpoint,
    mode: config.mode,
    orderId: payment.id,
    amount,
    currency: "RON",
    fields: {
      env_key: encryptedPayload.envKey,
      data: encryptedPayload.data,
      cipher: encryptedPayload.cipher,
      iv: encryptedPayload.iv,
    },
  }
}

function formatAmount(value: { toString(): string }) {
  const amount = Number(value.toString())

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Suma NETOPIA este invalida.")
  }

  return amount.toFixed(2)
}

function buildAppUrl(appUrl: string, path: string) {
  const url = new URL(path, `${appUrl}/`)

  return url.toString()
}

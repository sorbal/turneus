import {
  constants,
  createDecipheriv,
  privateDecrypt,
} from "node:crypto"

import { loadNetopiaCertificates } from "@/lib/netopia/certificates"
import { getNetopiaConfig } from "@/lib/netopia/config"
import {
  getOptionalChild,
  getOptionalText,
  getRequiredAttribute,
  getRequiredChild,
  getRequiredText,
  parseXmlStrict,
} from "@/lib/netopia/xml-parser"

export type NetopiaIpnPayload = {
  orderId: string
  signature: string
  currency: string
  invoiceAmount: string
  action: string
  errorCode: string
  purchase: string | null
  originalAmount: string | null
  processedAmount: string | null
}

export type EncryptedNetopiaIpnInput = {
  envKey: string
  data: string
  cipher?: string | null
  iv?: string | null
}

export function decryptNetopiaIpn(
  input: EncryptedNetopiaIpnInput
): NetopiaIpnPayload {
  const config = getNetopiaConfig()
  const certificates = loadNetopiaCertificates(config)
  const decryptedXml = decryptNetopiaXml(input, certificates.privateKey)

  return parseNetopiaIpnXml(decryptedXml)
}

function decryptNetopiaXml(
  input: EncryptedNetopiaIpnInput,
  privateKey: string
) {
  if (input.cipher !== "aes-256-cbc") {
    throw new Error("Cipher NETOPIA invalid.")
  }

  if (!input.iv) {
    throw new Error("IV NETOPIA lipseste.")
  }

  const aesKey = privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(input.envKey, "base64")
  )
  const decipher = createDecipheriv(
    "aes-256-cbc",
    aesKey,
    Buffer.from(input.iv, "base64")
  )
  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(input.data, "base64")),
    decipher.final(),
  ])

  return decryptedData.toString("utf8")
}

function parseNetopiaIpnXml(xml: string): NetopiaIpnPayload {
  const order = parseXmlStrict(xml)

  if (order.name !== "order") {
    throw new Error("XML NETOPIA invalid.")
  }

  const invoice = getRequiredChild(order, "invoice")
  const mobilpay = getRequiredChild(order, "mobilpay")
  const error = getRequiredChild(mobilpay, "error")

  return {
    orderId: getRequiredAttribute(order, "id"),
    signature: getRequiredText(order, "signature"),
    currency: getRequiredAttribute(invoice, "currency"),
    invoiceAmount: getRequiredAttribute(invoice, "amount"),
    action: getRequiredText(mobilpay, "action"),
    errorCode: getRequiredAttribute(error, "code"),
    purchase: getOptionalText(mobilpay, "purchase"),
    originalAmount: getOptionalText(mobilpay, "original_amount"),
    processedAmount: getOptionalText(mobilpay, "processed_amount"),
  }
}

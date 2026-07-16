import { execFileSync } from "node:child_process"
import { createDecipheriv } from "node:crypto"

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

export type NetopiaIpnDiagnosticCode =
  | "RSA_DECRYPT_FAILED"
  | "AES_DECRYPT_FAILED"
  | "XML_PARSE_FAILED"

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
  loadNetopiaCertificates(config)
  const decryptedXml = decryptNetopiaXml(input, config.privateKeyPath)

  return parseNetopiaIpnXml(decryptedXml)
}

export class NetopiaIpnError extends Error {
  constructor(
    message: string,
    readonly diagnosticCode: NetopiaIpnDiagnosticCode
  ) {
    super(message)
    this.name = "NetopiaIpnError"
  }
}

function decryptNetopiaXml(
  input: EncryptedNetopiaIpnInput,
  privateKeyPath: string
) {
  if (input.cipher !== "aes-256-cbc") {
    throw new Error("Cipher NETOPIA invalid.")
  }

  if (!input.iv) {
    throw new Error("IV NETOPIA lipseste.")
  }

  const aesKey = decryptAesKey(input.envKey, privateKeyPath)
  const iv = Buffer.from(input.iv, "base64")

  if (aesKey.length !== 32 || iv.length !== 16) {
    throw new NetopiaIpnError(
      "Parametri criptare NETOPIA invalizi.",
      "AES_DECRYPT_FAILED"
    )
  }

  const decryptedData = decryptAesPayload(input.data, aesKey, iv)

  return decryptedData.toString("utf8")
}

function decryptAesKey(envKey: string, privateKeyPath: string) {
  try {
    const aesKey = execFileSync(
      "openssl",
      [
        "pkeyutl",
        "-decrypt",
        "-inkey",
        privateKeyPath,
        "-pkeyopt",
        "rsa_padding_mode:pkcs1",
      ],
      {
        input: Buffer.from(envKey, "base64"),
        maxBuffer: 1024,
        timeout: 3000,
        windowsHide: true,
      }
    )

    if (aesKey.length !== 32) {
      throw new Error("AES key invalid length.")
    }

    return aesKey
  } catch {
    throw new NetopiaIpnError(
      "Decriptare env_key NETOPIA esuata.",
      "RSA_DECRYPT_FAILED"
    )
  }
}

function decryptAesPayload(data: string, aesKey: Buffer, iv: Buffer) {
  try {
    const decipher = createDecipheriv("aes-256-cbc", aesKey, iv)

    return Buffer.concat([
      decipher.update(Buffer.from(data, "base64")),
      decipher.final(),
    ])
  } catch {
    throw new NetopiaIpnError(
      "Decriptare data NETOPIA esuata.",
      "AES_DECRYPT_FAILED"
    )
  }
}

function parseNetopiaIpnXml(xml: string): NetopiaIpnPayload {
  let order

  try {
    order = parseXmlStrict(xml)
  } catch {
    throw new NetopiaIpnError(
      "XML NETOPIA invalid.",
      "XML_PARSE_FAILED"
    )
  }

  if (order.name !== "order") {
    throw new NetopiaIpnError("XML NETOPIA invalid.", "XML_PARSE_FAILED")
  }

  try {
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
  } catch {
    throw new NetopiaIpnError("XML NETOPIA invalid.", "XML_PARSE_FAILED")
  }
}

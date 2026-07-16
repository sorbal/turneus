import { NextResponse } from "next/server"

import {
  PaymentServiceError,
  processNetopiaIpn,
} from "@/services/payment.service"

type NetopiaIpnFormInput = {
  envKey: string
  data: string
  cipher: string | null
  iv: string | null
}

export async function POST(request: Request) {
  try {
    const input = await readNetopiaIpnForm(request)

    await processNetopiaIpn(input)

    return createNetopiaCrcResponse()
  } catch (error) {
    return handleNetopiaIpnError(error)
  }
}

async function readNetopiaIpnForm(
  request: Request
): Promise<NetopiaIpnFormInput> {
  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    throw new PaymentServiceError(
      "Body IPN invalid.",
      "permanent",
      "FORM_INVALID"
    )
  }

  return {
    envKey: readRequiredFormValue(formData, "env_key"),
    data: readRequiredFormValue(formData, "data"),
    cipher: readOptionalFormValue(formData, "cipher"),
    iv: readOptionalFormValue(formData, "iv"),
  }
}

function readRequiredFormValue(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    throw new PaymentServiceError(
      `Camp IPN lipsa: ${key}.`,
      "permanent",
      "FORM_INVALID"
    )
  }

  return normalizeBase64FormValue(value)
}

function readOptionalFormValue(formData: FormData, key: string) {
  const value = formData.get(key)

  if (value === null) {
    return null
  }

  if (typeof value !== "string") {
    throw new PaymentServiceError(
      `Camp IPN invalid: ${key}.`,
      "permanent",
      "FORM_INVALID"
    )
  }

  return value.trim() ? normalizeBase64FormValue(value) : null
}

function handleNetopiaIpnError(error: unknown) {
  if (error instanceof PaymentServiceError) {
    console.error(error.diagnosticCode ?? "NETOPIA_IPN_ERROR")

    if (error.errorType === "permanent") {
      return createNetopiaCrcResponse({
        errorType: 2,
        errorCode: 1,
        message: error.message,
      })
    }

    return createNetopiaCrcResponse({
      errorType: 1,
      errorCode: 1,
      message: "Eroare temporara la procesarea IPN.",
    })
  }

  console.error("NETOPIA_IPN_ERROR")

  return createNetopiaCrcResponse({
    errorType: 1,
    errorCode: 1,
    message: "Eroare temporara la procesarea IPN.",
  })
}

function normalizeBase64FormValue(value: string) {
  return value.trim().replaceAll(" ", "+")
}

function createNetopiaCrcResponse(error?: {
  errorType: 1 | 2
  errorCode: number
  message: string
}) {
  const body = error
    ? `<?xml version="1.0" encoding="utf-8"?><crc error_type="${error.errorType}" error_code="${error.errorCode}">${escapeXml(error.message)}</crc>`
    : '<?xml version="1.0" encoding="utf-8"?><crc></crc>'

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

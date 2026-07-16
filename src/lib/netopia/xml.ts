export type NetopiaPaymentXmlInput = {
  orderId: string
  signature: string
  amount: string
  currency: "RON"
  details: string
  payer: {
    email: string
    firstName: string
    lastName: string
  }
  confirmUrl: string
  returnUrl: string
}

export function buildNetopiaPaymentXml(input: NetopiaPaymentXmlInput) {
  const timestamp = formatNetopiaTimestamp(new Date())

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<order type="card" id="${escapeXml(input.orderId)}" timestamp="${timestamp}">`,
    `<signature>${escapeXml(input.signature)}</signature>`,
    `<invoice currency="${input.currency}" amount="${escapeXml(input.amount)}">`,
    `<details>${escapeXml(input.details)}</details>`,
    "<contact_info>",
    '<billing type="person">',
    `<first_name>${escapeXml(input.payer.firstName)}</first_name>`,
    `<last_name>${escapeXml(input.payer.lastName)}</last_name>`,
    `<email>${escapeXml(input.payer.email)}</email>`,
    "</billing>",
    "</contact_info>",
    "</invoice>",
    "<ipn_cipher>aes-256-cbc</ipn_cipher>",
    "<url>",
    `<confirm>${escapeXml(input.confirmUrl)}</confirm>`,
    `<return>${escapeXml(input.returnUrl)}</return>`,
    "</url>",
    "</order>",
  ].join("")
}

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function formatNetopiaTimestamp(date: Date) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
    padDatePart(date.getHours()),
    padDatePart(date.getMinutes()),
    padDatePart(date.getSeconds()),
  ].join("")
}

function padDatePart(value: number) {
  return value.toString().padStart(2, "0")
}

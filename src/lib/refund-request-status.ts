import type { RefundRequestStatus } from "@/generated/prisma/client"

const refundRequestStatusLabels: Record<RefundRequestStatus, string> = {
  PENDING: "Solicitare in asteptare",
  APPROVED: "Solicitare aprobata",
  REJECTED: "Solicitare respinsa",
  PROCESSED: "Rambursare procesata",
}

export function getRefundRequestStatusLabel(status: RefundRequestStatus) {
  return refundRequestStatusLabels[status]
}

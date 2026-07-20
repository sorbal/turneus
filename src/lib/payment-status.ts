import type { PaymentStatus } from "@/generated/prisma/client"

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "In asteptare",
  PAID: "Platita",
  FAILED: "Esuata",
  REFUNDED: "Rambursata",
}

export function getPaymentStatusLabel(status: PaymentStatus) {
  return paymentStatusLabels[status]
}

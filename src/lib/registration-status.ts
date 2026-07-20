import type { RegistrationStatus } from "@/generated/prisma/client"

const registrationStatusLabels: Record<RegistrationStatus, string> = {
  PENDING_PAYMENT: "Plata in asteptare",
  CONFIRMED: "Confirmata",
  CANCELLED: "Anulata",
  CHECKED_IN: "Check-in efectuat",
}

export function getRegistrationStatusLabel(status: RegistrationStatus) {
  return registrationStatusLabels[status]
}

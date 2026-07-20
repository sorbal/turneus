import type { UserRole } from "@/generated/prisma/client"
import { getPaymentStatusLabel } from "@/lib/payment-status"
import { getRefundRequestStatusLabel } from "@/lib/refund-request-status"
import { getRegistrationStatusLabel } from "@/lib/registration-status"
import {
  findAccountRegistrationsByUserId,
  findAccountTicketByRegistrationIdAndUserId,
} from "@/repositories/account.repository"

export type AccountCurrentUser = {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
}

export type AccountDashboard = {
  user: AccountCurrentUser & {
    fullName: string
  }
  registrations: AccountRegistrationItem[]
}

export type AccountRegistrationItem = {
  id: string
  status: string
  statusLabel: string
  canRequestRefund: boolean
  createdAt: Date
  checkedInAt: Date | null
  tournament: {
    name: string
    slug: string
    startsAt: Date
    status: string
    entryFee: string
    gameName: string
    cityName: string
  }
  payment: {
    id: string
    amount: string
    status: string
    statusLabel: string
    provider: string
  } | null
  refundRequest: {
    id: string
    status: string
    statusLabel: string
    publicMessage: string
    createdAt: Date
    updatedAt: Date
  } | null
}

const refundRequestWindowMs = 24 * 60 * 60 * 1000

export type AccountTicket = {
  id: string
  status: string
  statusLabel: string
  createdAt: Date
  checkedInAt: Date | null
  participant: {
    fullName: string
    username: string
  }
  tournament: {
    name: string
    slug: string
    startsAt: Date
    gameName: string
    cityName: string
    venueName: string | null
    venueAddress: string | null
  }
  payment: {
    id: string
    amount: string
    status: string
    statusLabel: string
    provider: string
  } | null
}

export async function getAccountDashboard(
  currentUser: AccountCurrentUser
): Promise<AccountDashboard> {
  const registrations = await findAccountRegistrationsByUserId(currentUser.id)
  const now = new Date()

  return {
    user: {
      ...currentUser,
      fullName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
    },
    registrations: sortAccountRegistrations(
      registrations.map((registration) => ({
        id: registration.id,
        status: registration.status,
        statusLabel: getRegistrationStatusLabel(registration.status),
        canRequestRefund: canRequestRefundForAccountRegistration(
          registration,
          now
        ),
        createdAt: registration.createdAt,
        checkedInAt: registration.checkedInAt,
        tournament: {
          name: registration.tournament.name,
          slug: registration.tournament.slug,
          startsAt: registration.tournament.startsAt,
          status: registration.tournament.status,
          entryFee: registration.tournament.entryFee.toString(),
          gameName: registration.tournament.game.name,
          cityName: registration.tournament.city.name,
        },
        payment: registration.payment
          ? {
              id: registration.payment.id,
              amount: registration.payment.amount.toString(),
              status: registration.payment.status,
              statusLabel: getPaymentStatusLabel(registration.payment.status),
              provider: registration.payment.provider,
            }
          : null,
        refundRequest: registration.refundRequest
          ? {
              createdAt: registration.refundRequest.createdAt,
              id: registration.refundRequest.id,
              publicMessage: getAccountRefundRequestPublicMessage(
                registration.refundRequest.status
              ),
              status: registration.refundRequest.status,
              statusLabel: getRefundRequestStatusLabel(
                registration.refundRequest.status
              ),
              updatedAt: registration.refundRequest.updatedAt,
            }
          : null,
      }))
    ),
  }
}

function canRequestRefundForAccountRegistration(
  registration: Awaited<
    ReturnType<typeof findAccountRegistrationsByUserId>
  >[number],
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

export async function getAccountTicketByRegistrationId(
  registrationId: string,
  currentUserId: string
): Promise<AccountTicket | null> {
  const normalizedRegistrationId = registrationId.trim()
  const normalizedCurrentUserId = currentUserId.trim()

  if (!normalizedRegistrationId || !normalizedCurrentUserId) {
    return null
  }

  const registration = await findAccountTicketByRegistrationIdAndUserId(
    normalizedRegistrationId,
    normalizedCurrentUserId
  )

  if (
    !registration ||
    (registration.status !== "CONFIRMED" &&
      registration.status !== "CHECKED_IN")
  ) {
    return null
  }

  return {
    id: registration.id,
    status: registration.status,
    statusLabel: getRegistrationStatusLabel(registration.status),
    createdAt: registration.createdAt,
    checkedInAt: registration.checkedInAt,
    participant: {
      fullName:
        `${registration.user.firstName} ${registration.user.lastName}`.trim(),
      username: registration.user.username,
    },
    tournament: {
      name: registration.tournament.name,
      slug: registration.tournament.slug,
      startsAt: registration.tournament.startsAt,
      gameName: registration.tournament.game.name,
      cityName: registration.tournament.city.name,
      venueName: registration.tournament.venue?.name ?? null,
      venueAddress: registration.tournament.venue?.address ?? null,
    },
    payment: registration.payment
      ? {
          id: registration.payment.id,
          amount: registration.payment.amount.toString(),
          status: registration.payment.status,
          statusLabel: getPaymentStatusLabel(registration.payment.status),
          provider: registration.payment.provider,
        }
      : null,
  }
}

function sortAccountRegistrations(
  registrations: AccountRegistrationItem[]
): AccountRegistrationItem[] {
  const now = Date.now()

  return [...registrations].sort((first, second) => {
    const firstTime = first.tournament.startsAt.getTime()
    const secondTime = second.tournament.startsAt.getTime()
    const firstIsUpcoming = firstTime >= now
    const secondIsUpcoming = secondTime >= now

    if (firstIsUpcoming !== secondIsUpcoming) {
      return firstIsUpcoming ? -1 : 1
    }

    if (firstIsUpcoming && secondIsUpcoming) {
      return firstTime - secondTime || first.id.localeCompare(second.id)
    }

    return secondTime - firstTime || first.id.localeCompare(second.id)
  })
}

function getAccountRefundRequestPublicMessage(status: string) {
  if (status === "REJECTED") {
    return "Solicitarea de rambursare nu este eligibila."
  }

  if (status === "PENDING") {
    return "Solicitarea este in asteptare."
  }

  if (status === "APPROVED") {
    return "Solicitarea a fost aprobata."
  }

  return "Rambursarea a fost procesata."
}

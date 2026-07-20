import type { UserRole } from "@/generated/prisma/client"
import { getPaymentStatusLabel } from "@/lib/payment-status"
import { getRegistrationStatusLabel } from "@/lib/registration-status"
import { findAccountRegistrationsByUserId } from "@/repositories/account.repository"

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
}

export async function getAccountDashboard(
  currentUser: AccountCurrentUser
): Promise<AccountDashboard> {
  const registrations = await findAccountRegistrationsByUserId(currentUser.id)

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
      }))
    ),
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

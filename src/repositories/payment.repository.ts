import type {
  Payment,
  PaymentStatus,
  Registration,
  RegistrationStatus,
  Tournament,
  User,
} from "@/generated/prisma/client"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type PaymentWithRelations = Payment & {
  user: Pick<User, "id" | "email" | "username" | "firstName" | "lastName">
  tournament: Pick<Tournament, "id" | "name" | "slug" | "entryFee" | "startsAt">
  registration: Pick<
    Registration,
    "id" | "status" | "userId" | "tournamentId"
  > | null
}

export type PaymentCreateData = {
  userId: string
  tournamentId: string
  registrationId: string
  amount: Prisma.Decimal | number | string
  status: PaymentStatus
  provider: string
  providerRef?: string | null
}

export type PaymentUpdateData = {
  amount?: Prisma.Decimal | number | string
  status?: PaymentStatus
  provider?: string
  providerRef?: string | null
}

export type NetopiaPaymentStatusUpdate = {
  paymentStatus: PaymentStatus
  registrationStatus?: RegistrationStatus
  providerRef?: string | null
}

export async function findPaymentById(
  id: string
): Promise<PaymentWithRelations | null> {
  return prisma.payment.findUnique({
    where: {
      id,
    },
    include: paymentInclude,
  })
}

export async function findPaymentByRegistrationId(
  registrationId: string
): Promise<PaymentWithRelations | null> {
  return prisma.payment.findUnique({
    where: {
      registrationId,
    },
    include: paymentInclude,
  })
}

export async function createPayment(
  data: PaymentCreateData
): Promise<PaymentWithRelations> {
  return prisma.payment.create({
    data,
    include: paymentInclude,
  })
}

export async function updatePayment(
  id: string,
  data: PaymentUpdateData
): Promise<PaymentWithRelations> {
  return prisma.payment.update({
    where: {
      id,
    },
    data,
    include: paymentInclude,
  })
}

export async function applyNetopiaPaymentStatusUpdate(
  id: string,
  data: NetopiaPaymentStatusUpdate
): Promise<PaymentWithRelations | null> {
  return prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findUnique({
      where: {
        id,
      },
      include: paymentInclude,
    })

    if (!existingPayment) {
      return null
    }

    const nextPaymentStatus = getNextPaymentStatus(
      existingPayment.status,
      data.paymentStatus
    )
    const nextProviderRef = shouldUpdateProviderRef(
      existingPayment.status,
      data.paymentStatus
    )
      ? data.providerRef ?? existingPayment.providerRef
      : existingPayment.providerRef
    const payment = await tx.payment.update({
      where: {
        id,
      },
      data: {
        status: nextPaymentStatus,
        providerRef: nextProviderRef,
      },
      include: paymentInclude,
    })

    const nextRegistrationStatus = data.registrationStatus

    if (
      payment.registrationId &&
      nextRegistrationStatus &&
      shouldUpdateRegistration(existingPayment.status, data)
    ) {
      await tx.registration.update({
        where: {
          id: payment.registrationId,
        },
        data: {
          status: nextRegistrationStatus,
        },
      })
    }

    return payment
  })
}

function getNextPaymentStatus(
  currentStatus: PaymentStatus,
  requestedStatus: PaymentStatus
) {
  if (
    currentStatus === "PAID" &&
    (requestedStatus === "FAILED" || requestedStatus === "PENDING")
  ) {
    return currentStatus
  }

  if (currentStatus === "REFUNDED" && requestedStatus !== "REFUNDED") {
    return currentStatus
  }

  return requestedStatus
}

function shouldUpdateRegistration(
  currentPaymentStatus: PaymentStatus,
  data: NetopiaPaymentStatusUpdate
) {
  if (!data.registrationStatus) {
    return false
  }

  if (
    currentPaymentStatus === "PAID" &&
    data.paymentStatus !== "PAID" &&
    data.paymentStatus !== "REFUNDED"
  ) {
    return false
  }

  if (currentPaymentStatus === "REFUNDED" && data.paymentStatus !== "REFUNDED") {
    return false
  }

  return true
}

function shouldUpdateProviderRef(
  currentStatus: PaymentStatus,
  requestedStatus: PaymentStatus
) {
  if (
    currentStatus === "PAID" &&
    (requestedStatus === "FAILED" || requestedStatus === "PENDING")
  ) {
    return false
  }

  if (currentStatus === "REFUNDED" && requestedStatus !== "REFUNDED") {
    return false
  }

  return true
}

const paymentInclude = {
  user: {
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
    },
  },
  tournament: {
    select: {
      id: true,
      name: true,
      slug: true,
      entryFee: true,
      startsAt: true,
    },
  },
  registration: {
    select: {
      id: true,
      status: true,
      userId: true,
      tournamentId: true,
    },
  },
} as const

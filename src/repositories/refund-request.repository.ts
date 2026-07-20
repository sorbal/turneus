import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type RefundRequestRecord = Prisma.RefundRequestGetPayload<{
  select: typeof refundRequestSelect
}>

export type RefundRequestTargetRecord = Prisma.RegistrationGetPayload<{
  select: typeof refundRequestTargetSelect
}>

export type UserRefundRequestWriteResult =
  | {
      outcome: "created_pending" | "created_rejected" | "existing"
      refundRequest: RefundRequestRecord
    }
  | {
      outcome:
        | "not_found"
        | "forbidden"
        | "registration_not_confirmed"
        | "payment_not_paid"
        | "payment_not_linked"
        | "tournament_started"
        | "write_conflict"
    }

export type CreateUserRefundRequestInput = {
  registrationId: string
  userId: string
  reason: string
  now: Date
}

const refundWindowMs = 24 * 60 * 60 * 1000

export async function findRefundRequestByRegistrationAndUser(
  registrationId: string,
  userId: string
): Promise<RefundRequestRecord | null> {
  return prisma.refundRequest.findFirst({
    where: {
      registrationId,
      userId,
    },
    select: refundRequestSelect,
  })
}

export async function findRefundRequestTargetByRegistrationAndUser(
  registrationId: string,
  userId: string
): Promise<RefundRequestTargetRecord | null> {
  return prisma.registration.findFirst({
    where: {
      id: registrationId,
      userId,
    },
    select: refundRequestTargetSelect,
  })
}

export async function createUserRefundRequest(
  input: CreateUserRefundRequestInput
): Promise<UserRefundRequestWriteResult> {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await createUserRefundRequestTransaction(input)
    } catch (error) {
      if (isPrismaErrorCode(error, "P2002")) {
        const existingRefundRequest =
          await findRefundRequestByRegistrationAndUser(
            input.registrationId,
            input.userId
          )

        if (existingRefundRequest) {
          return {
            outcome: "existing",
            refundRequest: existingRefundRequest,
          }
        }
      }

      if (isPrismaErrorCode(error, "P2034") && attempt < maxAttempts) {
        continue
      }

      if (isPrismaErrorCode(error, "P2034")) {
        return {
          outcome: "write_conflict",
        }
      }

      throw error
    }
  }

  return {
    outcome: "write_conflict",
  }
}

async function createUserRefundRequestTransaction(
  input: CreateUserRefundRequestInput
): Promise<UserRefundRequestWriteResult> {
  return prisma.$transaction(
    async (tx) => {
      const registration = await tx.registration.findUnique({
        where: {
          id: input.registrationId,
        },
        select: refundRequestTargetSelect,
      })

      if (!registration) {
        return {
          outcome: "not_found",
        }
      }

      if (registration.userId !== input.userId) {
        return {
          outcome: "forbidden",
        }
      }

      if (registration.refundRequest) {
        return {
          outcome: "existing",
          refundRequest: registration.refundRequest,
        }
      }

      if (registration.status !== "CONFIRMED") {
        return {
          outcome: "registration_not_confirmed",
        }
      }

      if (!registration.payment) {
        return {
          outcome: "payment_not_paid",
        }
      }

      if (registration.payment.registrationId !== registration.id) {
        return {
          outcome: "payment_not_linked",
        }
      }

      if (registration.payment.status !== "PAID") {
        return {
          outcome: "payment_not_paid",
        }
      }

      if (registration.tournament.startsAt.getTime() <= input.now.getTime()) {
        return {
          outcome: "tournament_started",
        }
      }

      const isEligible =
        registration.tournament.startsAt.getTime() - input.now.getTime() >=
        refundWindowMs

      const refundRequest = await tx.refundRequest.create({
        data: {
          adminNote: isEligible
            ? null
            : "Solicitarea a fost respinsa automat deoarece a fost trimisa cu mai putin de 24 de ore inainte de inceperea turneului.",
          paymentId: registration.payment.id,
          processedAt: isEligible ? null : input.now,
          processedByUserId: null,
          reason: input.reason,
          refundedAmount: null,
          registrationId: registration.id,
          requestedAmount: registration.payment.amount,
          source: "USER",
          status: isEligible ? "PENDING" : "REJECTED",
          userId: input.userId,
        },
        select: refundRequestSelect,
      })

      return {
        outcome: isEligible ? "created_pending" : "created_rejected",
        refundRequest,
      }
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  )
}

function isPrismaErrorCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  )
}

const refundRequestSelect = {
  id: true,
  registrationId: true,
  paymentId: true,
  userId: true,
  source: true,
  requestedAmount: true,
  refundedAmount: true,
  status: true,
  processedAt: true,
  createdAt: true,
  updatedAt: true,
} as const

const refundRequestTargetSelect = {
  id: true,
  userId: true,
  status: true,
  createdAt: true,
  tournament: {
    select: {
      name: true,
      slug: true,
      startsAt: true,
      game: {
        select: {
          name: true,
        },
      },
      city: {
        select: {
          name: true,
        },
      },
    },
  },
  payment: {
    select: {
      id: true,
      amount: true,
      status: true,
      registrationId: true,
    },
  },
  refundRequest: {
    select: refundRequestSelect,
  },
} as const

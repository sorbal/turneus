"use client"

import type { UserRole } from "@/generated/prisma/client"
import { CircleCheck, CircleOff, Pencil, Shield, ShieldOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { AdminUserPasswordReset } from "@/components/admin/admin-user-password-reset"
import { Button } from "@/components/ui/button"

type AdminUserActionsProps = {
  id: string
  fullName: string
  role: UserRole
  isActive: boolean
  currentAdminId: string
}

type UserApiResponse = {
  error?: string
  message?: string
}

type ActionType = "status" | "role" | "password"

export function AdminUserActions({
  id,
  fullName,
  role,
  isActive,
  currentAdminId,
}: AdminUserActionsProps) {
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isPending = pendingAction !== null
  const isCurrentAdmin = id === currentAdminId
  const canChangeRole = role === "PLAYER" || role === "ADMIN"
  const nextRole: UserRole = role === "ADMIN" ? "PLAYER" : "ADMIN"

  async function handleActiveStatusToggle() {
    setError(null)
    setSuccess(null)

    if (isCurrentAdmin && isActive) {
      setError("Nu iti poti dezactiva propriul cont.")
      return
    }

    setPendingAction("status")

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      })
      const data = await readUserApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Statusul utilizatorului nu a putut fi actualizat.")
        return
      }

      setSuccess(data.message ?? "Statusul utilizatorului a fost actualizat.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la actualizarea statusului.")
    } finally {
      setPendingAction(null)
    }
  }

  async function handleRoleToggle() {
    setError(null)
    setSuccess(null)

    if (isCurrentAdmin) {
      setError("Nu iti poti schimba propriul rol.")
      return
    }

    setPendingAction("role")

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: nextRole,
        }),
      })
      const data = await readUserApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Rolul utilizatorului nu a putut fi actualizat.")
        return
      }

      setSuccess(data.message ?? "Rolul utilizatorului a fost actualizat.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la actualizarea rolului.")
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {isPending ? (
          <Button disabled size="sm" variant="outline">
            <Pencil />
            Editeaza
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/utilizatori/${id}/editeaza`}>
              <Pencil />
              Editeaza
            </Link>
          </Button>
        )}

        <Button
          disabled={isPending || (isCurrentAdmin && isActive)}
          onClick={handleActiveStatusToggle}
          size="sm"
          type="button"
          variant="secondary"
        >
          {isActive ? <CircleOff /> : <CircleCheck />}
          {pendingAction === "status"
            ? "Se actualizeaza..."
            : isActive
              ? "Dezactiveaza"
              : "Activeaza"}
        </Button>

        {canChangeRole ? (
          <Button
            disabled={isPending || isCurrentAdmin}
            onClick={handleRoleToggle}
            size="sm"
            type="button"
            variant="secondary"
          >
            {role === "ADMIN" ? <ShieldOff /> : <Shield />}
            {pendingAction === "role"
              ? "Se actualizeaza..."
              : role === "ADMIN"
                ? "Retrogradeaza la PLAYER"
                : "Promoveaza la ADMIN"}
          </Button>
        ) : null}

        <AdminUserPasswordReset
          disabled={isPending}
          fullName={fullName}
          id={id}
          onPendingChange={(isPasswordPending) =>
            setPendingAction(isPasswordPending ? "password" : null)
          }
        />
      </div>

      {error ? (
        <p className="max-w-sm text-right text-xs text-destructive">{error}</p>
      ) : null}

      {success ? (
        <p className="max-w-sm text-right text-xs text-emerald-400">
          {success}
        </p>
      ) : null}
    </div>
  )
}

async function readUserApiResponse(response: Response): Promise<UserApiResponse> {
  try {
    const data: unknown = await response.json()

    if (!isRecord(data)) {
      return {}
    }

    return {
      error: readOptionalString(data.error),
      message: readOptionalString(data.message),
    }
  } catch {
    return {}
  }
}

function readOptionalString(value: unknown) {
  return typeof value === "string" ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

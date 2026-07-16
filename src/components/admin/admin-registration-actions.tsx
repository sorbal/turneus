"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import type { RegistrationWithRelations } from "@/repositories/registration.repository"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type AdminRegistrationActionsProps = {
  id: string
  playerName: string
  tournamentName: string
  status: RegistrationWithRelations["status"]
}

type RegistrationApiResponse = {
  error?: string
  message?: string
}

type Operation = "check-in" | "cancel"

export function AdminRegistrationActions({
  id,
  playerName,
  tournamentName,
  status,
}: AdminRegistrationActionsProps) {
  const router = useRouter()
  const [activeOperation, setActiveOperation] = useState<Operation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isBusy = activeOperation !== null
  const canCheckIn = status === "CONFIRMED"
  const canCancel =
    status === "PENDING_PAYMENT" ||
    status === "CONFIRMED" ||
    status === "CHECKED_IN"

  if (!canCheckIn && !canCancel) {
    return <span className="text-xs text-muted-foreground">-</span>
  }

  async function handleAction(action: Operation) {
    setError(null)
    setSuccess(null)
    setActiveOperation(action)

    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      })
      const data = await readRegistrationApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultErrorMessage(action))
        return
      }

      setSuccess(data.message ?? getDefaultSuccessMessage(action))
      router.refresh()
    } catch {
      setError(getUnexpectedErrorMessage(action))
    } finally {
      setActiveOperation(null)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {canCheckIn ? (
          <Button
            disabled={isBusy}
            onClick={() => handleAction("check-in")}
            size="sm"
            type="button"
            variant="outline"
          >
            <CheckCircle2 />
            {activeOperation === "check-in" ? "Se confirma..." : "Check-in"}
          </Button>
        ) : null}

        {canCancel ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isBusy}
                size="sm"
                type="button"
                variant="destructive"
              >
                <XCircle />
                {activeOperation === "cancel" ? "Se anuleaza..." : "Anuleaza"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Anulezi inscrierea?</AlertDialogTitle>
                <AlertDialogDescription>
                  Inscrierea jucatorului "{playerName}" la turneul "
                  {tournamentName}" va fi marcata ca anulata. Actiunea nu
                  sterge fizic inscrierea.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isBusy}>Renunta</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    disabled={isBusy}
                    onClick={() => handleAction("cancel")}
                    type="button"
                    variant="destructive"
                  >
                    <XCircle />
                    Confirma anularea
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
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

function getDefaultErrorMessage(action: Operation) {
  return action === "check-in"
    ? "Check-in-ul nu a putut fi realizat."
    : "Inscrierea nu a putut fi anulata."
}

function getDefaultSuccessMessage(action: Operation) {
  return action === "check-in"
    ? "Check-in realizat cu succes."
    : "Inscriere anulata cu succes."
}

function getUnexpectedErrorMessage(action: Operation) {
  return action === "check-in"
    ? "A aparut o eroare la check-in."
    : "A aparut o eroare la anularea inscrierii."
}

async function readRegistrationApiResponse(
  response: Response
): Promise<RegistrationApiResponse> {
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

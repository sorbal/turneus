"use client"

import { CheckCircle2, Pencil, Play, Rocket, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import type { TournamentWithRelations } from "@/repositories/tournament.repository"
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

type AdminTournamentActionsProps = {
  id: string
  name: string
  status: TournamentWithRelations["status"]
}

type TournamentApiResponse = {
  error?: string
  message?: string
}

type Operation = "open" | "start" | "complete" | "delete"

export function AdminTournamentActions({
  id,
  name,
  status,
}: AdminTournamentActionsProps) {
  const router = useRouter()
  const [activeOperation, setActiveOperation] = useState<Operation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isBusy = activeOperation !== null
  const lifecycleAction = getLifecycleAction(status)

  async function handleLifecycleAction(action: Exclude<Operation, "delete">) {
    setError(null)
    setSuccess(null)
    setActiveOperation(action)

    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      })
      const data = await readTournamentApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultLifecycleErrorMessage(action))
        return
      }

      setSuccess(data.message ?? getDefaultLifecycleSuccessMessage(action))
      router.refresh()
    } catch {
      setError(getUnexpectedLifecycleErrorMessage(action))
    } finally {
      setActiveOperation(null)
    }
  }

  async function handleDelete() {
    setError(null)
    setSuccess(null)
    setActiveOperation("delete")

    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: "DELETE",
      })
      const data = await readTournamentApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Turneul nu a putut fi sters.")
        return
      }

      setSuccess(data.message ?? "Turneu sters cu succes.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la stergerea turneului.")
    } finally {
      setActiveOperation(null)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {isBusy ? (
          <Button disabled size="sm" variant="outline">
            <Pencil />
            Editeaza
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/turnee/${id}/editeaza`}>
              <Pencil />
              Editeaza
            </Link>
          </Button>
        )}

        {lifecycleAction ? (
          <Button
            disabled={isBusy}
            onClick={() => handleLifecycleAction(lifecycleAction)}
            size="sm"
            type="button"
            variant="outline"
          >
            {getLifecycleIcon(lifecycleAction)}
            {activeOperation === lifecycleAction
              ? getLifecycleLoadingLabel(lifecycleAction)
              : getLifecycleLabel(lifecycleAction)}
          </Button>
        ) : null}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isBusy}
              size="sm"
              type="button"
              variant="destructive"
            >
              <Trash2 />
              {activeOperation === "delete" ? "Se sterge..." : "Sterge"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Stergi turneul?</AlertDialogTitle>
              <AlertDialogDescription>
                Turneul "{name}" va fi sters definitiv doar daca este in status
                DRAFT si nu are relatii copil. Actiunea nu poate fi anulata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isBusy}>
                Renunta
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  disabled={isBusy}
                  onClick={handleDelete}
                  type="button"
                  variant="destructive"
                >
                  <Trash2 />
                  Confirma stergerea
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

function getLifecycleAction(
  status: TournamentWithRelations["status"]
): Exclude<Operation, "delete"> | null {
  if (status === "DRAFT") {
    return "open"
  }

  if (status === "OPEN" || status === "FULL") {
    return "start"
  }

  if (status === "IN_PROGRESS") {
    return "complete"
  }

  return null
}

function getLifecycleIcon(action: Exclude<Operation, "delete">) {
  if (action === "open") {
    return <Rocket />
  }

  if (action === "start") {
    return <Play />
  }

  return <CheckCircle2 />
}

function getLifecycleLabel(action: Exclude<Operation, "delete">) {
  if (action === "open") {
    return "Deschide turneu"
  }

  if (action === "start") {
    return "Porneste turneu"
  }

  return "Finalizeaza turneu"
}

function getLifecycleLoadingLabel(action: Exclude<Operation, "delete">) {
  if (action === "open") {
    return "Se deschide..."
  }

  if (action === "start") {
    return "Se porneste..."
  }

  return "Se finalizeaza..."
}

function getDefaultLifecycleErrorMessage(
  action: Exclude<Operation, "delete">
) {
  if (action === "open") {
    return "Turneul nu a putut fi deschis."
  }

  if (action === "start") {
    return "Turneul nu a putut fi pornit."
  }

  return "Turneul nu a putut fi finalizat."
}

function getDefaultLifecycleSuccessMessage(
  action: Exclude<Operation, "delete">
) {
  if (action === "open") {
    return "Turneu deschis cu succes."
  }

  if (action === "start") {
    return "Turneu pornit cu succes."
  }

  return "Turneu finalizat cu succes."
}

function getUnexpectedLifecycleErrorMessage(
  action: Exclude<Operation, "delete">
) {
  if (action === "open") {
    return "A aparut o eroare la deschiderea turneului."
  }

  if (action === "start") {
    return "A aparut o eroare la pornirea turneului."
  }

  return "A aparut o eroare la finalizarea turneului."
}

async function readTournamentApiResponse(
  response: Response
): Promise<TournamentApiResponse> {
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

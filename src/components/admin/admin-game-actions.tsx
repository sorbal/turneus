"use client"

import { CircleCheck, CircleOff, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
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

type AdminGameActionsProps = {
  id: string
  name: string
  isActive: boolean
}

type GameApiResponse = {
  error?: string
  message?: string
}

type ActionType = "toggle" | "delete"

export function AdminGameActions({
  id,
  name,
  isActive,
}: AdminGameActionsProps) {
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isPending = pendingAction !== null

  async function handleToggleActive() {
    setError(null)
    setSuccess(null)
    setPendingAction("toggle")

    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      })
      const data = await readGameApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Statusul jocului nu a putut fi actualizat.")
        return
      }

      setSuccess(data.message ?? "Statusul jocului a fost actualizat.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la actualizarea statusului.")
    } finally {
      setPendingAction(null)
    }
  }

  async function handleDelete() {
    setError(null)
    setSuccess(null)
    setPendingAction("delete")

    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      })
      const data = await readGameApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Jocul nu a putut fi sters.")
        return
      }

      setSuccess(data.message ?? "Joc sters cu succes.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la stergerea jocului.")
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
            <Link href={`/admin/jocuri/${id}/editeaza`}>
              <Pencil />
              Editeaza
            </Link>
          </Button>
        )}

        <Button
          disabled={isPending}
          onClick={handleToggleActive}
          size="sm"
          type="button"
          variant="secondary"
        >
          {isActive ? <CircleOff /> : <CircleCheck />}
          {pendingAction === "toggle"
            ? "Se actualizeaza..."
            : isActive
              ? "Dezactiveaza"
              : "Activeaza"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isPending}
              size="sm"
              type="button"
              variant="destructive"
            >
              <Trash2 />
              {pendingAction === "delete" ? "Se sterge..." : "Sterge"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Stergi jocul?</AlertDialogTitle>
              <AlertDialogDescription>
                Jocul "{name}" va fi sters definitiv daca nu este folosit in
                turnee, clasamente sau reclame. Actiunea nu poate fi anulata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>
                Renunta
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  disabled={isPending}
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

async function readGameApiResponse(response: Response): Promise<GameApiResponse> {
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

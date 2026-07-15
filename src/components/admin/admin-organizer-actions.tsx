"use client"

import { CircleCheck, CircleOff, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

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

type AdminOrganizerActionsProps = {
  id: string
  publicName: string
  isApproved: boolean
}

type OrganizerApiResponse = {
  error?: string
  message?: string
}

type ActionType = "approval" | "delete"

export function AdminOrganizerActions({
  id,
  publicName,
  isApproved,
}: AdminOrganizerActionsProps) {
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isPending = pendingAction !== null

  async function handleApprovalToggle() {
    setError(null)
    setSuccess(null)
    setPendingAction("approval")

    try {
      const response = await fetch(`/api/organizers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isApproved: !isApproved,
        }),
      })
      const data = await readOrganizerApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Aprobarea nu a putut fi actualizata.")
        return
      }

      setSuccess(data.message ?? "Aprobarea a fost actualizata.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la actualizarea aprobarii.")
    } finally {
      setPendingAction(null)
    }
  }

  async function handleDelete() {
    setError(null)
    setSuccess(null)
    setPendingAction("delete")

    try {
      const response = await fetch(`/api/organizers/${id}`, {
        method: "DELETE",
      })
      const data = await readOrganizerApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Organizatorul nu a putut fi sters.")
        return
      }

      setSuccess(data.message ?? "Organizator sters cu succes.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la stergerea organizatorului.")
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
            <Link href={`/admin/organizatori/${id}/editeaza`}>
              <Pencil />
              Editeaza
            </Link>
          </Button>
        )}

        <Button
          disabled={isPending}
          onClick={handleApprovalToggle}
          size="sm"
          type="button"
          variant="secondary"
        >
          {isApproved ? <CircleOff /> : <CircleCheck />}
          {pendingAction === "approval"
            ? "Se actualizeaza..."
            : isApproved
              ? "Retrage aprobarea"
              : "Aproba"}
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
              <AlertDialogTitle>Stergi organizatorul?</AlertDialogTitle>
              <AlertDialogDescription>
                Profilul "{publicName}" va fi sters, iar rolul userului asociat
                va reveni la PLAYER. Stergerea este blocata daca organizatorul
                are turnee asociate.
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

async function readOrganizerApiResponse(
  response: Response
): Promise<OrganizerApiResponse> {
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

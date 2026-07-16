"use client"

import { CheckCircle2, Pencil, Trash2 } from "lucide-react"
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

type AdminSeasonActionsProps = {
  id: string
  name: string
  isActive: boolean
}

type SeasonApiResponse = {
  error?: string
  message?: string
}

type Operation = "activate" | "delete"

export function AdminSeasonActions({
  id,
  name,
  isActive,
}: AdminSeasonActionsProps) {
  const router = useRouter()
  const [activeOperation, setActiveOperation] = useState<Operation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const isBusy = activeOperation !== null

  async function handleActivate() {
    setError(null)
    setSuccess(null)
    setActiveOperation("activate")

    try {
      const response = await fetch(`/api/seasons/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "activate",
        }),
      })
      const data = await readSeasonApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Sezonul nu a putut fi activat.")
        return
      }

      setSuccess(data.message ?? "Sezon activat cu succes.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la activarea sezonului.")
    } finally {
      setActiveOperation(null)
    }
  }

  async function handleDelete() {
    setError(null)
    setSuccess(null)
    setActiveOperation("delete")

    try {
      const response = await fetch(`/api/seasons/${id}`, {
        method: "DELETE",
      })
      const data = await readSeasonApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Sezonul nu a putut fi sters.")
        return
      }

      setSuccess(data.message ?? "Sezon sters cu succes.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la stergerea sezonului.")
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
            <Link href={`/admin/sezoane/${id}/editeaza`}>
              <Pencil />
              Editeaza
            </Link>
          </Button>
        )}

        {!isActive ? (
          <Button
            disabled={isBusy}
            onClick={handleActivate}
            size="sm"
            type="button"
            variant="outline"
          >
            <CheckCircle2 />
            {activeOperation === "activate" ? "Se activeaza..." : "Activeaza"}
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
              <AlertDialogTitle>Stergi sezonul?</AlertDialogTitle>
              <AlertDialogDescription>
                Sezonul "{name}" va fi sters definitiv doar daca nu este activ
                si nu are turnee sau statistici asociate. Actiunea nu poate fi
                anulata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isBusy}>Renunta</AlertDialogCancel>
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

async function readSeasonApiResponse(
  response: Response
): Promise<SeasonApiResponse> {
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

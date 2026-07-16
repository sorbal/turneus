"use client"

import { Pencil, Trash2 } from "lucide-react"
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

type AdminTournamentActionsProps = {
  id: string
  name: string
}

type TournamentApiResponse = {
  error?: string
  message?: string
}

export function AdminTournamentActions({
  id,
  name,
}: AdminTournamentActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    setSuccess(null)
    setIsDeleting(true)

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
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {isDeleting ? (
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isDeleting}
              size="sm"
              type="button"
              variant="destructive"
            >
              <Trash2 />
              {isDeleting ? "Se sterge..." : "Sterge"}
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
              <AlertDialogCancel disabled={isDeleting}>
                Renunta
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  disabled={isDeleting}
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

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

type AdminVenueActionsProps = {
  id: string
  name: string
}

type VenueApiResponse = {
  error?: string
  message?: string
}

export function AdminVenueActions({ id, name }: AdminVenueActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    setSuccess(null)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/venues/${id}`, {
        method: "DELETE",
      })
      const data = await readVenueApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Locatia nu a putut fi stearsa.")
        return
      }

      setSuccess(data.message ?? "Locatie stearsa cu succes.")
      router.refresh()
    } catch {
      setError("A aparut o eroare la stergerea locatiei.")
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
            <Link href={`/admin/locatii/${id}/editeaza`}>
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
              <AlertDialogTitle>Stergi locatia?</AlertDialogTitle>
              <AlertDialogDescription>
                Locatia "{name}" va fi stearsa definitiv doar daca nu are
                turnee asociate. Actiunea nu poate fi anulata.
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

async function readVenueApiResponse(
  response: Response
): Promise<VenueApiResponse> {
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

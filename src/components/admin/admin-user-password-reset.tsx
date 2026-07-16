"use client"

import { KeyRound } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type AdminUserPasswordResetProps = {
  id: string
  fullName: string
  disabled?: boolean
  onPendingChange?: (isPending: boolean) => void
}

type UserApiResponse = {
  error?: string
  message?: string
}

export function AdminUserPasswordReset({
  id,
  fullName,
  disabled = false,
  onPendingChange,
}: AdminUserPasswordResetProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handlePasswordReset() {
    const normalizedPassword = newPassword.trim()

    setError(null)
    setSuccess(null)

    if (normalizedPassword.length < 8) {
      setError("Parola trebuie sa aiba minimum 8 caractere.")
      return
    }

    setIsSubmitting(true)
    onPendingChange?.(true)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: normalizedPassword,
        }),
      })
      const data = await readUserApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Parola nu a putut fi resetata.")
        return
      }

      setSuccess(data.message ?? "Parola a fost resetata cu succes.")
      setNewPassword("")
      setIsOpen(false)
      router.refresh()
    } catch {
      setError("A aparut o eroare la resetarea parolei.")
    } finally {
      setIsSubmitting(false)
      onPendingChange?.(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (isSubmitting) {
      return
    }

    setIsOpen(open)

    if (!open) {
      setNewPassword("")
      setError(null)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button disabled={disabled || isSubmitting} size="sm" type="button" variant="outline">
            <KeyRound />
            Resetare parola
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetezi parola?</AlertDialogTitle>
            <AlertDialogDescription>
              Seteaza o parola noua pentru "{fullName}". Parola curenta nu este
              afisata si nu poate fi recuperata.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor={`new-password-${id}`}
            >
              Parola noua
            </label>
            <input
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting}
              id={`new-password-${id}`}
              minLength={8}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Minimum 8 caractere"
              type="password"
              value={newPassword}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Renunta</AlertDialogCancel>
            <Button
              disabled={isSubmitting || newPassword.trim().length < 8}
              onClick={handlePasswordReset}
              type="button"
            >
              <KeyRound />
              {isSubmitting ? "Se reseteaza..." : "Reseteaza parola"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

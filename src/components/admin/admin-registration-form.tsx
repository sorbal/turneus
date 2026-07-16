"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type RegistrationTournamentOption = {
  id: string
  label: string
}

export type RegistrationUserOption = {
  id: string
  label: string
}

type AdminRegistrationFormValues = {
  tournamentId: string
  userId: string
}

type AdminRegistrationFormProps = {
  tournaments: RegistrationTournamentOption[]
  users: RegistrationUserOption[]
}

type RegistrationApiResponse = {
  error?: string
  message?: string
}

const defaultValues: AdminRegistrationFormValues = {
  tournamentId: "",
  userId: "",
}

export function AdminRegistrationForm({
  tournaments,
  users,
}: AdminRegistrationFormProps) {
  const router = useRouter()
  const [values, setValues] =
    useState<AdminRegistrationFormValues>(defaultValues)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasRequiredOptions = tournaments.length > 0 && users.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasRequiredOptions) {
      return
    }

    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId: values.tournamentId,
          userId: values.userId,
        }),
      })
      const data = await readRegistrationApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Inscrierea nu a putut fi creata.")
        return
      }

      setSuccess(data.message ?? "Inscriere creata cu succes.")
      router.push("/admin/inscrieri")
      router.refresh()
    } catch {
      setError("A aparut o eroare la crearea inscrierii.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adauga inscriere</CardTitle>
        <CardDescription>
          Inscrie manual un utilizator activ la un turneu deschis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasRequiredOptions ? (
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
            Pentru a crea o inscriere sunt necesare turnee deschise si
            utilizatori activi.
          </div>
        ) : null}

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="registration-tournament"
              >
                Turneu
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="registration-tournament"
                name="tournamentId"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    tournamentId: event.target.value,
                  }))
                }
                required
                value={values.tournamentId}
              >
                <option value="">Selecteaza turneu</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="registration-user"
              >
                Utilizator
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="registration-user"
                name="userId"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    userId: event.target.value,
                  }))
                }
                required
                value={values.userId}
              >
                <option value="">Selecteaza utilizator</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
              {success}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button disabled={isSubmitting || !hasRequiredOptions} type="submit">
              {isSubmitting ? "Se salveaza..." : "Salveaza inscriere"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
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

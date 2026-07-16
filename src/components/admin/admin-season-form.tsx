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

type AdminSeasonFormValues = {
  id?: string
  name: string
  year: string
  startsAt: string
  endsAt: string
  isActive: boolean
}

type AdminSeasonFormProps = {
  initialValues?: Partial<AdminSeasonFormValues>
  mode?: "create" | "edit"
}

type SeasonApiResponse = {
  error?: string
  message?: string
}

const defaultValues: AdminSeasonFormValues = {
  name: "",
  year: "",
  startsAt: "",
  endsAt: "",
  isActive: false,
}

export function AdminSeasonForm({
  initialValues,
  mode = "create",
}: AdminSeasonFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<AdminSeasonFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(getActionUrl(mode, values.id), {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getRequestBody(mode, values)),
      })

      const data = await readSeasonApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultErrorMessage(mode))
        return
      }

      setSuccess(data.message ?? getDefaultSuccessMessage(mode))
      router.push("/admin/sezoane")
      router.refresh()
    } catch {
      setError(getUnexpectedErrorMessage(mode))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Editeaza sezon" : "Adauga sezon"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Actualizeaza perioada si anul sezonului selectat."
            : "Configureaza un sezon competitional pentru turnee si statistici."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="season-name"
              >
                Nume
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="season-name"
                name="name"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    name: event.target.value,
                  }))
                }
                placeholder="Ex: Sezon 2026"
                required
                type="text"
                value={values.name}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="season-year"
              >
                An
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="season-year"
                name="year"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    year: event.target.value,
                  }))
                }
                placeholder="Ex: 2026"
                required
                type="number"
                value={values.year}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="season-starts-at"
              >
                Data inceput
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="season-starts-at"
                name="startsAt"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    startsAt: event.target.value,
                  }))
                }
                required
                type="date"
                value={values.startsAt}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="season-ends-at"
              >
                Data sfarsit
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="season-ends-at"
                name="endsAt"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    endsAt: event.target.value,
                  }))
                }
                required
                type="date"
                value={values.endsAt}
              />
            </div>
          </div>

          <label
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-foreground"
            htmlFor="season-is-active"
          >
            <input
              checked={values.isActive}
              className="size-4 rounded border-border accent-primary"
              disabled={isSubmitting || mode === "edit"}
              id="season-is-active"
              name="isActive"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  isActive: event.target.checked,
                }))
              }
              type="checkbox"
            />
            Activ
          </label>

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
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Se salveaza..."
                : mode === "edit"
                  ? "Salveaza modificarile"
                  : "Salveaza sezon"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function getActionUrl(mode: "create" | "edit", id?: string) {
  if (mode === "edit") {
    if (!id) {
      throw new Error("ID-ul sezonului este obligatoriu pentru editare.")
    }

    return `/api/seasons/${id}`
  }

  return "/api/seasons"
}

function getRequestBody(
  mode: "create" | "edit",
  values: AdminSeasonFormValues
) {
  const baseBody = {
    name: values.name,
    year: values.year,
    startsAt: values.startsAt,
    endsAt: values.endsAt,
  }

  if (mode === "edit") {
    return baseBody
  }

  return {
    ...baseBody,
    isActive: values.isActive,
  }
}

function getDefaultErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Sezonul nu a putut fi actualizat."
    : "Sezonul nu a putut fi creat."
}

function getDefaultSuccessMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Sezon actualizat cu succes."
    : "Sezon creat cu succes."
}

function getUnexpectedErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "A aparut o eroare la actualizarea sezonului."
    : "A aparut o eroare la crearea sezonului."
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

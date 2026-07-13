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

type AdminGameFormValues = {
  id?: string
  name: string
  slug: string
  description: string
  isActive: boolean
}

type AdminGameFormProps = {
  initialValues?: Partial<AdminGameFormValues>
  mode?: "create" | "edit"
}

type GameApiResponse = {
  error?: string
  message?: string
}

const defaultValues: AdminGameFormValues = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
}

export function AdminGameForm({
  initialValues,
  mode = "create",
}: AdminGameFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<AdminGameFormValues>({
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
        body: JSON.stringify({
          name: values.name,
          slug: normalizeOptionalField(values.slug),
          description: normalizeOptionalField(values.description),
          isActive: values.isActive,
        }),
      })

      const data = await readGameApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultErrorMessage(mode))
        return
      }

      setSuccess(data.message ?? getDefaultSuccessMessage(mode))
      router.push("/admin/jocuri")
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
        <CardTitle>{mode === "edit" ? "Editeaza joc" : "Adauga joc"}</CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Actualizeaza datele jocului selectat."
            : "Configureaza un joc disponibil pentru turnee si module viitoare."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="game-name"
              >
                Nume
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="game-name"
                name="name"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    name: event.target.value,
                  }))
                }
                placeholder="Ex: Remi"
                required
                type="text"
                value={values.name}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="game-slug"
              >
                Slug
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="game-slug"
                name="slug"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    slug: event.target.value,
                  }))
                }
                placeholder="Se genereaza din nume daca ramane gol"
                type="text"
                value={values.slug}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="game-description"
            >
              Descriere
            </label>
            <textarea
              className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting}
              id="game-description"
              name="description"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  description: event.target.value,
                }))
              }
              placeholder="Descriere scurta pentru administrare."
              value={values.description}
            />
          </div>

          <label
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-foreground"
            htmlFor="game-is-active"
          >
            <input
              checked={values.isActive}
              className="size-4 rounded border-border accent-primary"
              disabled={isSubmitting}
              id="game-is-active"
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
                  : "Salveaza joc"}
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
      throw new Error("ID-ul jocului este obligatoriu pentru editare.")
    }

    return `/api/games/${id ?? ""}`
  }

  return "/api/games"
}

function getDefaultErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Jocul nu a putut fi actualizat."
    : "Jocul nu a putut fi creat."
}

function getDefaultSuccessMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Joc actualizat cu succes."
    : "Joc creat cu succes."
}

function getUnexpectedErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "A aparut o eroare la actualizarea jocului."
    : "A aparut o eroare la crearea jocului."
}

function normalizeOptionalField(value: string) {
  const normalizedValue = value.trim()

  return normalizedValue ? normalizedValue : null
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

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

type AdminCityFormValues = {
  id?: string
  name: string
  slug: string
  county: string
  country: string
}

type AdminCityFormProps = {
  initialValues?: Partial<AdminCityFormValues>
  mode?: "create" | "edit"
}

type CityApiResponse = {
  error?: string
  message?: string
}

const defaultValues: AdminCityFormValues = {
  name: "",
  slug: "",
  county: "",
  country: "Romania",
}

export function AdminCityForm({
  initialValues,
  mode = "create",
}: AdminCityFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<AdminCityFormValues>({
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
          county: normalizeOptionalField(values.county),
          country: normalizeOptionalField(values.country),
        }),
      })

      const data = await readCityApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultErrorMessage(mode))
        return
      }

      setSuccess(data.message ?? getDefaultSuccessMessage(mode))
      router.push("/admin/orase")
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
        <CardTitle>{mode === "edit" ? "Editeaza oras" : "Adauga oras"}</CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Actualizeaza datele orasului selectat."
            : "Configureaza un oras disponibil pentru turnee si profiluri locale."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="city-name"
              >
                Nume
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="city-name"
                name="name"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    name: event.target.value,
                  }))
                }
                placeholder="Ex: Braila"
                required
                type="text"
                value={values.name}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="city-slug"
              >
                Slug
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="city-slug"
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="city-county"
              >
                Judet
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="city-county"
                name="county"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    county: event.target.value,
                  }))
                }
                placeholder="Ex: Braila"
                type="text"
                value={values.county}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="city-country"
              >
                Tara
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="city-country"
                name="country"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    country: event.target.value,
                  }))
                }
                placeholder="Romania"
                type="text"
                value={values.country}
              />
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
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Se salveaza..."
                : mode === "edit"
                  ? "Salveaza modificarile"
                  : "Salveaza oras"}
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
      throw new Error("ID-ul orasului este obligatoriu pentru editare.")
    }

    return `/api/cities/${id}`
  }

  return "/api/cities"
}

function getDefaultErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Orasul nu a putut fi actualizat."
    : "Orasul nu a putut fi creat."
}

function getDefaultSuccessMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Oras actualizat cu succes."
    : "Oras creat cu succes."
}

function getUnexpectedErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "A aparut o eroare la actualizarea orasului."
    : "A aparut o eroare la crearea orasului."
}

function normalizeOptionalField(value: string) {
  const normalizedValue = value.trim()

  return normalizedValue ? normalizedValue : null
}

async function readCityApiResponse(response: Response): Promise<CityApiResponse> {
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

"use client"

import type { City } from "@/generated/prisma/client"
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

type AdminVenueFormValues = {
  id?: string
  name: string
  cityId: string
  address: string
}

type AdminVenueFormProps = {
  cities: City[]
  initialValues?: Partial<AdminVenueFormValues>
  mode?: "create" | "edit"
}

type VenueApiResponse = {
  error?: string
  message?: string
}

const defaultValues: AdminVenueFormValues = {
  name: "",
  cityId: "",
  address: "",
}

export function AdminVenueForm({
  cities,
  initialValues,
  mode = "create",
}: AdminVenueFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<AdminVenueFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasCities = cities.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasCities) {
      return
    }

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
          cityId: values.cityId,
          address: normalizeOptionalField(values.address),
        }),
      })

      const data = await readVenueApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultErrorMessage(mode))
        return
      }

      setSuccess(data.message ?? getDefaultSuccessMessage(mode))
      router.push("/admin/locatii")
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
          {mode === "edit" ? "Editeaza locatie" : "Adauga locatie"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Actualizeaza datele locatiei selectate."
            : "Configureaza o locatie fizica disponibila pentru turnee."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasCities ? (
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
            Nu exista orase disponibile. Adauga mai intai un oras.
          </div>
        ) : null}

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="venue-name"
              >
                Nume
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasCities}
                id="venue-name"
                name="name"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    name: event.target.value,
                  }))
                }
                placeholder="Ex: Sala Sporturilor"
                required
                type="text"
                value={values.name}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="venue-city"
              >
                Oras
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasCities}
                id="venue-city"
                name="cityId"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    cityId: event.target.value,
                  }))
                }
                required
                value={values.cityId}
              >
                <option value="">Selecteaza oras</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="venue-address"
            >
              Adresa
            </label>
            <input
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting || !hasCities}
              id="venue-address"
              name="address"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  address: event.target.value,
                }))
              }
              placeholder="Ex: Strada Principala 10"
              type="text"
              value={values.address}
            />
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
            <Button disabled={isSubmitting || !hasCities} type="submit">
              {isSubmitting
                ? "Se salveaza..."
                : mode === "edit"
                  ? "Salveaza modificarile"
                  : "Salveaza locatie"}
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
      throw new Error("ID-ul locatiei este obligatoriu pentru editare.")
    }

    return `/api/venues/${id}`
  }

  return "/api/venues"
}

function getDefaultErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Locatia nu a putut fi actualizata."
    : "Locatia nu a putut fi creata."
}

function getDefaultSuccessMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Locatie actualizata cu succes."
    : "Locatie creata cu succes."
}

function getUnexpectedErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "A aparut o eroare la actualizarea locatiei."
    : "A aparut o eroare la crearea locatiei."
}

function normalizeOptionalField(value: string) {
  const normalizedValue = value.trim()

  return normalizedValue ? normalizedValue : null
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

"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import type { City } from "@/generated/prisma/client"
import type { EligibleOrganizerUser } from "@/repositories/organizer.repository"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminOrganizerFormValues = {
  id?: string
  userId: string
  publicName: string
  slug: string
  logoUrl: string
  description: string
  cityIds: string[]
}

type AdminOrganizerFormProps = {
  cities: City[]
  eligibleUsers: EligibleOrganizerUser[]
  initialValues?: Partial<AdminOrganizerFormValues>
  mode?: "create" | "edit"
  userLabel?: string
}

type OrganizerApiResponse = {
  error?: string
  message?: string
}

const defaultValues: AdminOrganizerFormValues = {
  userId: "",
  publicName: "",
  slug: "",
  logoUrl: "",
  description: "",
  cityIds: [],
}

export function AdminOrganizerForm({
  cities,
  eligibleUsers,
  initialValues,
  mode = "create",
  userLabel,
}: AdminOrganizerFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<AdminOrganizerFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasEligibleUsers = mode === "edit" || eligibleUsers.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasEligibleUsers) {
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
        body: JSON.stringify(getRequestBody(mode, values)),
      })

      const data = await readOrganizerApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultErrorMessage(mode))
        return
      }

      setSuccess(data.message ?? getDefaultSuccessMessage(mode))
      router.push("/admin/organizatori")
      router.refresh()
    } catch {
      setError(getUnexpectedErrorMessage(mode))
    } finally {
      setIsSubmitting(false)
    }
  }

  function toggleCity(cityId: string) {
    setValues((currentValues) => {
      const nextCityIds = currentValues.cityIds.includes(cityId)
        ? currentValues.cityIds.filter((currentCityId) => currentCityId !== cityId)
        : [...currentValues.cityIds, cityId]

      return {
        ...currentValues,
        cityIds: Array.from(new Set(nextCityIds)),
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Editeaza organizator" : "Adauga organizator"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Actualizeaza profilul organizatorului selectat."
            : "Creeaza un profil de organizator pentru un utilizator existent."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasEligibleUsers ? (
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
            Nu exista utilizatori eligibili pentru un profil de organizator.
          </div>
        ) : null}

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          {mode === "edit" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Utilizator
              </p>
              <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                {userLabel ?? "Utilizator asociat"}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="organizer-user"
              >
                Utilizator
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasEligibleUsers}
                id="organizer-user"
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
                {eligibleUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {formatUserLabel(user)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="organizer-public-name"
              >
                Nume public
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasEligibleUsers}
                id="organizer-public-name"
                name="publicName"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    publicName: event.target.value,
                  }))
                }
                placeholder="Ex: Club Turneus Braila"
                required
                type="text"
                value={values.publicName}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="organizer-slug"
              >
                Slug
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasEligibleUsers}
                id="organizer-slug"
                name="slug"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    slug: event.target.value,
                  }))
                }
                placeholder="Se genereaza din numele public daca ramane gol"
                type="text"
                value={values.slug}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="organizer-logo-url"
            >
              Logo URL
            </label>
            <input
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting || !hasEligibleUsers}
              id="organizer-logo-url"
              name="logoUrl"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  logoUrl: event.target.value,
                }))
              }
              placeholder="https://..."
              type="text"
              value={values.logoUrl}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="organizer-description"
            >
              Descriere
            </label>
            <textarea
              className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting || !hasEligibleUsers}
              id="organizer-description"
              name="description"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  description: event.target.value,
                }))
              }
              placeholder="Descriere scurta pentru profilul public."
              value={values.description}
            />
          </div>

          <fieldset
            className="space-y-3 rounded-lg border border-border bg-muted/20 p-3"
            disabled={isSubmitting || !hasEligibleUsers}
          >
            <legend className="px-1 text-sm font-medium text-foreground">
              Orase
            </legend>
            {cities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nu exista orase disponibile.
              </p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {cities.map((city) => (
                  <label
                    className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    htmlFor={`organizer-city-${city.id}`}
                    key={city.id}
                  >
                    <input
                      checked={values.cityIds.includes(city.id)}
                      className="size-4 rounded border-border accent-primary"
                      id={`organizer-city-${city.id}`}
                      onChange={() => toggleCity(city.id)}
                      type="checkbox"
                    />
                    {city.name}
                  </label>
                ))}
              </div>
            )}
          </fieldset>

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
            <Button disabled={isSubmitting || !hasEligibleUsers} type="submit">
              {isSubmitting
                ? "Se salveaza..."
                : mode === "edit"
                  ? "Salveaza modificarile"
                  : "Salveaza organizator"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function formatUserLabel(user: EligibleOrganizerUser) {
  return `${user.firstName} ${user.lastName} (${user.email})`
}

function getActionUrl(mode: "create" | "edit", id?: string) {
  if (mode === "edit") {
    if (!id) {
      throw new Error("ID-ul organizatorului este obligatoriu pentru editare.")
    }

    return `/api/organizers/${id}`
  }

  return "/api/organizers"
}

function getRequestBody(
  mode: "create" | "edit",
  values: AdminOrganizerFormValues
) {
  const body = {
    publicName: values.publicName,
    slug: normalizeOptionalField(values.slug),
    logoUrl: normalizeOptionalField(values.logoUrl),
    description: normalizeOptionalField(values.description),
    cityIds: Array.from(new Set(values.cityIds)),
  }

  if (mode === "edit") {
    return body
  }

  return {
    ...body,
    userId: values.userId,
  }
}

function getDefaultErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Organizatorul nu a putut fi actualizat."
    : "Organizatorul nu a putut fi creat."
}

function getDefaultSuccessMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Organizator actualizat cu succes."
    : "Organizator creat cu succes."
}

function getUnexpectedErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "A aparut o eroare la actualizarea organizatorului."
    : "A aparut o eroare la crearea organizatorului."
}

function normalizeOptionalField(value: string) {
  const normalizedValue = value.trim()

  return normalizedValue ? normalizedValue : null
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

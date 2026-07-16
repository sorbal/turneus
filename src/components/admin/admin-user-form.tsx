"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import type { City, UserRole } from "@/generated/prisma/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminUserFormValues = {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  phone: string
  cityId: string
  birthDate: string
  avatarUrl: string
  bio: string
  role: UserRole
  isActive: boolean
}

type AdminUserFormProps = {
  cities: City[]
  initialValues: AdminUserFormValues
}

type UserApiResponse = {
  error?: string
  message?: string
}

export function AdminUserForm({ cities, initialValues }: AdminUserFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<AdminUserFormValues>(initialValues)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/users/${values.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          username: values.username,
          phone: normalizeOptionalField(values.phone),
          cityId: normalizeOptionalField(values.cityId),
          birthDate: normalizeOptionalField(values.birthDate),
          avatarUrl: normalizeOptionalField(values.avatarUrl),
          bio: normalizeOptionalField(values.bio),
        }),
      })

      const data = await readUserApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Utilizatorul nu a putut fi actualizat.")
        return
      }

      setSuccess(data.message ?? "Utilizator actualizat cu succes.")
      router.push("/admin/utilizatori")
      router.refresh()
    } catch {
      setError("A aparut o eroare la actualizarea utilizatorului.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editeaza utilizator</CardTitle>
        <CardDescription>
          Actualizeaza datele de profil ale utilizatorului selectat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <ReadOnlyField label="Rol" value={values.role} />
            <ReadOnlyField
              label="Status"
              value={values.isActive ? "Activ" : "Inactiv"}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-first-name"
              >
                Prenume
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-first-name"
                name="firstName"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    firstName: event.target.value,
                  }))
                }
                required
                type="text"
                value={values.firstName}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-last-name"
              >
                Nume
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-last-name"
                name="lastName"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    lastName: event.target.value,
                  }))
                }
                required
                type="text"
                value={values.lastName}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-email"
              >
                Email
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-email"
                name="email"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    email: event.target.value,
                  }))
                }
                required
                type="email"
                value={values.email}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-username"
              >
                Username
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-username"
                name="username"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    username: event.target.value,
                  }))
                }
                required
                type="text"
                value={values.username}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-phone"
              >
                Telefon
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-phone"
                name="phone"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    phone: event.target.value,
                  }))
                }
                type="text"
                value={values.phone}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-city"
              >
                Oras
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-city"
                name="cityId"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    cityId: event.target.value,
                  }))
                }
                value={values.cityId}
              >
                <option value="">Fara oras</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-birth-date"
              >
                Data nasterii
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-birth-date"
                name="birthDate"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    birthDate: event.target.value,
                  }))
                }
                type="date"
                value={values.birthDate}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="user-avatar-url"
              >
                Avatar URL
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting}
                id="user-avatar-url"
                name="avatarUrl"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    avatarUrl: event.target.value,
                  }))
                }
                placeholder="https://..."
                type="text"
                value={values.avatarUrl}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="user-bio"
            >
              Bio
            </label>
            <textarea
              className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting}
              id="user-bio"
              name="bio"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  bio: event.target.value,
                }))
              }
              placeholder="Bio scurt pentru profil."
              value={values.bio}
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
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Se salveaza..." : "Salveaza modificarile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
        {value}
      </div>
    </div>
  )
}

function normalizeOptionalField(value: string) {
  const normalizedValue = value.trim()

  return normalizedValue ? normalizedValue : null
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

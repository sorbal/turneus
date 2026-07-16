"use client"

import type { City, Game } from "@/generated/prisma/client"
import type { OrganizerWithRelations } from "@/repositories/organizer.repository"
import type { VenueWithRelations } from "@/repositories/venue.repository"
import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AdminTournamentFormValues = {
  id?: string
  name: string
  description: string
  gameId: string
  cityId: string
  venueId: string
  organizerId: string
  startsAt: string
  entryFee: string
  maxPlayers: string
}

type AdminTournamentFormProps = {
  games: Game[]
  cities: City[]
  venues: VenueWithRelations[]
  organizers: OrganizerWithRelations[]
  initialValues?: Partial<AdminTournamentFormValues>
  mode?: "create" | "edit"
}

type TournamentApiResponse = {
  error?: string
  message?: string
}

const defaultValues: AdminTournamentFormValues = {
  name: "",
  description: "",
  gameId: "",
  cityId: "",
  venueId: "",
  organizerId: "",
  startsAt: "",
  entryFee: "0",
  maxPlayers: "2",
}

export function AdminTournamentForm({
  games,
  cities,
  venues,
  organizers,
  initialValues,
  mode = "create",
}: AdminTournamentFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<AdminTournamentFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasRequiredOptions =
    games.length > 0 && cities.length > 0 && organizers.length > 0

  const filteredVenues = useMemo(
    () => venues.filter((venue) => venue.cityId === values.cityId),
    [values.cityId, venues]
  )
  const filteredOrganizers = useMemo(
    () =>
      organizers.filter(
        (organizer) =>
          organizer.isApproved &&
          organizer.cities.some(
            (organizerCity) => organizerCity.city.id === values.cityId
          )
      ),
    [organizers, values.cityId]
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasRequiredOptions) {
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
          description: normalizeOptionalField(values.description),
          gameId: values.gameId,
          cityId: values.cityId,
          venueId: normalizeOptionalField(values.venueId),
          organizerId: values.organizerId,
          startsAt: values.startsAt,
          entryFee: values.entryFee,
          maxPlayers: values.maxPlayers,
        }),
      })

      const data = await readTournamentApiResponse(response)

      if (!response.ok) {
        setError(data.error ?? getDefaultErrorMessage(mode))
        return
      }

      setSuccess(data.message ?? getDefaultSuccessMessage(mode))
      router.push("/admin/turnee")
      router.refresh()
    } catch {
      setError(getUnexpectedErrorMessage(mode))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCityChange(cityId: string) {
    setValues((currentValues) => ({
      ...currentValues,
      cityId,
      venueId: "",
      organizerId: "",
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Editeaza turneu" : "Adauga turneu"}
        </CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Actualizeaza datele turneului selectat."
            : "Configureaza un turneu nou cu joc, oras, locatie si organizator."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasRequiredOptions ? (
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-muted-foreground">
            Pentru a crea un turneu sunt necesare jocuri active, orase si
            organizatori aprobati.
          </div>
        ) : null}

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="tournament-name"
              >
                Nume
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="tournament-name"
                name="name"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    name: event.target.value,
                  }))
                }
                placeholder="Ex: Cupa Turneus Remi"
                required
                type="text"
                value={values.name}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="tournament-game"
              >
                Joc
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="tournament-game"
                name="gameId"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    gameId: event.target.value,
                  }))
                }
                required
                value={values.gameId}
              >
                <option value="">Selecteaza joc</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="tournament-description"
            >
              Descriere
            </label>
            <textarea
              className="min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting || !hasRequiredOptions}
              id="tournament-description"
              name="description"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  description: event.target.value,
                }))
              }
              placeholder="Descriere scurta pentru pagina turneului."
              value={values.description}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="tournament-city"
              >
                Oras
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="tournament-city"
                name="cityId"
                onChange={(event) => handleCityChange(event.target.value)}
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

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="tournament-venue"
              >
                Locatie
              </label>
              <select
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions || !values.cityId}
                id="tournament-venue"
                name="venueId"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    venueId: event.target.value,
                  }))
                }
                value={values.venueId}
              >
                <option value="">Fara locatie</option>
                {filteredVenues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="tournament-organizer"
            >
              Organizator
            </label>
            <select
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting || !hasRequiredOptions || !values.cityId}
              id="tournament-organizer"
              name="organizerId"
              onChange={(event) =>
                setValues((currentValues) => ({
                  ...currentValues,
                  organizerId: event.target.value,
                }))
              }
              required
              value={values.organizerId}
            >
              <option value="">
                {values.cityId
                  ? "Selecteaza organizator"
                  : "Selecteaza mai intai orasul"}
              </option>
              {filteredOrganizers.map((organizer) => (
                <option key={organizer.id} value={organizer.id}>
                  {organizer.publicName}
                </option>
              ))}
            </select>
            {values.cityId && filteredOrganizers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nu exista organizatori aprobati pentru orasul selectat.
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="tournament-starts-at"
              >
                Data si ora
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="tournament-starts-at"
                name="startsAt"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    startsAt: event.target.value,
                  }))
                }
                required
                type="datetime-local"
                value={values.startsAt}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="tournament-entry-fee"
              >
                Taxa participare
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="tournament-entry-fee"
                min="0"
                name="entryFee"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    entryFee: event.target.value,
                  }))
                }
                placeholder="0"
                required
                step="0.01"
                type="number"
                value={values.entryFee}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="tournament-max-players"
              >
                Numar maxim de jucatori
              </label>
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || !hasRequiredOptions}
                id="tournament-max-players"
                min="2"
                name="maxPlayers"
                onChange={(event) =>
                  setValues((currentValues) => ({
                    ...currentValues,
                    maxPlayers: event.target.value,
                  }))
                }
                placeholder="2"
                required
                step="1"
                type="number"
                value={values.maxPlayers}
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
            <Button disabled={isSubmitting || !hasRequiredOptions} type="submit">
              {isSubmitting
                ? "Se salveaza..."
                : mode === "edit"
                  ? "Salveaza modificarile"
                  : "Salveaza turneu"}
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
      throw new Error("ID-ul turneului este obligatoriu pentru editare.")
    }

    return `/api/tournaments/${id}`
  }

  return "/api/tournaments"
}

function getDefaultErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Turneul nu a putut fi actualizat."
    : "Turneul nu a putut fi creat."
}

function getDefaultSuccessMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "Turneu actualizat cu succes."
    : "Turneu creat cu succes."
}

function getUnexpectedErrorMessage(mode: "create" | "edit") {
  return mode === "edit"
    ? "A aparut o eroare la actualizarea turneului."
    : "A aparut o eroare la crearea turneului."
}

function normalizeOptionalField(value: string) {
  const normalizedValue = value.trim()

  return normalizedValue ? normalizedValue : null
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

"use client"

import type {
  RegistrationStatus,
  TournamentStatus,
  UserRole,
} from "@/generated/prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

type PublicRegistrationActionProps = {
  tournamentId: string
  tournamentSlug: string
  tournamentStatus: TournamentStatus
  startsAt: string
  occupiedSeats: number
  maxPlayers: number
  currentUserRole: UserRole | null
  isTournamentOrganizer: boolean
  registrationId: string | null
  registrationStatus: RegistrationStatus | null
}

type NetopiaPaymentResponse = {
  endpoint: string
  orderId: string
  amount: string
  currency: "RON"
  fields: {
    env_key: string
    data: string
    cipher: "aes-256-cbc"
    iv: string
  }
}

export function PublicRegistrationAction({
  currentUserRole,
  isTournamentOrganizer,
  maxPlayers,
  occupiedSeats,
  registrationId,
  registrationStatus,
  startsAt,
  tournamentId,
  tournamentSlug,
  tournamentStatus,
}: PublicRegistrationActionProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const existingStatusMessage = getExistingStatusMessage(registrationStatus)
  const disabledReason = getDisabledReason({
    currentUserRole,
    isTournamentOrganizer,
    maxPlayers,
    occupiedSeats,
    startsAt,
    tournamentStatus,
  })

  async function handleRegister() {
    setIsSubmitting(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId,
        }),
      })

      const data = await readJsonResponse(response)

      if (!response.ok) {
        setError(data.error ?? "Inscrierea nu a putut fi procesata.")
        return
      }

      setMessage(data.message ?? "Inscrierea a fost procesata cu succes.")
      router.refresh()
    } catch {
      setError("Inscrierea nu a putut fi procesata.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePayment() {
    if (!registrationId) {
      setError("Inscrierea nu poate fi platita momentan.")
      return
    }

    setIsPaymentSubmitting(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId,
        }),
      })

      const data = await readPaymentResponse(response)

      if (!response.ok) {
        setError(getPaymentResponseError(data))
        return
      }

      if (!isNetopiaPaymentResponse(data)) {
        setError("Raspuns invalid la initializarea platii.")
        return
      }

      submitNetopiaPaymentForm(data)
    } catch {
      setError("Plata nu a putut fi initializata.")
    } finally {
      setIsPaymentSubmitting(false)
    }
  }

  if (!currentUserRole) {
    return (
      <RegistrationPanel
        description="Ai nevoie de un cont Turneus pentru a te inscrie la acest turneu."
        title="Inscriere turneu"
      >
        <Button
          asChild
          className="w-full bg-white text-zinc-950 hover:bg-zinc-200"
          size="lg"
        >
          <Link href={`/login?redirect=/turnee/${tournamentSlug}`}>
            Autentifica-te pentru inscriere
          </Link>
        </Button>
      </RegistrationPanel>
    )
  }

  if (currentUserRole === "ADMIN") {
    return (
      <RegistrationPanel
        description="Inscrierea publica nu este disponibila pentru administratori."
        title="Inscriere indisponibila"
      />
    )
  }

  if (existingStatusMessage && registrationStatus !== "CANCELLED") {
    if (registrationStatus === "PENDING_PAYMENT") {
      return (
        <RegistrationPanel
          description={existingStatusMessage.description}
          title={existingStatusMessage.title}
        >
          <Button
            className="w-full bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-white/30 disabled:text-zinc-400"
            disabled={isPaymentSubmitting}
            onClick={handlePayment}
            size="lg"
            type="button"
          >
            {isPaymentSubmitting ? "Se initializeaza plata..." : "Plateste"}
          </Button>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </RegistrationPanel>
      )
    }

    return (
      <RegistrationPanel
        description={existingStatusMessage.description}
        title={existingStatusMessage.title}
      />
    )
  }

  return (
    <RegistrationPanel
      description={
        registrationStatus === "CANCELLED"
          ? "Inscrierea ta anterioara a fost anulata. Te poti reinscrie daca turneul mai accepta participanti."
          : "Confirma inscrierea la acest turneu. Pentru turneele cu taxa, plata va fi gestionata intr-un pas ulterior."
      }
      title="Inscriere turneu"
    >
      <Button
        className="w-full bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-white/30 disabled:text-zinc-400"
        disabled={Boolean(disabledReason) || isSubmitting}
        onClick={handleRegister}
        size="lg"
        type="button"
      >
        {isSubmitting ? "Se proceseaza..." : "Inscrie-te"}
      </Button>

      {disabledReason ? (
        <p className="text-sm text-zinc-400">{disabledReason}</p>
      ) : null}

      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </RegistrationPanel>
  )
}

function RegistrationPanel({
  children,
  description,
  title,
}: {
  children?: ReactNode
  description: string
  title: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      {children ? <div className="mt-5 space-y-3">{children}</div> : null}
    </div>
  )
}

function getExistingStatusMessage(status: RegistrationStatus | null) {
  if (status === "PENDING_PAYMENT") {
    return {
      title: "Plata in asteptare",
      description:
        "Inscrierea ta este inregistrata si asteapta pasul de plata.",
    }
  }

  if (status === "CONFIRMED") {
    return {
      title: "Inscriere confirmata",
      description: "Locul tau la acest turneu este confirmat.",
    }
  }

  if (status === "CHECKED_IN") {
    return {
      title: "Check-in efectuat",
      description: "Check-in-ul pentru aceasta inscriere a fost efectuat.",
    }
  }

  return null
}

function getDisabledReason({
  currentUserRole,
  isTournamentOrganizer,
  maxPlayers,
  occupiedSeats,
  startsAt,
  tournamentStatus,
}: {
  currentUserRole: UserRole | null
  isTournamentOrganizer: boolean
  maxPlayers: number
  occupiedSeats: number
  startsAt: string
  tournamentStatus: TournamentStatus
}) {
  if (currentUserRole === "ADMIN") {
    return "Inscrierea publica nu este disponibila pentru administratori."
  }

  if (currentUserRole !== "PLAYER" && currentUserRole !== "ORGANIZER") {
    return "Rolul contului tau nu permite inscrierea publica."
  }

  if (isTournamentOrganizer) {
    return "Nu te poti inscrie la propriul turneu."
  }

  if (tournamentStatus !== "OPEN") {
    return "Inscrierile sunt disponibile doar pentru turnee deschise."
  }

  if (new Date(startsAt).getTime() <= Date.now()) {
    return "Inscrierile nu mai sunt disponibile dupa inceperea turneului."
  }

  if (occupiedSeats >= maxPlayers) {
    return "Turneul nu mai are locuri disponibile."
  }

  return ""
}

async function readJsonResponse(response: Response) {
  try {
    const data: unknown = await response.json()

    if (isRecord(data)) {
      return {
        error: typeof data.error === "string" ? data.error : undefined,
        message: typeof data.message === "string" ? data.message : undefined,
      }
    }
  } catch {
    return {}
  }

  return {}
}

async function readPaymentResponse(response: Response) {
  try {
    const data: unknown = await response.json()

    if (isRecord(data)) {
      return data
    }
  } catch {
    return {}
  }

  return {}
}

function isNetopiaPaymentResponse(
  value: Record<string, unknown>
): value is NetopiaPaymentResponse {
  if (
    typeof value.endpoint !== "string" ||
    typeof value.orderId !== "string" ||
    typeof value.amount !== "string" ||
    value.currency !== "RON" ||
    !isRecord(value.fields)
  ) {
    return false
  }

  return (
    typeof value.fields.env_key === "string" &&
    typeof value.fields.data === "string" &&
    value.fields.cipher === "aes-256-cbc" &&
    typeof value.fields.iv === "string"
  )
}

function submitNetopiaPaymentForm(payment: NetopiaPaymentResponse) {
  const form = document.createElement("form")
  form.method = "POST"
  form.action = payment.endpoint
  form.hidden = true

  appendHiddenInput(form, "env_key", payment.fields.env_key)
  appendHiddenInput(form, "data", payment.fields.data)
  appendHiddenInput(form, "cipher", payment.fields.cipher)
  appendHiddenInput(form, "iv", payment.fields.iv)

  document.body.appendChild(form)
  form.submit()
}

function getPaymentResponseError(value: Record<string, unknown>) {
  if (typeof value.error === "string") {
    return value.error
  }

  return "Plata nu a putut fi initializata."
}

function appendHiddenInput(
  form: HTMLFormElement,
  name: string,
  value: string
) {
  const input = document.createElement("input")
  input.type = "hidden"
  input.name = name
  input.value = value
  form.appendChild(input)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

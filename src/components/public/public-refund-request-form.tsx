"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

type PublicRefundRequestFormProps = {
  registrationId: string
}

type RefundRequestResponse = {
  message?: string
  error?: string
  refundRequest?: {
    id: string
    status: string
    statusLabel: string
    publicMessage: string
  }
}

export function PublicRefundRequestForm({
  registrationId,
}: PublicRefundRequestFormProps) {
  const router = useRouter()
  const [reason, setReason] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const trimmedReason = reason.trim()
  const reasonError = useMemo(() => {
    if (!trimmedReason) {
      return "Motivul este obligatoriu."
    }

    if (trimmedReason.length < 10) {
      return "Motivul trebuie sa aiba minimum 10 caractere."
    }

    if (trimmedReason.length > 500) {
      return "Motivul trebuie sa aiba maximum 500 caractere."
    }

    return ""
  }, [trimmedReason])

  const isSubmitDisabled = Boolean(reasonError) || !accepted || isSubmitting

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitDisabled) {
      return
    }

    setIsSubmitting(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/refund-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: trimmedReason,
          registrationId,
        }),
      })

      const data = await readRefundRequestResponse(response)

      if (!response.ok && !data.refundRequest) {
        setError(data.error ?? "Solicitarea nu a putut fi procesata.")
        return
      }

      setMessage(
        data.message ??
          data.refundRequest?.publicMessage ??
          "Solicitarea a fost procesata."
      )
      router.refresh()
    } catch {
      setError("Solicitarea nu a putut fi procesata.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-200" htmlFor="reason">
          Motiv solicitare
        </label>
        <textarea
          aria-describedby="reason-help"
          className="min-h-36 w-full resize-y rounded-lg border border-white/10 bg-zinc-950/70 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/20"
          disabled={isSubmitting}
          id="reason"
          maxLength={500}
          minLength={10}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Spune-ne pe scurt de ce doresti anularea participarii."
          required
          value={reason}
        />
        <div className="flex items-center justify-between gap-3 text-xs text-zinc-500">
          <p id="reason-help">{reasonError || "Motiv valid."}</p>
          <span>{trimmedReason.length}/500</span>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-3">
        <label className="flex items-start gap-3 text-left text-sm leading-6 text-zinc-300">
          <input
            checked={accepted}
            className="mt-1 size-4 rounded border-white/20 bg-zinc-950 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            disabled={isSubmitting}
            onChange={(event) => setAccepted(event.target.checked)}
            type="checkbox"
          />
          <span>
            Confirm ca doresc anularea participarii si am citit{" "}
            <Link
              className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              href="/anulare-si-rambursare"
              rel="noreferrer"
              target="_blank"
            >
              Politica de anulare si rambursare
            </Link>
            .
          </span>
        </label>
      </div>

      <Button
        className="w-full bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-white/30 disabled:text-zinc-400"
        disabled={isSubmitDisabled}
        size="lg"
        type="submit"
      >
        {isSubmitting ? "Se trimite solicitarea..." : "Solicita rambursarea"}
      </Button>

      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  )
}

async function readRefundRequestResponse(
  response: Response
): Promise<RefundRequestResponse> {
  try {
    const data: unknown = await response.json()

    if (isRecord(data)) {
      return {
        error: typeof data.error === "string" ? data.error : undefined,
        message: typeof data.message === "string" ? data.message : undefined,
        refundRequest: isRefundRequestPayload(data.refundRequest)
          ? data.refundRequest
          : undefined,
      }
    }
  } catch {
    return {}
  }

  return {}
}

function isRefundRequestPayload(
  value: unknown
): value is NonNullable<RefundRequestResponse["refundRequest"]> {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.status === "string" &&
    typeof value.statusLabel === "string" &&
    typeof value.publicMessage === "string"
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

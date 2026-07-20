"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PublicRegistrationFormProps = {
  redirectPath?: string
}

export function PublicRegistrationForm({
  redirectPath,
}: PublicRegistrationFormProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.")
      return
    }

    if (!termsAccepted) {
      setError("Trebuie sa accepti termenii si politica de confidentialitate.")
      return
    }

    setIsSubmitting(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
          termsAccepted: true,
        }),
      })
      const data: unknown = await response.json()

      if (!response.ok) {
        setError(getApiError(data))
        setIsSubmitting(false)
        return
      }

      setMessage("Cont creat cu succes. Te poti autentifica.")
      router.push(getLoginRedirectPath(redirectPath))
      router.refresh()
    } catch {
      setError("Contul nu a putut fi creat.")
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-xl border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/25">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-3xl font-semibold text-white">
          Creeaza cont
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-zinc-400">
          Creeaza un cont Turneus pentru inscrieri la turnee si administrarea
          participarii tale.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              autoComplete="given-name"
              id="firstName"
              label="Prenume"
              onChange={setFirstName}
              required
              value={firstName}
            />
            <TextField
              autoComplete="family-name"
              id="lastName"
              label="Nume"
              onChange={setLastName}
              required
              value={lastName}
            />
          </div>

          <TextField
            autoComplete="username"
            id="username"
            label="Username"
            onChange={setUsername}
            required
            value={username}
          />

          <TextField
            autoComplete="email"
            id="email"
            label="Email"
            onChange={setEmail}
            required
            type="email"
            value={email}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              autoComplete="new-password"
              id="password"
              label="Parola"
              onChange={setPassword}
              required
              type="password"
              value={password}
            />
            <TextField
              autoComplete="new-password"
              id="confirmPassword"
              label="Confirma parola"
              onChange={setConfirmPassword}
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950/50 p-3">
            <label
              className="flex items-start gap-3 text-left text-sm leading-6 text-zinc-300"
              htmlFor="termsAccepted"
            >
              <input
                checked={termsAccepted}
                className="mt-1 size-4 rounded border-white/20 bg-zinc-950 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                disabled={isSubmitting}
                id="termsAccepted"
                onChange={(event) => setTermsAccepted(event.target.checked)}
                type="checkbox"
              />
              <span>
                Am citit si accept{" "}
                <Link
                  className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  href="/termeni-si-conditii"
                  rel="noreferrer"
                  target="_blank"
                >
                  Termenii si conditiile
                </Link>{" "}
                si{" "}
                <Link
                  className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  href="/confidentialitate"
                  rel="noreferrer"
                  target="_blank"
                >
                  Politica de confidentialitate
                </Link>
                .
              </span>
            </label>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {message}
            </p>
          ) : null}

          <Button
            className="h-10 w-full bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-white/30 disabled:text-zinc-400"
            disabled={!termsAccepted || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Se creeaza contul..." : "Creeaza cont"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Button
            asChild
            className="text-zinc-300 hover:text-white"
            variant="link"
          >
            <Link href={getLoginRedirectPath(redirectPath)}>
              Ai deja cont? Autentifica-te
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TextField({
  autoComplete,
  id,
  label,
  onChange,
  required,
  type = "text",
  value,
}: {
  autoComplete: string
  id: string
  label: string
  onChange: (value: string) => void
  required?: boolean
  type?: "email" | "password" | "text"
  value: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200" htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/30 focus:bg-white/[0.08] focus:ring-3 focus:ring-white/10"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </div>
  )
}

function getLoginRedirectPath(redirectPath?: string) {
  const params = new URLSearchParams({
    registered: "1",
  })

  if (redirectPath) {
    params.set("redirect", redirectPath)
  }

  return `/login?${params.toString()}`
}

function getApiError(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error
  }

  return "Contul nu a putut fi creat."
}

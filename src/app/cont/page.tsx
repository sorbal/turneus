import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CalendarDays, MapPin, Trophy, UserCircle } from "lucide-react"

import { PublicShell } from "@/components/public/public-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth/current-user"
import { getAccountDashboard } from "@/services/account.service"
import type { AccountRegistrationItem } from "@/services/account.service"

export const metadata: Metadata = {
  title: "Contul meu | Turneus",
  description:
    "Dashboard privat pentru contul Turneus, inscrieri si statusul platilor.",
}

export default async function AccountPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login?redirect=/cont")
  }

  const account = await getAccountDashboard(currentUser)

  return (
    <PublicShell>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
            Dashboard privat
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-normal text-white md:text-5xl">
                Contul meu
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                Urmareste inscrierile tale la turnee si statusul platilor
                asociate contului Turneus.
              </p>
            </div>

            <Card className="border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/25">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <UserCircle className="size-5" />
                  {account.user.fullName}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {account.user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 pt-0 text-sm">
                <AccountDetail label="Username" value={account.user.username} />
                <AccountDetail label="Rol" value={account.user.role} />
                <AccountDetail
                  label="Status"
                  value={account.user.isActive ? "Activ" : "Inactiv"}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
              Inscrieri
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-white">
              Inscrierile mele
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            Sunt afisate doar inscrierile contului autentificat.
          </p>
        </div>

        {account.registrations.length > 0 ? (
          <div className="grid gap-4">
            {account.registrations.map((registration) => (
              <RegistrationCard
                key={registration.id}
                registration={registration}
              />
            ))}
          </div>
        ) : (
          <Card className="border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/20">
            <CardHeader>
              <CardTitle className="text-white">
                Nu ai inscrieri momentan
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Exploreaza turneele disponibile si inscrie-te la competitia
                potrivita pentru tine.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="bg-white text-zinc-950 hover:bg-zinc-200"
              >
                <Link href="/turnee">Vezi turneele</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </PublicShell>
  )
}

function AccountDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-zinc-950/50 px-3 py-2">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-100">{value}</span>
    </div>
  )
}

function RegistrationCard({
  registration,
}: {
  registration: AccountRegistrationItem
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/20">
      <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-2xl text-white">
            {registration.tournament.name}
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-x-4 gap-y-2 text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="size-4" />
              {registration.tournament.gameName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {registration.tournament.cityName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDateTime(registration.tournament.startsAt)}
            </span>
          </CardDescription>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {canShowTicket(registration.status) ? (
            <Button
              asChild
              className="bg-white text-zinc-950 hover:bg-zinc-200"
            >
              <Link href={`/cont/bilete/${registration.id}`}>
                Vezi biletul
              </Link>
            </Button>
          ) : null}

          {registration.canRequestRefund ? (
            <Button
              asChild
              className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              variant="outline"
            >
              <Link href={`/cont/rambursare/${registration.id}`}>
                Solicita rambursarea
              </Link>
            </Button>
          ) : null}

          <Button
            asChild
            className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            variant="outline"
          >
            <Link href={`/turnee/${registration.tournament.slug}`}>
              Vezi turneul
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3 pt-0 md:grid-cols-4">
        <StatusTile
          label="Status inscriere"
          tone={getRegistrationTone(registration.status)}
          value={registration.statusLabel}
        />
        <StatusTile
          label="Status plata"
          tone={registration.payment ? getPaymentTone(registration.payment.status) : "muted"}
          value={registration.payment?.statusLabel ?? "Fara plata"}
        />
        <StatusTile
          label="Suma"
          tone="muted"
          value={
            registration.payment
              ? formatCurrency(registration.payment.amount)
              : "Nu exista plata"
          }
        />
        {registration.refundRequest ? (
          <StatusTile
            label="Rambursare"
            tone={getRefundRequestTone(registration.refundRequest.status)}
            value={registration.refundRequest.statusLabel}
            helperText={registration.refundRequest.publicMessage}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

function StatusTile({
  label,
  tone,
  value,
  helperText,
}: {
  label: string
  tone: "emerald" | "amber" | "red" | "violet" | "muted"
  value: string
  helperText?: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 text-sm font-medium ${getToneClassName(tone)}`}>
        {value}
      </p>
      {helperText ? (
        <p className="mt-1 text-xs leading-5 text-zinc-500">{helperText}</p>
      ) : null}
    </div>
  )
}

function getRegistrationTone(status: string) {
  if (status === "CONFIRMED" || status === "CHECKED_IN") {
    return "emerald"
  }

  if (status === "PENDING_PAYMENT") {
    return "amber"
  }

  return "red"
}

function canShowTicket(status: string) {
  return status === "CONFIRMED" || status === "CHECKED_IN"
}

function getPaymentTone(status: string) {
  if (status === "PAID") {
    return "emerald"
  }

  if (status === "PENDING") {
    return "amber"
  }

  if (status === "REFUNDED") {
    return "violet"
  }

  return "red"
}

function getRefundRequestTone(status: string) {
  if (status === "PENDING") {
    return "amber"
  }

  if (status === "APPROVED" || status === "PROCESSED") {
    return "emerald"
  }

  return "red"
}

function getToneClassName(tone: "emerald" | "amber" | "red" | "violet" | "muted") {
  if (tone === "emerald") {
    return "text-emerald-300"
  }

  if (tone === "amber") {
    return "text-amber-300"
  }

  if (tone === "red") {
    return "text-red-300"
  }

  if (tone === "violet") {
    return "text-violet-300"
  }

  return "text-zinc-300"
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(value))
}

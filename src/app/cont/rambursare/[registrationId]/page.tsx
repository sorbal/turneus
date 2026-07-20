import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import type { ReactNode } from "react"
import { CalendarDays, CreditCard, Info, MapPin, Trophy } from "lucide-react"

import { PublicRefundRequestForm } from "@/components/public/public-refund-request-form"
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
import { getUserRefundRequestPageData } from "@/services/refund-request.service"

type AccountRefundRequestPageProps = {
  params: Promise<{
    registrationId: string
  }>
}

export const metadata: Metadata = {
  title: "Solicitare rambursare | Turneus",
  description:
    "Pagina privata pentru solicitarea rambursarii unei inscrieri Turneus.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AccountRefundRequestPage({
  params,
}: AccountRefundRequestPageProps) {
  const { registrationId } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect(`/login?redirect=/cont/rambursare/${registrationId}`)
  }

  const refundRequestData = await getUserRefundRequestPageData(
    registrationId,
    currentUser.id
  )

  if (!refundRequestData) {
    notFound()
  }

  return (
    <PublicShell>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Button
            asChild
            className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            variant="outline"
          >
            <Link href="/cont">Inapoi la cont</Link>
          </Button>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
              Contul meu
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white md:text-5xl">
              Solicitare rambursare
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              Poti solicita rambursarea doar pentru inscrieri confirmate, cu
              plata confirmata, inainte de inceperea turneului. Solicitarile
              trimise cu minimum 24 de ore inainte sunt eligibile pentru
              verificare.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_24rem] lg:px-8">
        <Card className="border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {refundRequestData.tournament.name}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Verifica detaliile inscrierii inainte de a trimite solicitarea.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-0 sm:grid-cols-2">
            <RefundDetail
              icon={<Trophy className="size-4" />}
              label="Joc"
              value={refundRequestData.tournament.gameName}
            />
            <RefundDetail
              icon={<MapPin className="size-4" />}
              label="Oras"
              value={refundRequestData.tournament.cityName}
            />
            <RefundDetail
              icon={<CalendarDays className="size-4" />}
              label="Data turneului"
              value={formatDateTime(refundRequestData.tournament.startsAt)}
            />
            <RefundDetail
              icon={<CreditCard className="size-4" />}
              label="Suma platita"
              value={
                refundRequestData.payment
                  ? formatCurrency(refundRequestData.payment.amount)
                  : "Fara plata"
              }
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Info className="size-5" />
                Regula de 24h
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Solicitarile trimise cu mai putin de 24 de ore inainte de
                inceperea turneului sunt respinse automat.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {refundRequestData.refundRequest
                  ? "Solicitare existenta"
                  : "Trimite solicitarea"}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {refundRequestData.refundRequest
                  ? refundRequestData.refundRequest.publicMessage
                  : "Completeaza motivul si confirma politica de anulare."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {refundRequestData.refundRequest ? (
                <div className="rounded-lg border border-white/10 bg-zinc-950/50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
                    Status rambursare
                  </p>
                  <p className="mt-2 text-sm font-medium text-amber-300">
                    {refundRequestData.refundRequest.statusLabel}
                  </p>
                </div>
              ) : refundRequestData.canSubmitRequest ? (
                <PublicRefundRequestForm
                  registrationId={refundRequestData.registrationId}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-zinc-400">
                    {refundRequestData.unavailableReason ??
                      "Aceasta inscriere nu este eligibila pentru solicitarea unei rambursari."}
                  </p>
                  <Button
                    asChild
                    className="bg-white text-zinc-950 hover:bg-zinc-200"
                  >
                    <Link href="/cont">Inapoi la cont</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicShell>
  )
}

function RefundDetail({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2 text-sm font-medium text-zinc-100">
        {icon}
        {value}
      </p>
    </div>
  )
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

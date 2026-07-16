import type { PaymentStatus } from "@/generated/prisma/client"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, RefreshCw } from "lucide-react"

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
import type { PaymentWithRelations } from "@/repositories/payment.repository"
import { getPaymentById } from "@/services/payment.service"

type PaymentResultPageProps = {
  searchParams: Promise<{
    paymentId?: string
  }>
}

export default async function PaymentResultPage({
  searchParams,
}: PaymentResultPageProps) {
  const { paymentId } = await searchParams

  if (!paymentId?.trim()) {
    notFound()
  }

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/plata/rezultat?paymentId=${paymentId}`
      )}`
    )
  }

  const payment = await getPaymentById(paymentId)

  if (!payment || payment.user.id !== currentUser.id) {
    notFound()
  }

  const statusContent = getPaymentStatusContent(payment.status)

  return (
    <PublicShell>
      <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)] px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/25">
          <CardHeader className="space-y-3">
            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusContent.className}`}
            >
              {statusContent.badge}
            </span>
            <CardTitle className="text-3xl font-semibold text-white">
              {statusContent.title}
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-zinc-400">
              Redirect-ul din NETOPIA nu confirma singur plata. Statusul final
              este actualizat prin IPN-ul securizat primit de la NETOPIA.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <PaymentDetail label="Turneu" value={payment.tournament.name} />
              <PaymentDetail label="Suma" value={formatCurrency(payment.amount)} />
              <PaymentDetail label="Status" value={statusContent.badge} />
              <PaymentDetail
                label="Procesator"
                value="NETOPIA Payments"
              />
            </div>

            <p className="rounded-lg border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm leading-6 text-zinc-300">
              {statusContent.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-white text-zinc-950 hover:bg-zinc-200"
                size="lg"
              >
                <Link href={`/turnee/${payment.tournament.slug}`}>
                  <ArrowLeft />
                  Inapoi la turneu
                </Link>
              </Button>

              {payment.status === "PENDING" ? (
                <Button
                  asChild
                  className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                  size="lg"
                  variant="outline"
                >
                  <Link href={`/plata/rezultat?paymentId=${payment.id}`}>
                    <RefreshCw />
                    Verifica statusul
                  </Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
    </PublicShell>
  )
}

function PaymentDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  )
}

function getPaymentStatusContent(status: PaymentStatus) {
  if (status === "PAID") {
    return {
      badge: "PAID",
      title: "Plata confirmata",
      description:
        "Plata a fost confirmata prin IPN, iar inscrierea ta este confirmata.",
      className: "bg-emerald-500/15 text-emerald-300",
    }
  }

  if (status === "FAILED") {
    return {
      badge: "FAILED",
      title: "Plata nu a fost finalizata",
      description:
        "NETOPIA a transmis ca plata nu a fost finalizata. Poti reveni la turneu pentru a incerca din nou, daca inscrierea permite plata.",
      className: "bg-red-500/15 text-red-300",
    }
  }

  if (status === "REFUNDED") {
    return {
      badge: "REFUNDED",
      title: "Plata a fost returnata",
      description:
        "Plata a fost marcata ca returnata, iar inscrierea asociata a fost anulata.",
      className: "bg-violet-500/15 text-violet-300",
    }
  }

  return {
    badge: "PENDING",
    title: "Plata este in curs de confirmare",
    description:
      "Asteptam confirmarea IPN de la NETOPIA. Poti reincarca pagina pentru a verifica statusul actual.",
    className: "bg-amber-500/15 text-amber-300",
  }
}

function formatCurrency(value: PaymentWithRelations["amount"]) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(value))
}

import { redirect } from "next/navigation"

import { PublicRegistrationForm } from "@/components/public/public-registration-form"
import { PublicShell } from "@/components/public/public-shell"
import { getCurrentUser } from "@/lib/auth/current-user"

type PublicRegisterPageProps = {
  searchParams: Promise<{
    redirect?: string
  }>
}

export default async function PublicRegisterPage({
  searchParams,
}: PublicRegisterPageProps) {
  const currentUser = await getCurrentUser()

  if (currentUser) {
    redirect("/cont")
  }

  const { redirect: redirectParam } = await searchParams
  const redirectPath = normalizeRedirectPath(redirectParam)

  return (
    <PublicShell>
      <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)] px-4 py-12 sm:px-6 lg:px-8">
        <PublicRegistrationForm redirectPath={redirectPath} />
      </section>
    </PublicShell>
  )
}

function normalizeRedirectPath(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return undefined
  }

  return value
}

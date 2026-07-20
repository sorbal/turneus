import { Suspense } from "react";

import { PublicLoginForm } from "@/components/public/public-login-form";
import { PublicShell } from "@/components/public/public-shell";

export default function LoginPage() {
  return (
    <PublicShell>
      <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30rem)] px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <PublicLoginForm />
        </Suspense>
      </section>
    </PublicShell>
  );
}

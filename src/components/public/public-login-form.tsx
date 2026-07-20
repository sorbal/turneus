"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PublicLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));
  const registrationSuccessMessage =
    searchParams.get("registered") === "1"
      ? "Cont creat cu succes. Te poti autentifica."
      : "";

  const [email, setEmail] = useState("test@turneus.ro");
  const [password, setPassword] = useState("parola123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data: unknown = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(getLoginError(data));
      return;
    }

    router.push(redirectPath ?? getDefaultRedirectPath(data));
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-white/10 bg-white/[0.04] text-zinc-50 shadow-2xl shadow-black/25">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-3xl font-semibold text-white">
          Turneus
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-zinc-400">
          Autentifica-te pentru a administra contul sau pentru a continua
          inscrierea la turneu.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {registrationSuccessMessage ? (
          <p className="mb-5 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {registrationSuccessMessage}
          </p>
        ) : null}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/30 focus:bg-white/[0.08] focus:ring-3 focus:ring-white/10"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-200"
              htmlFor="password"
            >
              Parola
            </label>
            <input
              className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/30 focus:bg-white/[0.08] focus:ring-3 focus:ring-white/10"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <Button
            className="h-10 w-full bg-white text-zinc-950 hover:bg-zinc-200"
            disabled={loading}
            type="submit"
          >
            {loading ? "Se autentifica..." : "Login"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Button
            asChild
            className="text-zinc-300 hover:text-white"
            variant="link"
          >
            <Link href={getRegisterRedirectPath(redirectPath)}>
              Nu ai cont? Creeaza cont
            </Link>
          </Button>
          <Button
            asChild
            className="text-zinc-300 hover:text-white"
            variant="link"
          >
            <Link href="/turnee">Inapoi la turnee</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getSafeRedirectPath(redirect: string | null) {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return null;
  }

  return redirect;
}

function getRegisterRedirectPath(redirectPath: string | null) {
  if (!redirectPath) {
    return "/inregistrare";
  }

  const params = new URLSearchParams({
    redirect: redirectPath,
  });

  return `/inregistrare?${params.toString()}`;
}

function getDefaultRedirectPath(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    typeof data.user === "object" &&
    data.user !== null &&
    "role" in data.user &&
    data.user.role === "ADMIN"
  ) {
    return "/admin";
  }

  return "/cont";
}

function getLoginError(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return "Autentificarea nu a reusit.";
}

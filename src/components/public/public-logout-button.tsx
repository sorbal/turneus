"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function PublicLogoutButton() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleLogout() {
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        setError("Deconectarea nu a reusit.")
        setIsSubmitting(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("Deconectarea nu a reusit.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        disabled={isSubmitting}
        onClick={handleLogout}
        size="sm"
        type="button"
        variant="ghost"
      >
        {isSubmitting ? "Se deconecteaza..." : "Deconectare"}
      </Button>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  )
}

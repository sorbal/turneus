"use client"

import { Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PublicTicketPrintButton() {
  return (
    <Button
      className="bg-white text-zinc-950 hover:bg-zinc-200 print:hidden"
      onClick={() => window.print()}
      size="lg"
      type="button"
    >
      <Printer />
      Printeaza / Salveaza PDF
    </Button>
  )
}

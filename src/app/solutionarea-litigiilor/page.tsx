import type { Metadata } from "next"

import {
  PublicLegalList,
  PublicLegalPage,
  PublicLegalSection,
} from "@/components/public/public-legal-page"

export const metadata: Metadata = {
  title: "Solutionarea litigiilor | Turneus",
  description:
    "Informatii despre contactarea Turneus si solutionarea alternativa a litigiilor prin resurse oficiale ANPC.",
}

export default function DisputeResolutionPage() {
  return (
    <PublicLegalPage
      description="Informatii pentru solutionarea amiabila si alternativa a eventualelor dispute legate de serviciile Turneus."
      eyebrow="Consumatori"
      title="Solutionarea litigiilor"
    >
      <PublicLegalSection title="Contactarea initiala Turneus">
        <p>
          Pentru orice nemultumire sau intrebare, recomandam contactarea initiala
          a Turneus la contact@turneus.ro. Vom analiza solicitarea si vom incerca
          solutionarea amiabila.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Solutionare alternativa">
        <p>
          Consumatorii pot consulta informatii oficiale ANPC privind
          solutionarea alternativa a litigiilor. Turneus nu garanteaza acceptarea
          unei anumite proceduri si nu limiteaza drepturile legale ale
          consumatorilor.
        </p>
        <PublicLegalList
          items={[
            "ANPC - Solutionare Alternativa a Litigiilor: https://anpc.ro/sal/",
            "Platforma electronica SAL mentionata in resurse oficiale ANPC: https://reclamatiisal.anpc.ro",
            "ANPC - website oficial: https://www.anpc.gov.ro",
          ]}
        />
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            href="https://anpc.ro/sal/"
            rel="noreferrer"
            target="_blank"
          >
            ANPC SAL
          </a>
          <a
            className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            href="https://reclamatiisal.anpc.ro"
            rel="noreferrer"
            target="_blank"
          >
            Platforma SAL
          </a>
          <a
            className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            href="https://www.anpc.gov.ro"
            rel="noreferrer"
            target="_blank"
          >
            ANPC
          </a>
        </div>
      </PublicLegalSection>

      <PublicLegalSection title="Nota privind ODR / SOL">
        <p>
          Platforma europeana ODR / SOL nu este inclusa aici, deoarece a fost
          inchisa la 20 iulie 2025.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Actualizare">
        <p>Data ultimei actualizari: 20.07.2026.</p>
      </PublicLegalSection>
    </PublicLegalPage>
  )
}

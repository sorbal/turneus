import type { Metadata } from "next"

import {
  PublicLegalList,
  PublicLegalPage,
  PublicLegalSection,
} from "@/components/public/public-legal-page"

export const metadata: Metadata = {
  title: "Contact | Turneus",
  description: "Datele de contact si identificare ale comerciantului Turneus.",
}

export default function ContactPage() {
  return (
    <PublicLegalPage
      description="Datele oficiale de identificare si contact pentru platforma Turneus."
      eyebrow="Contact"
      title="Contact Turneus"
    >
      <PublicLegalSection title="Date comerciant">
        <p>
          BALAN EMILIAN-SORIN PERSOANA FIZICA AUTORIZATA opereaza platforma
          Turneus.
        </p>
        <PublicLegalList
          items={[
            "Numar Registrul Comertului: F2024015512002",
            "CUI: 50870170",
            "Data inregistrarii: 13.11.2024",
            "Sediu: Bucuresti, Sector 1, Bulevardul Bucurestii Noi nr. 136, parter, ap. 5",
            "Website: https://turneus.ro",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Modalitati de contact">
        <PublicLegalList
          items={["Telefon: 0730228736", "Email: contact@turneus.ro"]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Observatie">
        <p>
          Nu exista formular de contact in acest task. Pentru solicitari, te
          rugam sa folosesti emailul sau telefonul afisat.
        </p>
        <p>Data ultimei actualizari: 20.07.2026.</p>
      </PublicLegalSection>
    </PublicLegalPage>
  )
}

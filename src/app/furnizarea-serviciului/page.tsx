import type { Metadata } from "next"

import {
  PublicLegalList,
  PublicLegalPage,
  PublicLegalSection,
} from "@/components/public/public-legal-page"

export const metadata: Metadata = {
  title: "Furnizarea serviciului | Turneus",
  description:
    "Informatii despre modul in care Turneus furnizeaza serviciul de participare la turnee.",
}

export default function ServiceDeliveryPage() {
  return (
    <PublicLegalPage
      description="Turneus comercializeaza servicii de participare la turnee, nu produse fizice."
      eyebrow="Serviciu"
      title="Furnizarea serviciului"
    >
      <PublicLegalSection title="Natura serviciului">
        <p>
          Turneus comercializeaza servicii de participare la turnee publicate pe
          platforma. Nu se livreaza produse fizice.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Cand si unde este furnizat serviciul">
        <p>
          Serviciul este furnizat la data, ora si locatia afisate in pagina
          turneului. Informatiile specifice fiecarui turneu sunt afisate in
          pagina publica a turneului.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Confirmarea participarii">
        <PublicLegalList
          items={[
            "Pentru turnee gratuite, inscrierea poate fi confirmata fara plata.",
            "Pentru turnee cu taxa, confirmarea participarii depinde de confirmarea platii.",
            "Statusul inscrierii si al platii determina dreptul de participare.",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Contact">
        <p>Pentru intrebari privind furnizarea serviciului: contact@turneus.ro.</p>
        <p>Data ultimei actualizari: 20.07.2026.</p>
      </PublicLegalSection>
    </PublicLegalPage>
  )
}

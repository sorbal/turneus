import type { Metadata } from "next"

import {
  PublicLegalList,
  PublicLegalPage,
  PublicLegalSection,
} from "@/components/public/public-legal-page"

export const metadata: Metadata = {
  title: "Anulare si rambursare | Turneus",
  description:
    "Politica Turneus pentru anularea inscrierii si rambursarea taxei de participare.",
}

export default function CancellationAndRefundPage() {
  return (
    <PublicLegalPage
      description="Regulile aplicabile pentru anularea inscrierii la turnee si rambursarea taxei de participare."
      eyebrow="Plati"
      title="Anulare si rambursare"
    >
      <PublicLegalSection title="Reguli de anulare">
        <PublicLegalList
          items={[
            "Participantul poate solicita anularea si rambursarea integrala cel tarziu cu 24 de ore inainte de data si ora inceperii turneului.",
            "Daca solicitarea este facuta cu mai putin de 24 de ore inainte, taxa de participare nu se ramburseaza.",
            "Daca turneul este anulat de Turneus sau de organizator, taxa de participare se ramburseaza integral.",
            "Durata efectiva a returnarii poate depinde de procesatorul de plata si banca emitenta.",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Cum soliciti anularea">
        <p>
          Cererile se trimit momentan prin email la contact@turneus.ro. In acest
          task nu exista formular online de anulare sau retragere.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Informatii necesare">
        <PublicLegalList
          items={[
            "Numele si prenumele participantului",
            "Emailul contului Turneus",
            "Numele turneului",
            "Data si ora turneului",
            "Dovada sau referinta platii, daca este disponibila",
            "Motivul solicitarii, daca doresti sa il mentionezi",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Contact">
        <p>Email pentru cereri: contact@turneus.ro.</p>
        <p>Data ultimei actualizari: 20.07.2026.</p>
      </PublicLegalSection>
    </PublicLegalPage>
  )
}

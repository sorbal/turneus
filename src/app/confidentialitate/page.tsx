import type { Metadata } from "next"

import {
  PublicLegalList,
  PublicLegalPage,
  PublicLegalSection,
} from "@/components/public/public-legal-page"

export const metadata: Metadata = {
  title: "Confidentialitate | Turneus",
  description:
    "Politica de confidentialitate Turneus privind prelucrarea datelor personale.",
}

export default function PrivacyPage() {
  return (
    <PublicLegalPage
      description="Aceasta politica explica modul in care Turneus prelucreaza datele personale pentru conturi, inscrieri, plati si securitatea platformei."
      eyebrow="GDPR"
      title="Confidentialitate"
    >
      <PublicLegalSection title="Operatorul de date">
        <p>
          Operatorul de date este BALAN EMILIAN-SORIN PERSOANA FIZICA
          AUTORIZATA, cu sediul in Bucuresti, Sector 1, Bulevardul Bucurestii
          Noi nr. 136, parter, ap. 5.
        </p>
        <p>
          Pentru cereri GDPR, ne poti contacta la contact@turneus.ro.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Categorii de date">
        <PublicLegalList
          items={[
            "Date de identificare si contact",
            "Date de cont",
            "Date privind inscrierile la turnee",
            "Date privind tranzactiile si platile",
            "Date tehnice necesare functionarii si securitatii platformei",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Parole si date de card">
        <p>
          Parolele nu sunt stocate in clar. Datele complete ale cardului nu sunt
          colectate sau stocate de Turneus; plata este procesata prin NETOPIA
          Payments.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Scopuri si temeiuri">
        <PublicLegalList
          items={[
            "Crearea si administrarea contului",
            "Administrarea inscrierilor si participarii la turnee",
            "Procesarea platilor si indeplinirea obligatiilor fiscale si contabile",
            "Comunicari necesare furnizarii serviciului",
            "Securitatea platformei si prevenirea abuzurilor",
            "Respectarea obligatiilor legale aplicabile",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Destinatari si furnizori">
        <p>
          Datele pot fi prelucrate prin furnizori tehnici necesari functionarii
          platformei si prin procesatorul de plata NETOPIA Payments. Datele sunt
          transmise doar in masura necesara furnizarii serviciului, securitatii,
          platii si obligatiilor legale.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Durata pastrarii">
        <p>
          Datele sunt pastrate pe durata necesara administrarii contului,
          inscrierilor si serviciilor solicitate, precum si pe durata impusa de
          obligatiile legale fiscale, contabile sau de aparare a drepturilor.
          Duratele pot varia in functie de categoria datelor si obligatiile
          aplicabile.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Drepturile persoanei vizate">
        <PublicLegalList
          items={[
            "Dreptul de acces",
            "Dreptul la rectificare",
            "Dreptul la stergere, in conditiile legii",
            "Dreptul la restrictionarea prelucrarii",
            "Dreptul la portabilitate",
            "Dreptul la opozitie",
            "Dreptul de a nu face obiectul unei decizii exclusiv automate, daca este cazul",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Plangeri">
        <p>
          Ai dreptul sa depui plangere la Autoritatea Nationala de Supraveghere
          a Prelucrarii Datelor cu Caracter Personal.
        </p>
        <p>
          Website oficial:{" "}
          <a
            className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            href="https://www.dataprotection.ro/"
            rel="noreferrer"
            target="_blank"
          >
            dataprotection.ro
          </a>
          .
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Cookies">
        <p>
          Turneus foloseste cookies de sesiune si securitate pentru autentificare
          si functionarea corecta a platformei.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Actualizare">
        <p>Data ultimei actualizari: 20.07.2026.</p>
      </PublicLegalSection>
    </PublicLegalPage>
  )
}

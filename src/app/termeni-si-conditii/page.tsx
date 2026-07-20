import type { Metadata } from "next"
import Link from "next/link"

import {
  PublicLegalList,
  PublicLegalPage,
  PublicLegalSection,
} from "@/components/public/public-legal-page"

export const metadata: Metadata = {
  title: "Termeni si conditii | Turneus",
  description:
    "Termenii si conditiile pentru folosirea platformei Turneus si participarea la turnee.",
}

export default function TermsPage() {
  return (
    <PublicLegalPage
      description="Acesti termeni stabilesc regulile principale pentru folosirea platformei Turneus, inscrierea la turnee si plata taxelor de participare."
      eyebrow="Legal"
      title="Termeni si conditii"
    >
      <PublicLegalSection title="Comerciant">
        <p>
          Platforma Turneus este operata de BALAN EMILIAN-SORIN PERSOANA
          FIZICA AUTORIZATA.
        </p>
        <PublicLegalList
          items={[
            "Numar Registrul Comertului: F2024015512002",
            "CUI: 50870170",
            "Data inregistrarii: 13.11.2024",
            "Sediu: Bucuresti, Sector 1, Bulevardul Bucurestii Noi nr. 136, parter, ap. 5",
            "Telefon: 0730228736",
            "Email: contact@turneus.ro",
            "Website: https://turneus.ro",
          ]}
        />
      </PublicLegalSection>

      <PublicLegalSection title="Rolul Turneus">
        <p>
          Turneus este comerciant direct pentru taxele de participare procesate
          prin platforma. Turneus incaseaza taxele de participare, proceseaza
          platile prin NETOPIA Payments, emite factura catre participant si
          administreaza inscrierea si confirmarea platii.
        </p>
        <p>
          Istoricul tranzactiilor, biletelor si facturilor va fi pus ulterior la
          dispozitie in cont. Aceste functionalitati sunt planificate si nu sunt
          prezentate ca disponibile in acest moment.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Serviciul Turneus">
        <p>
          Serviciul consta in accesul si participarea la turnee publicate pe
          platforma, conform informatiilor afisate pentru fiecare turneu.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Contul utilizatorului">
        <p>
          Pentru inscrierea la turnee, utilizatorul trebuie sa foloseasca un cont
          Turneus. Utilizatorul este responsabil pentru corectitudinea datelor
          introduse si pentru pastrarea confidentialitatii datelor de acces.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Inscrierea la turneu">
        <p>
          Inscrierea la un turneu se face prin pagina turneului, in limita
          locurilor disponibile si a regulilor aplicabile statusului turneului.
          Confirmarea inscrierii depinde de statusul inscrierii si, cand este
          cazul, de confirmarea platii.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Pret, moneda si plata">
        <p>
          Pretul taxei de participare si moneda RON sunt afisate inaintea
          initierii platii. Plata online este procesata prin NETOPIA Payments.
          Confirmarea inscrierii pentru turneele cu taxa se face numai dupa
          confirmarea platii prin IPN.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Furnizarea serviciului">
        <p>
          Serviciul este furnizat la data, ora si locatia afisate in pagina
          turneului. Participantul trebuie sa respecte conditiile de participare
          si indicatiile organizatorice aplicabile evenimentului.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Anulare si rambursare">
        <PublicLegalList
          items={[
            "Participantul poate solicita anularea si rambursarea integrala cel tarziu cu 24 de ore inainte de data si ora inceperii turneului.",
            "Daca solicitarea este facuta cu mai putin de 24 de ore inainte, taxa de participare nu se ramburseaza.",
            "Daca turneul este anulat de Turneus sau de organizator, taxa de participare se ramburseaza integral.",
            "Cererile se trimit momentan la contact@turneus.ro.",
            "Durata efectiva a returnarii poate depinde de procesatorul de plata si banca emitenta.",
          ]}
        />
        <p>
          Detalii suplimentare sunt disponibile in pagina{" "}
          <Link
            className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            href="/anulare-si-rambursare"
          >
            Anulare si rambursare
          </Link>
          .
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Comportament si regulament">
        <p>
          Participantii trebuie sa respecte regulamentul turneului, regulile de
          fair-play si indicatiile comunicate pentru organizarea evenimentului.
          Comportamentul abuziv, fraudulos sau contrar regulilor poate duce la
          refuzul participarii sau eliminarea din turneu.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Limitarea responsabilitatii">
        <p>
          Turneus depune eforturi rezonabile pentru functionarea platformei si
          pentru administrarea corecta a inscrierilor si platilor. Raspunderea
          este limitata in masura permisa de lege si nu exclude drepturile legale
          ale consumatorilor.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Proprietate intelectuala">
        <p>
          Denumirea Turneus, interfata, textele si elementele vizuale ale
          platformei sunt protejate conform legii. Utilizarea lor neautorizata
          nu este permisa.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Modificarea termenilor">
        <p>
          Turneus poate actualiza acesti termeni pentru a reflecta modificari
          operationale, tehnice sau legale. Versiunea aplicabila este cea
          publicata pe website la momentul folosirii serviciului.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Lege aplicabila si dispute">
        <p>
          Acesti termeni sunt guvernati de legea romana. Eventualele dispute se
          vor incerca mai intai sa fie solutionate amiabil, prin contactarea
          Turneus la contact@turneus.ro. Consumatorii pot consulta si informatii
          privind solutionarea alternativa a litigiilor.
        </p>
      </PublicLegalSection>

      <PublicLegalSection title="Contact si actualizare">
        <p>
          Pentru intrebari privind acesti termeni: contact@turneus.ro sau
          0730228736.
        </p>
        <p>Data ultimei actualizari: 20.07.2026.</p>
      </PublicLegalSection>
    </PublicLegalPage>
  )
}

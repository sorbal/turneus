# TURNEUS - CHANGELOG

Ultima actualizare: 2026-07-21

---

# v0.1.0

Data:
2026-06-13

Infrastructure

- Initializare proiect Next.js
- Configurare VPS Ubuntu
- Configurare Docker
- Configurare PostgreSQL
- Configurare Prisma

Database

- Schema Prisma initiala
- 22 modele create
- Seed initial
- Jocuri initiale
- Orase initiale
- Sezon 2026
- Badge-uri initiale

Authentication

- Register API
- Login API
- Logout API
- Current User API
- JWT Sessions
- HttpOnly Cookies
- Password Hashing

---

# v0.2.0

Data:
2026-07-02

Authorization

- getCurrentUser()
- requireAuth()
- requireAdmin()
- requireOrganizer()

Admin

- Admin Layout
- Dashboard Foundation
- Games Page
- Prima conexiune PostgreSQL -> UI

UI

- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide Icons
- Geist Font

Project

- Folder docs/
- AGENTS.md actualizat
- MASTER_PLAN rescris
- ARCHITECTURE rescris
- DEV_RULES rescris
- ROADMAP reorganizat
- PROJECT_STATUS simplificat

---

# v0.3.0

Status:
FINALIZAT

Implementat

- Dashboard modern
- Sidebar nou
- Header nou
- Cards statistici
- Responsive Layout
- Premium Admin Dashboard UI
- Games Repository
- Games Service
- Games API
- Games CRUD Task 6A
- Games CRUD Task 6B
- Games CRUD Task 6C
- Games CRUD complet
- Admin Games Table
- Add Game
- Edit Game
- Activate / Deactivate
- Delete
- Reusable Game Form
- Reusable Game Actions

# v0.4.0

Status:
FINALIZAT

Implementat

- Cities Repository
- Cities Service
- Cities API
- Admin Cities List
- Add City
- Edit City
- Delete City
- Reusable City Form
- Reusable City Actions
- Cities CRUD complet
- Organizer Repository
- Organizer Service
- Organizer API
- Admin Organizers List
- Add Organizer
- Edit Organizer
- Approve / Unapprove
- Delete Organizer
- Eligible PLAYER users only
- Role update PLAYER <-> ORGANIZER
- Organizers CRUD complet
- User Repository
- User Service
- Users API
- Admin Users List
- Edit User
- User Actions
- Search
- Activate / Deactivate
- Promote / Demote ADMIN
- Password Reset
- User Management complet
- Venue Repository
- Venue Service
- Venues API
- Admin Venues List
- Add Venue
- Edit Venue
- Delete Venue
- Reusable Venue Form
- Reusable Venue Actions
- Venues CRUD complet

# v0.5.0

Status:
IN DEZVOLTARE

Implementat

- Tournament Repository
- Tournament Service
- Tournament API
- Admin Tournaments List
- Add Tournament
- Edit Tournament
- Delete Tournament
- Tournament CRUD complet
- Link Turnee in sidebar
- Seasons Repository
- Seasons Service
- Seasons API
- Admin Seasons List
- Add Season
- Edit Season
- Activate Season
- Delete Season
- Link Sezoane in sidebar
- Seasons CRUD complet
- Tournament Lifecycle
- Tranzitie DRAFT -> OPEN
- Tranzitie OPEN -> IN_PROGRESS
- Tranzitie FULL -> IN_PROGRESS
- Tranzitie IN_PROGRESS -> COMPLETED
- Tournament Registrations Repository
- Tournament Registrations Service
- Tournament Registrations API
- Admin Registrations List
- Admin Registration Actions
- Admin Add Registration
- Link Inscrieri in sidebar
- Tournament Registrations complet pentru MVP admin
- Public Foundation
- Public Header
- Public Footer
- Public Shell
- Homepage publica
- Public Tournament Cards
- Public Tournament Grid
- Public Tournament List /turnee
- Public Tournament Filters
- Tournament Status UI helper
- Traducere statusuri turnee in limba romana
- Public Tournament Details /turnee/[slug]
- Date publice turneu
- Statusuri publice turneu
- Locuri active fara inscrieri CANCELLED
- Metadata dinamica si notFound
- Registration Flow public
- Inscriere publica PLAYER / ORGANIZER
- ADMIN blocat in flow public
- Organizator blocat la propriul turneu
- Turneu gratuit -> CONFIRMED
- Turneu cu taxa -> PENDING_PAYMENT
- Reactivare inscriere CANCELLED
- Protectie capacitate cu tranzactie Serializable
- UI inscriere publica
- Redirect inapoi dupa autentificare
- Statusuri publice ale inscrierii
- Payment Repository
- Payment Service
- Payments API
- NETOPIA API v1 request XML criptat AES-256-CBC + RSA
- NETOPIA Sandbox configurat
- Redirect catre NETOPIA
- IPN public securizat
- Validare signature, suma, moneda si payment
- Update atomic Payment + Registration
- Idempotenta callback NETOPIA
- Pagina /plata/rezultat
- Plata Sandbox de 1 RON testata cu succes
- Payment PAID si Registration CONFIRMED verificate
- Compatibilitate OpenSSL pentru decriptarea IPN
- Cookie auth compatibil apex/www la revenirea din NETOPIA
- Homepage: Turnee OPEN inlocuit cu Membri Turneus activi
- Login public dark premium

Data:
2026-07-21

Legal / Compliance

- Public Legal & Compliance Pages
- Pagina /termeni-si-conditii
- Pagina /confidentialitate
- Pagina /anulare-si-rambursare
- Pagina /furnizarea-serviciului
- Pagina /solutionarea-litigiilor
- Pagina /contact
- Date complete comerciant afisate public
- Rol Turneus ca comerciant direct
- Politica rambursare: integral cu minimum 24h inainte
- Politica rambursare: nerambursabil sub 24h
- Politica rambursare: integral daca turneul este anulat de Turneus sau organizator
- Footer public cu linkuri juridice
- Asset oficial NETOPIA Payments + Mastercard + Visa in footer

Checkout

- Checkbox obligatoriu pentru Termeni si conditii si Politica de anulare
- Buton Plateste blocat pana la acceptare
- POST /api/payments valideaza termsAccepted === true
- Acceptarea nu are audit persistent in schema actuala

Account

- Player Account Dashboard /cont
- Datele contului autentificat
- Inscrieri proprii
- Status inscriere
- Status plata si suma
- Link spre pagina publica a turneului
- Separare repository -> service -> page
- Fara expunere providerRef sau date NETOPIA interne
- Pagina publica /inregistrare
- Creare publica conturi PLAYER
- Acceptare obligatorie Termeni si Confidentialitate
- POST /api/auth/register valideaza termsAccepted === true
- Login redirect ADMIN -> /admin
- Login redirect PLAYER / ORGANIZER -> /cont
- Redirect explicit prioritar
- PublicHeader adaptat starii autentificate
- Logout public functional

Digital Ticket

- Digital Tournament Ticket
- Ruta privata /cont/bilete/[registrationId]
- Ownership impus prin registrationId + userId din sesiune
- Disponibil doar pentru CONFIRMED si CHECKED_IN
- Date participant, turneu, locatie, data, plata si referinta
- Fara providerRef sau date interne
- Buton Printeaza / Salveaza PDF prin window.print()
- Layout print A4 compact
- Print verificat manual 1/1
- Link Vezi biletul in /cont

Refund Request

- RefundRequest Data Foundation
- Enum RefundRequestStatus: PENDING, APPROVED, REJECTED, PROCESSED
- Enum RefundRequestSource: USER, TOURNAMENT_CANCELLATION, ADMIN
- Model RefundRequest
- Relatii 1-la-1 cu Registration si Payment
- Relatii cu participantul si administratorul procesator
- Unique pe registrationId si paymentId
- Migrarea 20260721143000_add_refund_requests
- Migrarea aplicata cu succes pe PostgreSQL prin prisma migrate deploy
- POST /api/refund-requests
- Ruta privata /cont/rambursare/[registrationId]
- Formular motiv 10-500 caractere
- Confirmare Politica de anulare si rambursare
- Ownership server-side
- requestedAmount preluat din Payment.amount
- Doar Registration CONFIRMED + Payment PAID
- Minimum 24h complete inainte de turneu
- Exact 24h este eligibil
- Sub 24h requestul API este salvat REJECTED
- Cerere eligibila este PENDING
- Duplicate idempotente
- Tranzactie Serializable cu protectie P2002 / P2034
- Payment si Registration raman nemodificate cat timp cererea este PENDING
- /cont afiseaza statusul cererii
- Buton Solicita rambursarea afisat doar pentru canRequestRefund true
- Corectie eligibilitate temporala pentru butonul de rambursare
- Cupa Braila, deja inceputa, verificata manual fara buton de rambursare
- Ruta directa nu afiseaza formularul dupa expirarea termenului

Testare

- npm run build trecut
- Paginile juridice si linkurile footerului testate local
- Contul player2 afiseaza Registration CONFIRMED si Payment PAID
- Contul player3 afiseaza corect empty state
- Creare cont, login si logout testate manual
- Cont nou player3 testat manual
- Bilet digital verificat manual cu print A4 1/1
- User Refund Request Flow testat manual
- Corectia eligibilitatii temporale testata manual pentru Cupa Braila

Urmeaza

- Teste finale NETOPIA
- Trecere controlata pe NETOPIA LIVE
- Audit persistent pentru acceptarea versiunii termenilor
- Lista si administrarea RefundRequest in admin
- Aprobare / respingere manuala cereri rambursare
- Procesare RefundRequest si trecere la PROCESSED
- Refund automat prin NETOPIA
- Generare si descarcare facturi
- QR code si validare scan pentru bilet
- PDF generat server-side pentru bilet
- Sincronizare RefundRequest cu IPN credit / refund
- Anulare automata Registration dupa refund confirmat
- Rambursari automate de masa pentru turneu anulat
- Notificari email
- Istoric financiar complet
- Financial Calculation Engine

Note

- Netopia Sandbox este functional.
- Productia NETOPIA nu este activata in aplicatie.
- NETOPIA LIVE ramane neactivat.
- Trecerea pe LIVE se face controlat dupa verificarile finale.
- Refund-ul extern NETOPIA nu este implementat.

---

# FORMAT

Fiecare versiune trebuie sa contina:

- Data
- Functionalitati noi
- Modificari
- Refactorizari importante
- Schimbari de arhitectura

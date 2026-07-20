# TURNEUS - PROJECT STATUS

Ultima actualizare: 2026-07-21

---

# STATUS GENERAL

Proiect:
ACTIV

Versiune:
v0.5.0

Sprint curent:
Sprint 5

Status Sprint:
IN DEZVOLTARE

Brand:
Turneus

Repository:
CLEAN

Branch:
main

---

# STACK

Frontend

- Next.js 16
- React 19
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide Icons

Backend

- Next.js Route Handlers

Database

- PostgreSQL 16

ORM

- Prisma 7

Authentication

- JWT
- HttpOnly Cookies

Hosting

- Ubuntu VPS
- Docker

---

# MODULE STATUS

Infrastructure

STATUS

FINALIZATA

Implementat

- VPS
- Ubuntu
- Docker
- PostgreSQL
- Prisma
- Git

---

Database

STATUS

FINALIZATA

Implementat

- Schema Prisma
- 23 modele
- Migration
- Seed
- Jocuri
- Orase
- Badge-uri
- Sezon 2026
- RefundRequest
- Migrarea 20260721143000_add_refund_requests aplicata cu succes prin prisma migrate deploy

---

Financial System

STATUS

PLANIFICAT / NEIMPLEMENTAT

Reguli oficiale

- Fond total = taxa de participare x numarul participantilor eligibili financiar
- Fond premii: 70%
- Organizator: 20%
- Platforma Turneus: 10%
- Locul 1: 50% din fondul de premiere
- Locul 2: 30% din fondul de premiere
- Locul 3: 20% din fondul de premiere

Deja existent

- Modelul Payment
- Modelul RefundRequest
- Plati NETOPIA Sandbox
- Campurile prizePoolAmount, organizerCommission si platformCommission in Tournament
- Cereri publice de rambursare salvate ca RefundRequest
- Cerere eligibila -> PENDING
- Cerere sub 24h -> REJECTED
- requestedAmount preluat server-side din Payment.amount

Neimplementat

- Calcul automat fond total
- Calcul automat 70% / 20% / 10%
- Recalculare dupa plati confirmate si refund-uri
- Calcul premii locurile 1, 2 si 3
- Evidenta sumelor datorate organizatorilor
- Rapoarte financiare
- Plati / decontari catre organizatori
- Istoric financiar si audit
- Lista si administrarea RefundRequest in admin
- Aprobare / respingere manuala de administrator
- Refund extern automat prin NETOPIA
- Procesarea cererii si trecerea la PROCESSED
- Sincronizarea RefundRequest cu IPN credit / refund
- Anularea automata Registration dupa refund confirmat
- Rambursari automate de masa pentru turneu anulat

De stabilit inainte de implementare

- Regula exacta pentru participant eligibil financiar
- Tratamentul PAID
- Tratamentul CONFIRMED la turnee gratuite
- Tratamentul PENDING_PAYMENT
- Tratamentul CANCELLED
- Tratamentul REFUNDED

---

Authentication

STATUS

FINALIZATA

Implementat

- Register
- Login
- Logout
- Current User
- JWT
- HttpOnly Cookies
- Password Hashing

---

Authorization

STATUS

IN DEZVOLTARE

Implementat

- getCurrentUser()
- requireAuth()
- requireAdmin()
- requireOrganizer()

Urmeaza

- middleware
- Protected Routes

---

Admin Panel

STATUS

IN DEZVOLTARE

Implementat

- Admin Layout
- Dashboard Foundation
- Games Page
- Prima listare PostgreSQL
- Premium Admin Dashboard
- Premium Admin Sidebar
- Premium Admin Header
- Premium Dashboard Cards
- Games Repository
- Games Service
- Games API
- Games CRUD Task 6C
- Admin Games Table
- Formular adaugare joc
- Formular editare joc
- Actiuni activare / dezactivare / stergere
- Cities Repository
- Cities Service
- Cities API
- Admin Cities List
- Formular adaugare oras
- Formular editare oras
- Actiuni stergere oras
- Cities CRUD complet
- Organizer Repository
- Organizer Service
- Organizer API
- Admin Organizers List
- Formular adaugare organizator
- Formular editare organizator
- Actiuni aprobare / retragere aprobare / stergere organizator
- Useri eligibili doar cu rol PLAYER
- Role update PLAYER <-> ORGANIZER
- Organizers CRUD complet
- User Repository
- User Service
- Users API
- Admin Users List
- Formular editare utilizator
- Actiuni activare / dezactivare utilizator
- Actiuni promovare / retrogradare ADMIN
- Resetare parola utilizator
- Cautare utilizatori
- User Management complet
- Venue Repository
- Venue Service
- Venues API
- Admin Venues List
- Formular adaugare locatie
- Formular editare locatie
- Actiuni stergere locatie
- Link Locatii in sidebar
- Venues CRUD complet
- Tournament Repository
- Tournament Service
- Tournament API
- Admin Tournaments List
- Formular adaugare turneu
- Formular editare turneu
- Actiuni stergere turneu
- Link Turnee in sidebar
- Tournament CRUD complet
- Seasons Repository
- Seasons Service
- Seasons API
- Admin Seasons List
- Formular adaugare sezon
- Formular editare sezon
- Actiuni activare / stergere sezon
- Link Sezoane in sidebar
- Seasons CRUD complet
- Tournament Lifecycle
- Actiuni deschidere / pornire / finalizare turneu
- Tournament Registrations Repository
- Tournament Registrations Service
- Tournament Registrations API
- Admin Registrations List
- Actiuni check-in / anulare inscriere
- Formular adaugare inscriere
- Link Inscrieri in sidebar
- Tournament Registrations MVP complet
- Public Tournament Details
- Registration Flow public
- Netopia Sandbox Integration
- Payment Repository
- Payment Service
- Payments API
- NETOPIA API v1 request criptat
- NETOPIA IPN public securizat
- Pagina rezultat plata /plata/rezultat
- Public Legal & Compliance Pages
- Pagini /termeni-si-conditii, /confidentialitate, /anulare-si-rambursare, /furnizarea-serviciului, /solutionarea-litigiilor, /contact
- Date complete comerciant
- Rol Turneus comerciant direct
- Politica rambursare 24h
- Footer public cu linkuri juridice
- Asset oficial NETOPIA Payments + Mastercard + Visa
- Checkout Legal Acceptance
- POST /api/payments valideaza termsAccepted === true
- Player Account Dashboard /cont
- Digital Tournament Ticket /cont/bilete/[registrationId]
- Bilet disponibil doar pentru CONFIRMED si CHECKED_IN
- Ownership bilet prin registrationId + userId din sesiune
- Print A4 compact prin window.print()
- Link Vezi biletul in /cont
- Public Account Access
- Pagina publica /inregistrare
- Creare publica conturi PLAYER
- Logout public functional
- RefundRequest Data Foundation
- Enum RefundRequestStatus
- Enum RefundRequestSource
- Relatii RefundRequest cu Registration, Payment si User
- User Refund Request Flow
- POST /api/refund-requests
- Ruta privata /cont/rambursare/[registrationId]
- Formular motiv rambursare 10-500 caractere
- Confirmare Politica de anulare si rambursare
- Eligibility canRequestRefund in /cont

Urmeaza

- Teste finale NETOPIA
- Trecere controlata pe NETOPIA LIVE
- Audit persistent pentru acceptarea versiunii termenilor
- Lista si administrarea RefundRequest in admin
- Aprobare / respingere manuala cereri rambursare
- Procesare RefundRequest catre PROCESSED
- Refund automat prin NETOPIA
- Generare si descarcare facturi
- QR code si validare scan pentru bilet
- PDF generat server-side pentru bilet

---

UI

STATUS

IN DEZVOLTARE

Implementat

- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide Icons
- Geist Font
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
- Public Tournament Details /turnee/[slug]
- Public Registration Action
- Login public dark premium
- Redirect inapoi dupa autentificare
- Pagina rezultat plata
- Homepage metric Membri Turneus activi
- Public Legal Pages
- Public Footer Legal Links
- Public Payment Trust Asset
- Checkout Legal Acceptance
- Player Account Dashboard /cont
- Digital Tournament Ticket /cont/bilete/[registrationId]
- Public Registration /inregistrare
- Public Logout
- User Refund Request Flow
- Ruta /cont/rambursare/[registrationId]

Design ales

- Linear
- Dark Theme

---

# STRUCTURA DOCUMENTATIE

docs/

- TURNEUS_MASTER_PLAN.md
- ARCHITECTURE.md
- DEV_RULES.md
- ROADMAP.md
- CHANGELOG.md
- PROJECT_STATUS.md

AGENTS.md

---

# ULTIMA SESIUNE

Finalizat

- Epic 2 finalizat
- Premium Admin Dashboard UI
- Epic 3 inceput
- Games Repository
- Games Service
- Games API
- Games CRUD Task 6A finalizat
- Games CRUD Task 6B finalizat
- Games CRUD Task 6C finalizat
- Games CRUD complet finalizat
- v0.4.0 inceput
- Cities CRUD finalizat
- Organizers CRUD finalizat
- User Management finalizat
- Venues CRUD finalizat
- Tournament CRUD finalizat
- Seasons CRUD finalizat
- Tournament Lifecycle implementat
- Tournament Registrations implementat
- Public Foundation implementat
- Homepage publica implementata
- Public Tournament Cards implementate
- Public Tournament List /turnee implementata
- Tournament Status UI helper implementat
- Public Tournament Details implementat
- Pagina /turnee/[slug]
- Date publice turneu
- Statusuri publice turneu
- Locuri active fara inscrieri CANCELLED
- Metadata si notFound pentru turnee publice
- Registration Flow public implementat
- Inscriere publica PLAYER / ORGANIZER
- ADMIN blocat in flow public
- Organizator blocat la propriul turneu
- Turneu gratuit -> CONFIRMED
- Turneu cu taxa -> PENDING_PAYMENT
- Reactivare inscriere CANCELLED
- Protectie capacitate cu tranzactie Serializable
- UI inscriere publica si redirect dupa login
- Statusuri publice ale inscrierii
- Netopia Sandbox Integration implementata
- Payment Repository
- Payment Service
- Payments API
- NETOPIA API v1 request XML criptat AES-256-CBC + RSA
- Sandbox configurat
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
- Public Legal & Compliance Pages implementate
- Pagina /termeni-si-conditii
- Pagina /confidentialitate
- Pagina /anulare-si-rambursare
- Pagina /furnizarea-serviciului
- Pagina /solutionarea-litigiilor
- Pagina /contact
- Date complete comerciant documentate in UI
- Rol Turneus ca comerciant direct
- Politica rambursare: integral cu minimum 24h inainte
- Politica rambursare: nerambursabil sub 24h
- Politica rambursare: integral daca turneul este anulat de Turneus sau organizator
- Footer public cu linkuri juridice
- Asset oficial NETOPIA Payments + Mastercard + Visa in footer
- Checkout Legal Acceptance implementat
- Checkbox obligatoriu pentru Termeni si conditii si Politica de anulare
- Buton Plateste blocat pana la acceptare
- POST /api/payments valideaza termsAccepted === true
- Acceptarea nu are audit persistent in schema actuala
- Player Account Dashboard implementat
- Ruta privata /cont
- Date cont autentificat
- Inscrieri proprii
- Status inscriere si status plata
- Suma plata si link spre turneu
- Separare repository -> service -> page
- Fara expunere providerRef sau date interne
- Public Account Access implementat
- Pagina /inregistrare
- Creare publica conturi PLAYER
- Acceptare obligatorie Termeni si Confidentialitate
- POST /api/auth/register valideaza termsAccepted === true
- Login redirect ADMIN -> /admin
- Login redirect PLAYER / ORGANIZER -> /cont
- Redirect explicit prioritar
- PublicHeader adaptat starii autentificate
- Logout public functional
- Cont nou player3 testat manual
- /cont testat pentru ADMIN, PLAYER cu inscriere si PLAYER fara inscrieri
- Paginile juridice si linkurile footerului testate local
- Contul player2 afiseaza Registration CONFIRMED si Payment PAID
- Contul player3 afiseaza empty state
- Creare cont, login si logout testate manual
- Digital Tournament Ticket implementat
- Ruta privata /cont/bilete/[registrationId]
- Ownership bilet impus prin registrationId + userId din sesiune
- Bilet disponibil doar pentru CONFIRMED si CHECKED_IN
- Date participant, turneu, locatie, data, plata si referinta
- Fara expunere providerRef sau date interne pe bilet
- Buton Printeaza / Salveaza PDF prin window.print()
- Layout print A4 compact
- Bilet verificat manual ca incape pe o singura pagina 1/1
- Link Vezi biletul in /cont
- Refund Request Data Foundation implementat
- Enum RefundRequestStatus: PENDING, APPROVED, REJECTED, PROCESSED
- Enum RefundRequestSource: USER, TOURNAMENT_CANCELLATION, ADMIN
- Model RefundRequest
- Relatii 1-la-1 cu Registration si Payment
- Relatii cu participantul si administratorul procesator
- Unique pe registrationId si paymentId
- Migrarea 20260721143000_add_refund_requests aplicata cu succes pe PostgreSQL prin prisma migrate deploy
- User Refund Request Flow implementat
- POST /api/refund-requests
- Ruta privata /cont/rambursare/[registrationId]
- Formular cu motiv 10-500 caractere
- Confirmare Politica de anulare si rambursare
- Ownership server-side
- requestedAmount luata din Payment.amount
- Doar Registration CONFIRMED + Payment PAID
- Minimum 24h complete inainte de turneu
- Exact 24h ramane eligibil
- Sub 24h requestul API este salvat REJECTED
- Cerere eligibila este PENDING
- Duplicatele sunt idempotente
- Tranzactie Serializable cu protectie P2002 / P2034
- Payment si Registration nu sunt modificate cat timp cererea este PENDING
- /cont afiseaza statusul cererii
- Butonul Solicita rambursarea apare doar daca canRequestRefund este true
- Cupa Braila, deja inceputa, verificata manual fara buton de rambursare
- Ruta directa nu afiseaza formularul dupa expirarea termenului

---

# NEXT STEP

Sprint 5

Obiective

- Teste finale NETOPIA
- Trecere controlata pe NETOPIA LIVE
- Audit persistent pentru acceptarea versiunii termenilor
- Cerere online structurata de anulare / rambursare
- Lista si administrarea RefundRequest in admin
- Aprobare / respingere manuala cereri rambursare
- Procesare RefundRequest si trecere la PROCESSED
- Refund automat prin NETOPIA
- Generare si descarcare facturi
- Sincronizare RefundRequest cu IPN credit / refund
- Anulare automata Registration dupa refund confirmat
- Rambursari automate de masa pentru turneu anulat
- Notificari email
- Audit persistent pentru versiunea termenilor
- QR code si validare scan pentru bilet
- PDF generat server-side pentru bilet
- Facturi
- Istoric financiar complet
- Financial Calculation Engine

Note

- v0.5.0 ramane IN DEZVOLTARE.
- Netopia Sandbox este functional.
- Productia NETOPIA nu este activata in aplicatie.
- NETOPIA LIVE ramane neactivat.
- Trecerea pe LIVE se face controlat dupa verificarile finale.

---

# GIT

Ultimul status

working tree cu modificari necomise

Ultima verificare

2026-07-21

---

# REFERINTE

Arhitectura:
ARCHITECTURE.md

Reguli dezvoltare:
DEV_RULES.md

Plan dezvoltare:
ROADMAP.md

Scop proiect:
TURNEUS_MASTER_PLAN.md

Istoric:
CHANGELOG.md

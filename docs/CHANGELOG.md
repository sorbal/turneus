# TURNEUS - CHANGELOG

Ultima actualizare: 2026-07-17

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

Urmeaza

- Pagini juridice / compliance NETOPIA
- Acceptarea termenilor la checkout
- Teste finale NETOPIA
- Trecere controlata pe NETOPIA LIVE

Note

- Netopia Sandbox este functional.
- Productia NETOPIA nu este activata in aplicatie.

---

# FORMAT

Fiecare versiune trebuie sa contina:

- Data
- Functionalitati noi
- Modificari
- Refactorizari importante
- Schimbari de arhitectura

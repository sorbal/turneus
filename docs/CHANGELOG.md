# TURNEUS - CHANGELOG

Ultima actualizare: 2026-07-16

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
IN DEZVOLTARE

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

Urmeaza

- Cities CRUD
- Organizers CRUD

---

# v0.4.0

Status:
IN DEZVOLTARE

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

Urmeaza

- Tournament CRUD

---

# FORMAT

Fiecare versiune trebuie sa contina:

- Data
- Functionalitati noi
- Modificari
- Refactorizari importante
- Schimbari de arhitectura

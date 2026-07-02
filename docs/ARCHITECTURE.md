# TURNEUS - ARCHITECTURE

Ultima actualizare: 2026-07-02

---

# SCOP

Acest document descrie arhitectura oficiala a proiectului Turneus.

Orice dezvoltare noua trebuie sa respecte aceasta arhitectura.

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

Mobile

- React Native
- Expo

---

# STRUCTURA PROIECT

```
docs/

prisma/

public/

src/

    app/

    components/

        ui/

        admin/

        forms/

        layout/

        shared/

    hooks/

    lib/

        auth/

    repositories/

    services/

    generated/

    types/
```

---

# RESPONSABILITATI

docs/

Documentatia proiectului.

prisma/

Schema bazei de date.

app/

Paginile aplicatiei.

components/

Toate componentele reutilizabile.

lib/

Helpere.

services/

Business Logic.

repositories/

Acces la baza de date.

hooks/

Custom React Hooks.

types/

Tipuri TypeScript.

---

# ARHITECTURA

Client

↓

Frontend

↓

API

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL

---

# REGULA PRINCIPALA

Business Logic NU se scrie in pagini.

Business Logic merge in:

services/

Accesul la baza de date merge in:

repositories/

---

# UI

Toata interfata foloseste:

Tailwind CSS

shadcn/ui

Nu se folosesc:

- Bootstrap
- Material UI
- CSS Framework-uri suplimentare

---

# COMPONENTE

Componente generice

components/ui

Componente Admin

components/admin

Componente formulare

components/forms

Componente comune

components/shared

---

# AUTENTIFICARE

Toata autentificarea foloseste:

JWT

HttpOnly Cookies

Helpere existente:

- getCurrentUser()
- requireAuth()
- requireAdmin()
- requireOrganizer()

---

# DATABASE

Toate modificarile bazei de date se fac prin Prisma.

Nu se modifica manual PostgreSQL.

Flux:

schema.prisma

↓

Migration

↓

Prisma Generate

↓

Build

---

# API

Toate endpointurile sunt in:

src/app/api

Structura:

api/

auth/

games/

cities/

organizers/

tournaments/

players/

payments/

notifications/

---

# ADMIN PANEL

Toata administrarea platformei este in:

src/app/admin

Fiecare modul va avea propriul director.

Exemplu:

admin/

games/

cities/

organizers/

tournaments/

users/

ads/

settings/

---

# MOBILE

Aplicatia mobila va folosi exact acelasi API.

Nu se vor crea endpointuri separate.

---

# SCALABILITATE

Platforma trebuie sa permita:

- adaugarea de jocuri noi
- adaugarea de tari noi
- adaugarea de limbi noi
- aplicatie mobila
- extindere internationala

fara modificari majore ale arhitecturii.

---

# PRINCIPII

- Cod simplu.
- Cod reutilizabil.
- Fara duplicare.
- Module independente.
- Componente reutilizabile.
- Arhitectura scalabila.
- TypeScript strict.

---

# REGULA FINALA

Orice dezvoltare noua trebuie sa respecte aceasta arhitectura.

Nu se modifica arhitectura fara un motiv bine justificat.

# TURNEUS PRO - ARCHITECTURE

Ultima actualizare: 2026-07-01

---

# FILOZOFIA PROIECTULUI

Turneus Pro nu este doar un site.

Este o platformă completă pentru organizarea turneelor recreative și competiționale.

Toate deciziile tehnice trebuie să urmărească:

- scalabilitate
- claritate
- mentenanță ușoară
- reutilizarea codului
- performanță

Nu se acceptă soluții rapide ("quick fixes") dacă afectează arhitectura pe termen lung.

---

# STACK

Frontend

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide Icons

Backend

- Next.js Route Handlers

ORM

- Prisma

Database

- PostgreSQL

Autentificare

- JWT
- HttpOnly Cookies

Hosting

- VPS Ubuntu
- Docker

Viitor

- React Native (Expo)

---

# STRUCTURA DIRECTOARELOR

src/

app/
→ Pagini și API

components/
→ Componente reutilizabile

lib/
→ Utilitare

services/
→ Business Logic

repositories/
→ Acces baza de date

generated/
→ Prisma Client

---

# REGULI

Paginile NU conțin logică de business.

Business logic → services/

Acces DB → repositories/

Prisma nu trebuie apelat direct din foarte multe locuri.

---

# AUTHENTICATION

Toate autentificările folosesc:

JWT

HttpOnly Cookies

Funcții standard:

getCurrentUser()

requireAuth()

requireAdmin()

requireOrganizer()

---

# DESIGN

Nu folosim stiluri inline decât temporar.

Componentele trebuie construite folosind:

- Tailwind
- shadcn/ui

Design minimalist.

Inspirat din:

- Vercel
- Stripe
- Linear
- GitHub

---

# DATABASE

Toate modificările bazei de date trec prin Prisma.

Ordinea este întotdeauna:

schema.prisma

↓

Migration

↓

Generate

↓

Build

↓

Commit

---

# GIT

Commits mici.

Commits descriptive.

Niciodată:

"fix"

"update"

"test"

Preferat:

Added tournament registration API

Implemented admin dashboard

Added player ranking system

---

# CODE STYLE

TypeScript strict.

Cod simplu.

Funcții mici.

Fără duplicare.

Comentarii doar unde sunt necesare.

---

# CODEX

Codex este folosit pentru accelerarea dezvoltării.

Codex NU decide arhitectura.

Codex NU modifică regulile de business.

Codex implementează module respectând:

MASTER_PLAN.md

ROADMAP.md

ARCHITECTURE.md

---

# ORDINEA DE DEZVOLTARE

1.

Business Rules

↓

2.

Database

↓

3.

API

↓

4.

Frontend

↓

5.

Testing

↓

6.

Commit

---

# PRINCIPIU

Mai bine o funcționalitate completă decât zece funcționalități începute.

Fiecare modul trebuie finalizat înainte de a începe următorul.

---

# OBIECTIV FINAL

Construirea celei mai complete platforme pentru organizarea turneelor din România, cu posibilitate de extindere internațională și aplicații mobile dedicate.

# TURNEUS PRO - DEVELOPMENT RULES

Ultima actualizare: 2026-07-01

---

# SCOP

Acest document stabilește regulile de dezvoltare ale proiectului Turneus Pro.

Toate modificările trebuie să respecte aceste reguli.

---

# REGULA 1

Nu se sare peste pași.

Se dezvoltă incremental.

---

# REGULA 2

După fiecare pas important se execută:

npm run build

Dacă build-ul nu trece:

NU se continuă.

---

# REGULA 3

Nu se face commit dacă există erori.

Obligatoriu:

git status

trebuie să fie curat după commit.

---

# REGULA 4

Fiecare funcționalitate trebuie testată.

Exemple:

✔ API

✔ UI

✔ Database

✔ Permissions

---

# REGULA 5

Nu se implementează funcționalități pe jumătate.

Exemplu:

Greșit

✔ Pagina Jocuri

✘ Fără editare

✘ Fără ștergere

Corect

✔ Listare

✔ Adăugare

✔ Editare

✔ Ștergere

✔ Validare

✔ Testare

✔ Commit

---

# REGULA 6

Business Logic nu se scrie în pagini.

Business Logic

↓

services/

Acces baza de date

↓

repositories/

---

# REGULA 7

Nu duplicăm cod.

Dacă aceeași logică apare de două ori:

Se extrage într-o funcție reutilizabilă.

---

# REGULA 8

Orice bibliotecă nouă trebuie justificată.

Nu instalăm pachete doar pentru că există.

---

# REGULA 9

Commits mici și descriptive.

Exemple:

Added admin dashboard

Implemented game CRUD

Added tournament registration

Nu:

update

fix

test

---

# REGULA 10

La finalul fiecărei sesiuni:

✔ npm run build

✔ git status

✔ commit

✔ PROJECT_STATUS.md actualizat

✔ ROADMAP.md actualizat (dacă este cazul)

---

# REGULA 11

Codex este folosit pentru accelerarea dezvoltării.

Nu pentru proiecte generate integral.

Codex primește întotdeauna context:

MASTER_PLAN.md

PROJECT_STATUS.md

ROADMAP.md

ARCHITECTURE.md

DEV_RULES.md

---

# REGULA 12

Orice modul nou urmează aceeași ordine:

1.

Database

↓

2.

Backend API

↓

3.

Frontend

↓

4.

Testare

↓

5.

Build

↓

6.

Commit

---

# REGULA 13

Nu optimizăm prematur.

Mai întâi funcționalitate corectă.

Apoi optimizare.

---

# REGULA 14

Toate deciziile importante se documentează.

Nu trebuie să existe "decizii uitate".

---

# REGULA 15

Obiectivul este calitatea, nu viteza.

Preferăm:

✔ cod curat

✔ arhitectură clară

✔ funcționalități complete

în locul unui număr mare de funcționalități incomplete.

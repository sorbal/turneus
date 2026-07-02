# TURNEUS - DEVELOPMENT RULES

Ultima actualizare: 2026-07-02

---

# SCOP

Acest document defineste regulile oficiale de dezvoltare ale proiectului Turneus.

Toate modificarile trebuie sa respecte aceste reguli.

---

# REGULA 1

Nu se sare peste pasi.

Se dezvolta incremental.

Nu se implementeaza mai multe module simultan.

---

# REGULA 2

Dupa fiecare etapa importanta se ruleaza:

```bash
npm run build
```

Daca build-ul nu trece:

STOP.

Problema se rezolva inainte de a continua.

---

# REGULA 3

Nu se face commit daca exista erori.

Obligatoriu:

```bash
git status
```

Repository-ul trebuie sa fie curat dupa fiecare commit.

---

# REGULA 4

Fiecare modul trebuie terminat complet.

Ordinea obligatorie:

Business Rules

↓

Database

↓

Backend

↓

Frontend

↓

Testing

↓

Build

↓

Commit

---

# REGULA 5

Nu se lasa functionalitati pe jumatate.

Exemplu gresit:

- Listare Jocuri

Exemplu corect:

- Listare
- Adaugare
- Editare
- Stergere
- Validari
- Testare
- Build
- Commit

---

# REGULA 6

Business Logic NU se scrie in pagini.

Business Logic:

```
services/
```

Acces baza de date:

```
repositories/
```

---

# REGULA 7

Nu duplicam cod.

Daca acelasi cod apare de doua ori:

Se extrage intr-o functie sau componenta reutilizabila.

---

# REGULA 8

Toata interfata foloseste:

- Tailwind CSS
- shadcn/ui

Nu se folosesc:

- Bootstrap
- Material UI
- stiluri inline

---

# REGULA 9

Preferam:

Server Components

Client Components doar cand sunt necesare.

---

# REGULA 10

TypeScript strict.

Nu se foloseste:

```
any
```

decat daca este absolut necesar.

---

# REGULA 11

Toate componentele trebuie sa fie reutilizabile.

Nu se copiaza componente identice.

---

# REGULA 12

Toate fisierele noi trebuie organizate conform arhitecturii oficiale.

---

# REGULA 13

Nu se instaleaza librarii noi fara motiv.

Mai intai verificam daca exista deja o solutie in proiect.

---

# REGULA 14

Commits mici si descriptive.

Exemple bune:

Added games CRUD

Implemented admin dashboard

Added cities API

Exemple rele:

update

fix

test

---

# REGULA 15

La finalul fiecarei sesiuni:

```bash
npm run build
```

```bash
git status
```

```bash
git commit
```

Repository-ul trebuie sa ramana CLEAN.

---

# REGULA 16

Documentatia se actualizeaza doar daca este necesar.

Ordinea:

PROJECT_STATUS.md

CHANGELOG.md

ROADMAP.md

Nu se modifica inutil documentatia.

---

# REGULA 17

Codex este folosit pentru accelerarea dezvoltarii.

Nu decide:

- arhitectura
- business rules
- structura bazei de date

Inainte de orice task Codex trebuie sa citeasca:

docs/

si

AGENTS.md

---

# REGULA 18

ChatGPT are rolul de Technical Lead.

Responsabilitati:

- arhitectura
- planificare
- code review
- workflow
- prioritizare
- integrarea codului generat de AI

---

# REGULA 19

Scopul proiectului este calitatea.

Nu viteza.

Preferam:

- cod curat
- arhitectura clara
- module complete
- proiect usor de intretinut

---

# REGULA 20

Aceste reguli reprezinta standardul oficial de dezvoltare al proiectului Turneus.

Orice dezvoltare noua trebuie sa respecte acest document.

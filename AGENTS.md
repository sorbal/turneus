# Turneus Pro - AI Agent Instructions

## Before making any change

Always read the following documentation first:

- docs/TURNEUS_MASTER_PLAN.md
- docs/PROJECT_STATUS.md
- docs/ROADMAP.md
- docs/ARCHITECTURE.md
- docs/DEV_RULES.md
- docs/CHANGELOG.md

---

## Architecture

- Respect the existing architecture.
- Do not modify business rules.
- Do not change database schema unless explicitly requested.
- Do not introduce unnecessary dependencies.

---

## Development Workflow

Every completed task must follow this order:

1. Implement
2. Test
3. Run:

npm run build

4. Verify:

git status

5. Commit with a descriptive message.

---

## Coding Rules

- TypeScript strict.
- Keep functions small.
- Avoid duplicated code.
- Prefer reusable components.
- Use shadcn/ui components.
- Use Tailwind CSS.
- Avoid inline styles.
- Prefer Server Components when possible.

---

## Git

Never leave the repository in a broken state.

Never commit code that does not compile.

Commits must be descriptive.

---

## Goal

Build a scalable, maintainable and production-ready tournament platform.

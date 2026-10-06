# Limen

**Cooperation platform for professionals in education and youth welfare**

_Limen (Latin): the threshold. The place between two rooms,
where transitions are shaped._

Capstone project, Full-Stack Web Development Bootcamp (solo project)

---

## The Idea

Teachers, youth welfare offices, school social workers, daycare staff
and education administration work with the same children and young
people, but rarely with each other. Knowledge and experience stay
within individual institutions, and structural problems are seen by
each side separately, but not solved together.

Limen is a platform where these professionals can exchange ideas
across institutions and levels. The focus is on transitions between
educational stages (e.g. daycare → primary school), but also on
structural topics such as cooperation, responsibilities, inclusion or
all-day schooling.

Practice (schools, daycare, youth welfare) and the governance level
(education administration, education policy) come into direct
exchange. Everyday experience can reach the places where structures
are decided.

The long-term goal is a closed platform that is only open to verified
professionals.

## Core Design Decision: Structures, Not Individual Cases

The platform is exclusively for exchanging **structures, processes and
experiences**, not for discussing specific children or families. This
means no personal data of third parties is processed (privacy by
design). This rule is clearly communicated in the UX.

## Platform Access: A Deliberate Prioritization

**In the MVP, registration is open.** Users choose their professional
field during registration, and this information is not verified yet.

**The closed structure follows as the first extension:** New accounts
will then be reviewed and approved by admins before they can read or
write posts.

This order is a deliberate decision: first, a stable core is built
(CRUD, auth, permissions), on which verification can be added cleanly.

## Moderation and Deleted Accounts

**Admins can delete all threads and replies.** This way, problematic
posts can be removed, even if the person who created them is no longer
active.

**When an account is deleted, its posts remain and are anonymized.**
Instead of the name, "Ehemaliges Mitglied" (former member) is shown,
while the professional field stays visible. Discussions are not lost,
and the person can no longer be identified.

Archiving instead of permanent deletion and deactivating accounts are
planned as extensions.

## Target Group and Roles

Every account has two separate attributes:

**Professional field** (from which perspective does someone speak?)

- Practice level: teacher, school social work, daycare, youth welfare
  office
- Governance level: education administration and education policy
  (e.g. school supervisory authority, Senate administration, education
  policy committees)

**Role** (what is someone allowed to do on the platform?)

- User: create, edit and delete their own posts
- Admin: additionally moderate all posts

New accounts are always users. The admin role cannot be chosen during
registration.

## MVP (Minimum Scope)

- Threads: create, read, update, delete (CRUD)
- Replies to threads: create, read, update, delete (CRUD)
- Topic categories (e.g. "Transition daycare → primary school",
  "Cooperation between schools and youth welfare", "Inclusion",
  "All-day schooling")
- Open registration and login (JWT, stateless)
- Permissions: only authors can edit or delete their own posts, admins
  can delete all posts
- Anonymization of posts from deleted accounts
- Professional field visible on every post, so it is clear from which
  perspective someone is speaking
- Pagination for threads and replies
- Responsive design (mobile first)

## Extensions (by Priority)

1. **Verification of professionals by admins** (makes the platform
   closed)
2. Archiving instead of deleting (soft delete)
3. Deactivating accounts instead of deleting them
4. Filter by professional field or level (e.g. "What does practice say
   about this topic?")
5. Search in threads
6. Progressive Web App (PWA): installable on phones, opens like a
   native app

## Tech Stack

| Area             | Technology                                 |
| ---------------- | ------------------------------------------ |
| Backend          | NestJS 12 (ESM), TypeScript                |
| API              | RESTful, stateless                         |
| Database         | PostgreSQL                                 |
| ORM              | TypeORM                                    |
| Auth             | Passport, JWT, bcrypt                      |
| Validation       | class-validator, class-transformer, DTOs   |
| API docs         | Swagger (@nestjs/swagger)                  |
| Frontend         | Next.js (App Router), TypeScript, Tailwind |
| Testing          | Vitest, Supertest                          |
| API testing      | Bruno                                      |
| Package manager  | Bun                                        |
| Deployment       | Render (backend, DB), Vercel (frontend)    |
| Project planning | GitHub Projects (Kanban, tickets)          |

## Data Model (First Draft)

- **User**: id, name, email, passwordHash, role (USER / ADMIN),
  professionalField, createdAt
- **Category**: id, name, description
- **Thread**: id, title, content, authorId → User (optional),
  categoryId → Category, createdAt, updatedAt
- **Reply**: id, content, authorId → User (optional),
  threadId → Thread, createdAt, updatedAt

Relations:

- User 1 : n Thread
- User 1 : n Reply
- Category 1 : n Thread
- Thread 1 : n Reply

`authorId` is optional so that posts remain when an account is deleted
(on deletion, `authorId` is set to `null`).

## Testing

- Unit tests for services (e.g. permission logic) with Vitest
- Integration tests for API endpoints (e.g. thread CRUD and auth) with
  Supertest
- Manual API tests with Bruno (collection in the `bruno/` folder)

## Local Development

**Requirements:** Node.js v20.19+ or v22.12+, Bun, Postgres.app

**Database**

```
psql
CREATE DATABASE limen_dev;
\q
```

**Backend** (runs on http://localhost:3000)

```
cd backend
cp .env.example .env
bun install
bun run start:dev
```

API documentation: http://localhost:3000/api/docs

**Frontend** (runs on http://localhost:3001)

```
cd frontend
cp .env.example .env.local
bun install
bun run dev
```

**Note:** `synchronize: true` is used in development. It automatically
creates tables from the entities, but can delete data when entities
change.

## Git Workflow

- Protected `main` branch, no direct pushes
- Every change goes through a pull request
- One ticket = one branch = one pull request
- Branch naming: `feature/<ticket-number>-<short-name>`,
  e.g. `feature/06-create-thread`
- Other prefixes: `fix/`, `chore/`, `test/`, `docs/`

## Deployment

- **Backend:** Render (web service `limen-api`)
- **Database:** PostgreSQL on Render, region Frankfurt
  (free tier, expires on: [add date])
- **Frontend:** Vercel

|          | URL                    |
| -------- | ---------------------- |
| Live API | [add after deployment] |
| Swagger  | [add after deployment] |
| Frontend | [add after deployment] |

**Notes:**

- The free Render instance sleeps when inactive, so the first request
  can take up to a minute
- `synchronize: true` is also active in production for this capstone
  (known trade-off, migrations would be the next step)
- Credentials are only stored as environment variables, never in code

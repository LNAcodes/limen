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
Instead of the name "former member" is shown. Discussions are not lost,
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
- Responsive design (mobile first)

## Status

- [x] Thread CRUD and reply CRUD
- [x] Categories (seeded on startup)
- [x] Registration and login (Passport + JWT in the backend, NextAuth in the frontend)
- [x] Protected routes: reading is public, writing requires login
- [x] Ownership: only authors can edit or delete their own posts
- [x] Admin moderation: admins can delete all posts
- [x] Anonymization of posts from deleted accounts
- [x] Author name and professional field shown on every post
- [x] Automated tests: unit tests and integration tests (Vitest, Supertest)
- [x] Accessibility: skip link, visible focus, sufficient contrast (Lighthouse 100)
- [x] Profile page: users see their own data (email is only visible to themselves)
- [x] Deleting your own account in the app (posts stay and are anonymized)

## Extensions

**Planned for the capstone if time allows**

- Live updates of new replies with Socket.io
- AI summary of long discussions (Mistral, free plan)
- Local database with Docker Compose
- Success messages (toasts)

**Future extensions (by priority)**

1. **Verification of professionals by admins** (makes the platform
   closed)
2. Email verification after registration
3. Archiving instead of deleting (soft delete)
4. Deactivating accounts instead of deleting them
5. Pagination for threads and replies
6. Filter by category, professional field or level (e.g. "What does
   practice say about this topic?")
7. Search in threads
8. Live updates of new replies with Socket.io
9. AI summary of long discussions (Mistral)
10. Local database with Docker Compose
11. Success messages (toasts)
12. Security headers (CSP, HSTS, clickjacking protection)
13. Progressive Web App (PWA): installable on phones, opens like a
    native app

## Known Limitations

- After a user deletes their account, their JWT stays technically valid
  until it expires (1 day). The frontend logs the user out right away,
  so this only matters for direct API calls.
- Admins cannot delete their own account, so the platform always keeps
  at least one admin.

## Tech Stack

| Area             | Technology                                                |
| ---------------- | --------------------------------------------------------- |
| Backend          | NestJS 12 (ESM), TypeScript                               |
| API              | RESTful, stateless                                        |
| Database         | PostgreSQL                                                |
| ORM              | TypeORM                                                   |
| Auth             | Passport, JWT, bcrypt(backend), NextAuth.js v5 (frontend) |
| Validation       | class-validator, class-transformer, DTOs                  |
| API docs         | Swagger (@nestjs/swagger)                                 |
| Frontend         | Next.js (App Router), TypeScript, Tailwind, shadcn/ui     |
| Testing          | Vitest, Supertest                                         |
| API testing      | Bruno                                                     |
| Package manager  | Bun                                                       |
| Deployment       | Render (backend, DB), Vercel (frontend)                   |
| Project planning | GitHub Projects (Kanban, tickets)                         |

## Data Model

- **User**: id, name, email (unique, private), passwordHash, role (USER / ADMIN),
  professionalField, createdAt
- **Category**: id, name(unique), createdAt
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

**Unit tests** (Vitest, `@nestjs/testing`)

- **`threads.service.spec.ts`**: `ThreadsService.findOneThread` returns the thread, or throws a 404 (`NotFoundException`) when it does not exist. The repository and the categories service are replaced with mocks, so no database is needed.
- **`ownership.spec.ts`**: the ownership rules for editing and deleting posts. No mocks needed, because the functions are pure.
  - Only the author can edit a post
  - The author and admins can delete a post
  - Nobody can edit an anonymized post (author deleted), only admins can delete it

**Integration tests** (Vitest, Supertest)

- Start the complete app with the real PostgreSQL database
- Register and log in a test user, then test the thread endpoints:
  create without token (401), create (201), empty title (400),
  read (200), unknown id (404), delete (204)
- Test data is removed again at the end

**Manual API tests** with Bruno (collection in the `bruno/` folder)

**Run the tests**

```
cd backend
bun run test        # unit tests
bun run test:e2e    # integration tests (Postgres must be running)
```

Note: the integration tests use the development database `limen_dev`.
A separate test database would be a next step.

## Accessibility

Accessibility is part of the design from the start, not an add-on.

- Semantic HTML: one `<h1>` per page, logical heading order, lists,
  `<article>`, `<time>`, `<dl>` for profile data
- "Skip to content" link appears on keyboard focus
- Visible purple focus outline on all links, buttons and inputs
  (at least 3:1 contrast, light and dark mode)
- Text contrast of at least 4.5:1, including grey secondary text
- Every input has a visible label, error messages use alerts that
  screen readers announce
- Category badges always show the category name, so the meaning does
  not depend on color alone
- Responsive layout, touch-friendly buttons

**Lighthouse (live site):** Performance 91, Accessibility 100,
Best Practices 100, SEO 100

## Local Development

**Requirements:** Node.js v20.19+ or v22.12+, Bun, Postgres.app

**Database**

After installing Postgres.app, add the command line tools to your PATH
(see postgresapp.com), then restart the terminal and create the database:

```
psql
CREATE DATABASE limen_dev;
\q
```

In `backend/.env`, use your Mac username (find it with `whoami`):

```
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/limen_dev
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

The backend must be running on http://localhost:3000, otherwise threads cannot be loaded.

**Note:** `synchronize: true` is used in development. It automatically
creates tables from the entities, but can delete data when entities
change.

## Git Workflow

Project board: [Limen Kanban Board](https://github.com/users/LNAcodes/projects/8)

- Protected `main` branch, no direct pushes
- Every change goes through a pull request
- One ticket = one branch = one pull request
- Branch naming: `feature/<ticket-number>-<short-name>`,
  e.g. `feature/06-create-thread`
- Other prefixes: `fix/`, `chore/`, `test/`, `docs/`

## Deployment

- **Backend:** Render (web service `limen-api`)
- **Database:** PostgreSQL on Render, region Frankfurt
  (free tier, expires on: Nov. 8, 2026)
- **Frontend:** Vercel

|          | URL                                     |
| -------- | --------------------------------------- |
| Live API | https://limen-api.onrender.com          |
| Swagger  | https://limen-api.onrender.com/api/docs |
| Frontend | https://limen-gilt-xi.vercel.app        |

**Environment variables on Render (backend):**

- `DATABASE_URL`: internal database URL of `limen-db`
- `JWT_SECRET`: secret for signing the access tokens
- `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD`: create the first admin
  on startup (optional, only if no admin exists yet)
- `FRONTEND_URL`: live frontend URL, only this origin may call the API (CORS)
- `BUN_VERSION`, `NODE_VERSION`: runtime versions for install, build and run

**Environment variables on Vercel (frontend):**

- `NEXT_PUBLIC_API_URL`: URL of the backend
- `AUTH_SECRET`: secret for encrypting the NextAuth session cookie

**Notes:**

- The free Render instance sleeps when inactive, so the first request
  can take up to a minute
- `synchronize: true` is also active in production for this capstone
  (known trade-off, migrations would be the next step)
- Credentials are only stored as environment variables, never in code
- Next.js was upgraded to 16.4.2 after a security advisory in October 2026

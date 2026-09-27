# Atelier Store

Minimal eCommerce application foundation built with Next.js, TypeScript, Tailwind CSS, Better Auth, Drizzle ORM, and Neon Postgres.

## Getting started

1. Copy `.env.example` to `.env.local`.
2. Add a Neon `DATABASE_URL` and a random `BETTER_AUTH_SECRET`.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.

## Scripts

- `npm run dev` — start Next.js in development mode
- `npm run build` — create a production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run the TypeScript compiler without emitting files
- `npm run db:generate` — generate Drizzle migrations from the schema
- `npm run db:migrate` — apply generated migrations
- `npm run db:push` — push schema changes directly to the database
- `npm run db:studio` — open Drizzle Studio

## Integration points

- `src/db/index.ts` creates the Neon-backed Drizzle client.
- `src/db/schema.ts` is intentionally empty until database tables are designed.
- `src/lib/auth.ts` creates the Better Auth server instance with the Drizzle adapter.
- `src/app/api/auth/[...all]/route.ts` mounts the Better Auth API handler.
- `drizzle.config.ts` configures Drizzle Kit for Neon Postgres.

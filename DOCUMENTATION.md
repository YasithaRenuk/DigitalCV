# DigitalCV — Project Documentation

## Project Overview

DigitalCV is a Next.js application for creating, searching, and managing digital CVs. It includes an admin area, public pages, API routes, and integration with payment and reporting services.

## Quick Start

Prerequisites:
- Node.js 18+ (or supported LTS)
- npm, pnpm, or yarn
- MongoDB (local or Atlas)

Clone and install:

```bash
npm install
# or
pnpm install
```

Create environment variables (see `config/server-env.ts` for keys):

- `MONGODB_URI` — your MongoDB connection string
- `NEXTAUTH_URL` — app URL
- `NEXTAUTH_SECRET` — secret for authentication

Run development server:

```bash
npm run dev
```

Open http://localhost:3000

## Development

Scripts available in `package.json`:
- `dev` — start dev server
- `build` — production build
- `start` — run production server
- `lint` — run ESLint

Code style follows the existing TypeScript and React conventions in `src/`.

## Folder Structure (high level)

- `src/app/` — Next.js app routes and pages
  - `api/` — serverless API routes
  - `(pages)/` — public pages
  - `(admin)/` — admin area
- `src/components/` — feature components
- `src/lib/` — utilities and DB clients
- `src/models/` — Mongoose models
- `src/config/` — server environment helpers

## Notable API endpoints

See `src/app/api/` for full list. Examples:
- `api/getCVWithId/route.ts` — fetch CV by id
- `api/payment/route.ts` — payment webhook/handler
- `api/user/route.ts` — user creation and lookup

## Database

This project uses MongoDB. The Mongoose models live in `src/models/` (e.g., `User.ts`, `UserCV.ts`, `Payment.ts`). Ensure `MONGODB_URI` is set and reachable.

## Authentication

Authentication is handled by NextAuth; check `src/lib/auth.ts` and `src/app/api/auth/[...nextauth]/` for providers and session config.

## File Uploads and CV Handling

CV upload and template rendering components live under `src/components/ShowCV/` and `src/components/CreateCV/`.

## Deployment

Recommended: Vercel for Next.js apps. A Dockerfile is present for containerized deployments; verify environment variables before production runs.

## Testing & Linting

- `npm run lint` — run ESLint checks

Add tests as needed; no test framework is included by default.

## Contributing

- Follow existing code style
- Run `npm run lint` and `npm run dev` locally
- Open PRs against `main` with descriptive commit messages

## Troubleshooting

- If Mongo connection fails, verify `MONGODB_URI` and network access.
- For auth issues, confirm `NEXTAUTH_SECRET` and provider credentials.

## Contact

For questions, check the project `README.md` or open an issue in the repository.

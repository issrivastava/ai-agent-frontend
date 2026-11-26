# AI Agent Platform: Frontend

Web app for the AI Agent Platform. Support teams manage tickets, build workflows of AI agents, watch runs live, and approve or reject risky agent actions.

Backend repo: `ai-agent-backend`.

## Stack

- Next.js 16 (App Router, Turbopack) and TypeScript
- Tailwind CSS and shadcn/ui
- TanStack Query and TanStack Table
- React Hook Form and Zod
- Recharts for dashboards
- Vitest and Testing Library for tests

## Quick start

Requirements: Node 22, Git, and the backend running (see its README).

```bash
git clone <this-repo-url>
cd ai-agent-frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev     # http://localhost:3000
```

Sign in with an account created by the backend's seed script. Restart `npm run dev` after changing any env file.

## Environment variables

| Variable | Where | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Local | Backend URL, for example `http://localhost:5000/api` |
| `NEXT_PUBLIC_API_URL` | Vercel | `/api`, so the browser talks to one domain |
| `BACKEND_URL` | Vercel | Your Render backend URL, with no trailing slash. Vercel forwards `/api` calls to it |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Run the tests |
| `npm run test:watch` | Re-run tests on change |

## Screens

| Route | What it is |
| --- | --- |
| `/` | Public landing page |
| `/login`, `/register` | Sign in and sign up |
| `/dashboard` | Ticket and run overview |
| `/tickets` | Filter, search and reassign tickets |
| `/workflows` | Build workflows, run them on a chosen ticket |
| `/runs`, `/runs/[id]` | Run list and live run viewer with approvals |
| `/extractions` | Upload documents, view and export extracted fields |
| `/settings` | Profile and user management |

## Roles

The interface hides actions a role cannot use, but the backend is what enforces permissions.

| Role | Sees |
| --- | --- |
| `admin` | Everything, including workflow editing and user management |
| `agent` | Run workflows, approve or reject steps, reassign tickets, upload documents |
| `viewer` | Read-only screens |

The permission table lives in `lib/permissions.ts`.

## Project structure

```
app/
  (auth)/         login and register
  (marketing)/    landing page
  (dashboard)/    the signed-in app: dashboard, tickets, workflows, runs, extractions, settings
components/
  layout/ shared/ tickets/ workflows/ runs/ extractions/ dashboard/ landing/ ui/
hooks/            one hook per API area (TanStack Query)
lib/              api client, permissions, navigation, validations, export, errors
providers/        query, theme and auth providers
types/            shared TypeScript types
__tests__/        tests
proxy.ts          route protection: redirects signed-out users to /login
```

Components never call the API directly. They use the hooks in `hooks/`.

## Testing

```bash
npm test
```

Tests cover form validation, role permissions, the CSV export, error messages, the login form and the run ticket picker. They run without a backend.

CI (GitHub Actions) runs lint, typecheck, tests and build on every push and pull request.

## Deployment (Vercel)

1. Import the repo into Vercel.
2. Set `NEXT_PUBLIC_API_URL=/api` and `BACKEND_URL=<your Render URL>` for Production.
3. Deploy from `main`.

`next.config.ts` rewrites `/api/*` to `BACKEND_URL`. That keeps the login cookie on one domain. On the backend, set `CLIENT_ORIGIN` to your Vercel URL.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `ERR_CONNECTION_REFUSED` on `:5000` | The backend is not running |
| Login says "Invalid email or password" | The password does not match the database the backend uses |
| `/api/health` returns 404 on Vercel | `BACKEND_URL` or the rewrite is missing, or the latest code is not on `main`. Redeploy after fixing |
| Route not found for an API call | The frontend is pointing at a backend that does not have that route. Check `NEXT_PUBLIC_API_URL` |
| Type errors from `.next/types` after moving a route | Delete the `.next` folder and rebuild |
| Dev-mode "instant navigation" notice | A development-only advisory. It does not affect the app |

## Contributing

- One branch per feature, then open a pull request.
- Never commit secrets or `.env` files.
- Run `npm run lint`, `npm run typecheck` and `npm test` before pushing.
- Keep pull requests small and explain why the change is needed.
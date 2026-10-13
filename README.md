# GameDevClubHub

A hub to help our Game Development Club organize the work of making and publishing games.

## M3–M4 implementation

- React Router: Dashboard (`/`), Tasks (`/tasks`), About (`/about`) and Link navigation.
- Reusable `TaskCard`: receives title, description, completion status, and a callback through props.
- `useState`: App owns completion state, so it survives navigation between pages.
- JSON and `.map()`: five club assignments are imported from `client/src/data/tasks.json` and rendered dynamically.
- `AI_LOG.md`: records actual assistance and assistant checks; personal review/testing remain pending.

## Run the frontend

Tested using Node.js 24.19. Use Node 24 for this project.

From the repository root:

```sh
cd client
npm ci
npm run dev -- --host 0.0.0.0
```

Open the forwarded Vite port in Codespaces (normally 5173). For a local run, open the URL Vite prints.
Keep that terminal running. In a second terminal inside `client`, run checks:

```sh
npm run build
npm run lint
npm test
```

Task status survives route changes but resets on refresh. Data is held in React state, not a database.
Express and SQLite are outside this React milestone implementation.

See `MILESTONE_WRAPUP.md` for the concept walkthrough, evidence, personal checklist, and Codespaces transfer instructions.
Earlier step-by-step work is documented in `BUILD_CHECKPOINT.md` and `ROUTER_CHECKPOINT.md`.

These changes were made locally. No commits or pushes have been made.

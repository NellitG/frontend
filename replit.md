# KALRO Human Resource Management System

A multi-module HR management dashboard for Kenya Agricultural and Livestock Research Organization (KALRO), covering Strategic Objectives, Performance Contracts, and Project Reporting.

## Run & Operate

- `pnpm --filter @workspace/kalro-hrms run dev` — run the frontend (via workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS v4 + shadcn/ui
- Routing: react-router-dom v7
- State: TanStack Query + localStorage (mock data)
- Charts: Recharts
- Animations: Framer Motion

## Where things live

- `artifacts/kalro-hrms/src/App.tsx` — root router with all page routes
- `artifacts/kalro-hrms/src/pages/` — all pages organized by module
- `artifacts/kalro-hrms/src/components/layout/` — DashboardLayout, Sidebar, TopNav
- `artifacts/kalro-hrms/src/utils/modules.ts` — sidebar navigation config
- `artifacts/kalro-hrms/src/utils/types.ts` — shared TypeScript types
- `artifacts/kalro-hrms/src/context/AuthContext.tsx` — auth context (mock login)
- `artifacts/kalro-hrms/src/hooks/useProjectsApi.ts` — data hooks (localStorage)
- `artifacts/kalro-hrms/src/styles.css` — Tailwind v4 theme with oklch colors

## Architecture decisions

- Authentication is mocked — auto-logs in as guest; real auth not yet implemented
- All data is stored in localStorage via a Zustand-like custom store (no database yet)
- Three modules: `projects`, `strategic-objectives`, `performance-contracts` — each has its own sidebar config and login path
- Sidebar uses a two-level system: flat `SIDEBAR_SECTIONS` for projects/SO, tree-based `SIDEBAR_TREE` for PC

## Product

- **Project Reporting**: Dashboard, project CRUD, Key Result Areas, strategies, key activities, expected outputs, output indicators, baseline tracking
- **Strategic Objectives**: KPI monitoring, strategic plans, objectives, progress tracking
- **Performance Contracts**: PC preparation, matrix tables, monitoring & reporting, self-evaluation

## User preferences

## Gotchas

- The entry point is `src/index.tsx` (not `main.tsx`) — referenced in `index.html`
- `src/styles.css` is the live theme file (oklch colors); `src/index.css` is an unused scaffold placeholder
- Data is not persisted to a database yet — all CRUD goes through localStorage

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

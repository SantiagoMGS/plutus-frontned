# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + build for production
npm run lint       # ESLint
npm run preview    # Preview production build
```

There are no tests configured in this project.

## Environment

Requires a `.env` file at the root with:

```
VITE_API_URL=http://localhost:8000/api
```

The backend is a Django REST Framework API expected to run on `localhost:8000`.

## Architecture

### Data flow

Each resource (accounts, transactions, categories) follows a consistent three-layer pattern:

1. **`src/api/*.ts`** — plain async functions that call `apiClient` and return typed data
2. **`src/hooks/use-*.ts`** — TanStack Query wrappers (`useQuery` / `useMutation`) that call the API layer, handle cache invalidation, and show toasts on success/error
3. **`src/pages/*.tsx`** and **`src/components/**`** — consume hooks directly; no data fetching logic lives in components

### Auth

- `src/stores/auth-store.ts` — Zustand store persisting JWT tokens in `localStorage`. Auth state is initialised synchronously from `localStorage` on load.
- `src/api/client.ts` — Axios instance with two interceptors: one injects the Bearer token on every request; another handles 401s by queuing failed requests, silently refreshing the access token, and replaying the queue. On refresh failure it calls `logout()` and redirects to `/login`.
- `src/components/protected-route.tsx` — reads `isAuthenticated` from the store; unauthenticated users are redirected to `/login`.

### Routing

Routes are declared in `src/App.tsx`. All authenticated routes are wrapped in `<ProtectedRoute>` (outlet) and then in `<AppLayout>` (outlet). Layout renders a fixed sidebar (desktop) and bottom nav (mobile) alongside a `<Header>`.

### Forms & validation

All form schemas live in `src/lib/validators.ts` using Zod. Forms use `react-hook-form` with `@hookform/resolvers/zod`. Schema types are inferred with `z.infer<typeof schema>` and used as the form's generic type.

### Responsive layout

`useIsDesktop()` (`src/hooks/use-media-query.ts`) is the standard way to branch between mobile/desktop behaviour. The layout shows a sidebar at `md` breakpoint and hides the bottom nav; below `md` the sidebar is hidden and the bottom nav is shown.

### UI components

Shadcn/ui components live in `src/components/ui/` and should not be edited directly — regenerate them via the `shadcn` CLI if updates are needed. Tailwind CSS v4 is used (PostCSS-free, Vite plugin).

### API response shape

List endpoints return `PaginatedResponse<T>` (`src/types/api.ts`): `{ count, next, previous, results }`. Access `.results` to get the array.

### Toast notifications

Use `toast.success()` / `toast.error()` from `sonner`. Toast calls belong in mutation `onSuccess`/`onError` callbacks in hooks, not in components.

### Responsive modals

Pages use `useIsDesktop()` to conditionally render `<Dialog>` (desktop) or `<Drawer>` (mobile) for create/edit forms. This is the standard pattern for any new CRUD modal.

### Cache invalidation

TanStack Query is configured with `staleTime: 2 min, retry: 1` (in `src/main.tsx`). Mutations invalidate their own query key; transaction mutations also invalidate `["accounts"]` because balances change.

### Types

`amount` and `balance` fields are `string` in both request and response types (decimal precision from Django). `AccountType`, `Currency`, `TransactionType`, `CategoryType` are literal union types in `src/types/`.

### Utilities

- `formatCurrency(amount, currency)` in `src/lib/utils.ts` — uses `Intl.NumberFormat` with `"es-CO"` locale (COP: 0 decimals, others: 2).
- Error extraction: auth hooks use a local `getErrorMessage()` helper that reads `response.data.detail` or the first field error before falling back to a generic message.

### Localisation

All user-facing text (validators, labels, toasts, placeholders) is in Spanish (Colombian context).

### Path alias

`@/` maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).

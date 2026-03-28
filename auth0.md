# Auth0 Integration — Frontend (React + Vite)

## Context

This project uses React 19 + Vite + React Router 7. Authentication currently relies on:
- **Zustand store** (`src/stores/auth-store.ts`): persists JWT tokens in localStorage
- **Axios interceptor** (`src/api/client.ts`): injects Bearer token, handles 401 with silent refresh
- **ProtectedRoute** (`src/components/protected-route.tsx`): checks `isAuthenticated` from Zustand

The goal is to replace this custom auth layer with `@auth0/auth0-react`. Auth0 handles token storage, refresh, and the login/signup UI via Universal Login (redirect flow with PKCE).

---

## Install

```bash
npm install @auth0/auth0-react
```

No other new packages needed. Remove nothing yet — do it as you replace each file.

---

## Environment Variables

Add to `.env`:
```env
VITE_AUTH0_DOMAIN=yourapp.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
VITE_AUTH0_AUDIENCE=https://api.plutus.app
```

> `VITE_AUTH0_AUDIENCE` must match the API Identifier registered in the Auth0 dashboard exactly. Without it, Auth0 returns an opaque token that the Django backend cannot validate.

---

## Files to Modify

### 1. `src/main.tsx`

Wrap the app with `Auth0Provider`. The `audience` param is critical:

```tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import { Toaster } from "sonner";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: "openid profile email",
    }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster richColors />
      </QueryClientProvider>
    </BrowserRouter>
  </Auth0Provider>
);
```

> `useRefreshTokens={true}` + `cacheLocation="localstorage"` enables silent token refresh without relying on third-party cookies (required since modern browsers block them).

---

### 2. `src/api/client.ts`

Replace the Zustand-based token injection and 401 retry logic. Auth0 SDK handles refresh automatically via `getAccessTokenSilently`.

The Axios interceptor becomes simpler — token injection is now done per-request in hooks/components using `getAccessTokenSilently`. However, to keep the existing API layer working without changes, create a module-level token getter:

```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// This function is set once after Auth0Provider mounts (see useApiAuth hook below)
let getTokenFn: (() => Promise<string>) | null = null;

export function setTokenGetter(fn: () => Promise<string>) {
  getTokenFn = fn;
}

apiClient.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    try {
      const token = await getTokenFn();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Token unavailable (user not logged in) — request goes without auth header
    }
  }
  return config;
});

// No 401 interceptor needed — Auth0 SDK handles refresh via getAccessTokenSilently
```

---

### 3. Create `src/hooks/use-api-auth.ts` (new file)

This hook wires Auth0's `getAccessTokenSilently` into the Axios client. Call it once at the top of `App.tsx`:

```typescript
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setTokenGetter } from "../api/client";

export function useApiAuth() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setTokenGetter(() =>
        getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })
      );
    }
  }, [isAuthenticated, getAccessTokenSilently]);
}
```

---

### 4. `src/App.tsx`

Add `useApiAuth()` call and remove the old auth-based redirect logic:

```tsx
import { Routes, Route, Navigate } from "react-router";
import { useApiAuth } from "./hooks/use-api-auth";
import ProtectedRoute from "./components/protected-route";
import AppLayout from "./components/layout/app-layout";
import LoginPage from "./pages/auth/login";
import DashboardPage from "./pages/dashboard";
import AccountsPage from "./pages/accounts";
import TransactionsPage from "./pages/transactions";
import CategoriesPage from "./pages/categories";

export default function App() {
  useApiAuth(); // wires Auth0 token getter into Axios

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* No /register route — Auth0 Universal Login handles signup */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

---

### 5. `src/components/protected-route.tsx`

Replace Zustand check with Auth0:

```tsx
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    // Prevents flash of redirect while Auth0 restores session from storage
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-muted-foreground text-sm">Cargando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

---

### 6. `src/pages/auth/login.tsx`

Replace the form with a redirect to Auth0 Universal Login:

```tsx
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  return null; // Auth0 redirects immediately
}
```

> Auth0 Universal Login handles both login and sign-up (there's a "Sign up" tab). The separate `/register` page and route can be removed.

---

### 7. `src/hooks/use-auth.ts`

Replace custom mutations with Auth0 hooks:

```typescript
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "../api/auth";
import { toast } from "sonner";

export function useUser() {
  const { isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: getMe,
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  // keep existing useMutation pattern — getMe/updateMe API calls are unchanged
}

export function useLogout() {
  const { logout } = useAuth0();
  const queryClient = useQueryClient();

  return () => {
    queryClient.clear();
    logout({ logoutParams: { returnTo: window.location.origin + "/login" } });
    toast.success("Sesión cerrada");
  };
}

// Remove: useLogin, useRegister — no longer needed
```

---

### 8. `src/api/auth.ts`

**Remove**: `login()`, `register()` functions — Auth0 handles these.
**Keep**: `getMe()`, `updateMe()`, `changePassword()` — these call Django API endpoints and are unchanged.

---

### 9. `src/stores/auth-store.ts`

**Delete this file entirely.** Auth0 SDK manages all token state internally.

Also remove any imports of `useAuthStore` across the codebase (search for `auth-store` and `useAuthStore`).

---

### 10. `src/types/auth.ts`

Update `User` to reflect that `id` may now be the Auth0 `sub` string rather than a numeric Django ID, depending on what the backend returns from `/api/auth/me/`:

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  currency_default: string;
  date_joined: string;
  // auth0_sub is managed server-side, not exposed here
}

// Remove: LoginRequest, LoginResponse, RegisterRequest, RefreshResponse
// Keep: ChangePasswordRequest only if password change is still supported via Auth0
```

---

## What Does NOT Change

- All API functions in `src/api/accounts.ts`, `src/api/categories.ts`, `src/api/transactions.ts`
- All hooks in `src/hooks/use-accounts.ts`, `src/hooks/use-categories.ts`, `src/hooks/use-transactions.ts`
- All page components except `login.tsx` (and `register.tsx` which gets removed)
- All Zod validators in `src/lib/validators.ts` (account, category, transaction schemas)
- TanStack Query setup — only the `queryKey` and `queryFn` patterns remain the same
- Tailwind, Shadcn UI components, layout

---

## Testing After Implementation

1. Run the app: `npm run dev`
2. Navigate to a protected route → should redirect to Auth0 Universal Login
3. Log in → should return to app and load user profile from `/api/auth/me/`
4. Open DevTools → Network tab → verify API requests include `Authorization: Bearer <jwt>`
5. Check that the JWT's `aud` claim matches `VITE_AUTH0_AUDIENCE`
6. Log out → should clear session and redirect to `/login`

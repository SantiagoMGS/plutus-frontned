# Exposición — Implementación de Auth0 en Plutus Frontend

## ¿Qué es Auth0 y por qué se usó?

Auth0 es un proveedor de identidad como servicio (IDaaS). En lugar de construir y mantener un sistema de autenticación propio (manejo de contraseñas, sesiones, refresh tokens, etc.), Auth0 lo gestiona todo externamente.

Se usó porque:
- Delega la responsabilidad de la seguridad de autenticación a un servicio especializado
- Soporta múltiples métodos de login (email/password, Google, etc.) sin código adicional
- Maneja el ciclo de vida completo del token (emisión, renovación, revocación)

---

## Flujo de autenticación completo

```
Usuario accede a ruta protegida (ej: /accounts)
        │
        ▼
ProtectedRoute chequea isAuthenticated
        │  NO autenticado
        ▼
Redirige a /login
        │
        ▼
LoginPage llama loginWithRedirect()
        │
        ▼
Navegador redirige a Auth0 Universal Login
(plutus-dev-col.us.auth0.com)
        │  Usuario ingresa credenciales
        ▼
Auth0 devuelve a http://localhost:5173?code=...&state=...
        │
        ▼
Auth0 SDK intercambia el code por tokens
(access_token, refresh_token, id_token)
        │
        ▼
Tokens se guardan en localStorage
isAuthenticated = true
        │
        ▼
ProtectedRoute renderiza la ruta solicitada
        │
        ▼
Cada request HTTP incluye: Authorization: Bearer <access_token>
        │
        ▼
Django backend valida el JWT y responde
```

---

## Protocolo: OAuth 2.0 + PKCE

El flujo usa **Authorization Code Flow con PKCE** (Proof Key for Code Exchange).

### ¿Por qué PKCE?

Las SPAs (Single Page Applications) no pueden guardar un `client_secret` de forma segura — cualquiera puede ver el código fuente del browser. PKCE resuelve esto sin necesitar un secreto del lado del cliente.

### ¿Cómo funciona?

1. La app genera un `code_verifier` (string aleatorio de 128 caracteres)
2. Calcula `code_challenge = base64url(SHA256(code_verifier))`
3. Envía el `code_challenge` a Auth0 en la URL de autorización (visible)
4. Auth0 devuelve un `code` temporal
5. La app envía `code` + `code_verifier` a Auth0 para obtener tokens
6. Auth0 verifica: `SHA256(code_verifier) == code_challenge` → solo la app original puede canjearlo

El SDK de `@auth0/auth0-react` realiza todo este proceso automáticamente. Se puede verificar en el Network tab del browser: la URL de redirect a Auth0 incluye `code_challenge` y `code_challenge_method=S256`.

---

## Archivos clave del proyecto

### `src/main.tsx` — Punto de entrada
Envuelve toda la app con `Auth0Provider`:

```tsx
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
```

- `audience`: le indica a Auth0 para qué API se pide el token. Django valida que el JWT tenga este valor en el claim `aud`.
- `useRefreshTokens + cacheLocation="localstorage"`: habilita renovación silenciosa de tokens sin depender de cookies de terceros (bloqueadas por navegadores modernos).

### `src/components/protected-route.tsx` — Control de acceso
```tsx
const { isAuthenticated, isLoading } = useAuth0();

if (isLoading) return <div>Cargando...</div>;        // Auth0 restaurando sesión
if (!isAuthenticated) return <Navigate to="/login" />; // Sin sesión → login
return <Outlet />;                                    // Autenticado → renderiza
```

El estado `isLoading` es crítico: evita un redirect prematuro mientras Auth0 lee los tokens de `localStorage` al recargar la página.

### `src/hooks/use-api-auth.ts` — Conexión Auth0 ↔ Axios
```tsx
export function useApiAuth() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setTokenGetter(() => getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
      }));
    }
  }, [isAuthenticated, getAccessTokenSilently]);
}
```

Registra una función que el interceptor de Axios llamará en cada request para obtener el token vigente.

### `src/api/client.ts` — Interceptor de Axios
```typescript
apiClient.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn(); // llama getAccessTokenSilently()
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

`getAccessTokenSilently()` verifica si el `access_token` está vigente. Si expiró, hace un refresh automático usando el `refresh_token` sin que el usuario lo note.

---

## Ciclo de vida del token

| Momento | Acción |
|--------|--------|
| Login exitoso | Auth0 emite `access_token` (1h) + `refresh_token` |
| Cada request API | `getAccessTokenSilently()` retorna el token de `localStorage` |
| Token por expirar | SDK hace refresh silencioso → nuevo `access_token` |
| Refresh token expirado | El usuario debe hacer login nuevamente |
| Logout | SDK borra `localStorage` + invalida sesión en Auth0 |

---

## Configuración en Auth0 Dashboard

Para que el flujo funcione se requiere:

1. **Allowed Callback URLs**: `http://localhost:5173` — a donde Auth0 redirige después del login
2. **Allowed Logout URLs**: `http://localhost:5173/login` — a donde redirige después del logout
3. **Allowed Web Origins**: `http://localhost:5173` — para CORS y silent refresh
4. **API registrada** con identifier `https://api.plutus.app` — el Django backend
5. **Application Access**: autorizar `Plutus Frontend` con User Access en esa API

---

## Qué NO maneja el frontend

- Validación del JWT: la hace Django con la clave pública de Auth0
- Almacenamiento de contraseñas: Auth0 lo gestiona completamente
- Lógica de signup: Auth0 Universal Login tiene pestaña "Sign up" integrada
- Refresh manual de tokens: el SDK lo hace automáticamente en `getAccessTokenSilently()`

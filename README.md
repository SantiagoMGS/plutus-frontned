# Plutus Frontend

Aplicación web para la gestión de finanzas personales, construida con React 19, TypeScript y Vite.

## Requisitos previos

- Node.js 20+
- npm 10+
- El [backend de Plutus](../plutus-backend/) debe estar corriendo en `localhost:8000`

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
VITE_AUTH0_DOMAIN=<tu-dominio-auth0>
VITE_AUTH0_CLIENT_ID=<tu-client-id-auth0>
VITE_AUTH0_AUDIENCE=<tu-audience-auth0>
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo (Vite + HMR) |
| `npm run build` | Compila TypeScript y genera el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Previsualiza el build de producción |

## Estructura del proyecto

```
src/
├── api/            # Funciones de llamadas a la API (Axios)
├── components/     # Componentes React (UI, layout, módulos)
│   ├── ui/         # Componentes Shadcn/ui (no editar directamente)
│   ├── accounts/   # Componentes de cuentas
│   ├── categories/ # Componentes de categorías
│   ├── dashboard/  # Componentes del dashboard
│   ├── layout/     # Sidebar, header, navegación
│   └── transactions/ # Componentes de transacciones
├── hooks/          # Custom hooks (TanStack Query, auth, responsive)
├── lib/            # Utilidades y validadores (Zod)
├── pages/          # Páginas/rutas de la aplicación
├── stores/         # Estado global (Zustand)
└── types/          # Tipos e interfaces TypeScript
```

## Tecnologías principales

- React 19 / TypeScript
- Vite (bundler)
- TanStack Query (manejo de estado del servidor)
- Zustand (estado global)
- React Hook Form + Zod (formularios y validación)
- Shadcn/ui + Tailwind CSS v4 (interfaz)
- Auth0 (autenticación)
- Axios (cliente HTTP)

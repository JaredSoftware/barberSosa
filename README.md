## Barber Sosa – Backend + Ecommerce

Proyecto full‑stack para la barbería **Barber Sosa**, compuesto por:

- **`barber-backend`**: API y backend en **NestJS** con MongoDB/Mongoose, autenticación JWT/Google OAuth, integración con **Google Calendar** para reservas y **Mercado Pago** para pagos.
- **`barberEcommerce`**: frontend en **Nuxt 3** (SSR/Static), TailwindCSS + Bulma, i18n (ES/EN) y generación estática que se copia al `public` del backend.

> Importante: las variables sensibles (`.env`) **no se versionan** y deben configurarse manualmente en cada entorno.

---

## Requisitos

- **Node.js >= 18**
- MongoDB accesible (local o remoto)
- Cuenta de Google Cloud (OAuth + Calendar API) para login y sincronización de citas
- Cuenta de **Mercado Pago** con credenciales de API

---

## Estructura del repositorio

- `barber-backend/` – Proyecto NestJS (API, auth, reservas, carrito, pagos, etc.).
- `barberEcommerce/` – Proyecto Nuxt 3 (landing, catálogo, reservas, panel admin, etc.).
- `barber-backend/public/` – Salida estática generada por Nuxt (`npm run build` en `barberEcommerce` copia aquí los archivos).

---

## Variables de entorno (ejemplo)

Archivo `.env` en `barber-backend/` (no subir a Git):

```bash
MONGODB_URI=mongodb+srv://...
PORT=3000
JWT_SECRET=super-secret

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://tudominio.com/auth/callback

# Google Calendar
GOOGLE_CALENDAR_ID=...

# Mercado Pago
MP_ACCESS_TOKEN=...
MP_PUBLIC_KEY=...
```

Ajusta los nombres según tu configuración real del proyecto.

---

## Desarrollo – Backend (`barber-backend`)

```bash
cd barber-backend
npm install

# desarrollo con watch
npm run start:dev

# producción (build + run)
npm run build
npm run start:prod
```

El backend expone la API (por defecto en `http://localhost:3000` o el puerto configurado en `.env`).

---

## Desarrollo – Frontend (`barberEcommerce`)

```bash
cd barberEcommerce
npm install

# servidor de desarrollo Nuxt en http://localhost:3000 (o el puerto configurado)
npm run dev
```

### Build estático e integración con el backend

```bash
cd barberEcommerce
npm run build
```

Ese script:

- Compila estilos (Bulma + Tailwind).
- Genera la app estática con Nuxt.
- Copia el resultado a `barber-backend/public/`.

Después del build, puedes levantar solo el backend y servir toda la web desde ahí.

---

## Scripts principales

### `barber-backend/package.json`

- **`start:dev`**: NestJS en modo desarrollo.
- **`build`**: compila TypeScript a `dist/`.
- **`start:prod`**: arranca desde `dist/main`.
- **`lint` / `test` / `test:e2e`**: tooling estándar de NestJS.

### `barberEcommerce/package.json`

- **`dev`**: arranca Nuxt 3 + build de CSS.
- **`build` / `generate`**: genera estático y copia a `barber-backend/public/`.
- **`optimize`**: script para optimizar imágenes (usa imagemin).

---

## Funcionalidades principales (resumen)

- **Reservas de turnos** con sincronización en **Google Calendar**.
- **Autenticación** con Google OAuth y JWT.
- **Catálogo de productos** y **carrito de compras**.
- **Pagos online** con **Mercado Pago**.
- **Panel de administración** para barberos, calendario, categorías, productos, ofertas e informes.
- Sitio público con páginas: inicio, catálogo, reservas, carrito, políticas, etc.

---

## Deploy (idea general)

1. Configurar variables de entorno (sin commitear `.env`).
2. Hacer `npm run build` en `barberEcommerce` para generar y copiar el frontend al backend.
3. Hacer `npm run build` y `npm run start:prod` en `barber-backend` en tu servidor.
4. Poner un reverse proxy (Nginx/traefik) o un túnel (Cloudflare, etc.) delante del backend.

Los detalles exactos dependen del proveedor (VPS, Docker, PaaS, etc.).

---

## Notas de seguridad

- **No subir nunca** `.env` ni claves a GitHub.
- Rotar credenciales de Google y Mercado Pago si alguna vez se han expuesto.
- Usar HTTPS en producción y restringir orígenes CORS según tu dominio.


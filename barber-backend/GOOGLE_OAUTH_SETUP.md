# Configurar Google OAuth (login y calendario de barberos)

Un solo **cliente OAuth** en Google sirve para que **todos los barberos** conecten su cuenta. Cada barbero hace "Conectar con Google" en el panel y autoriza su cuenta; el backend guarda el token/refresh token de cada uno (para usar su Google Calendar).

## Sin dominio: usar localhost (misma arquitectura)

Google **no acepta IP** en OAuth; solo **localhost** o dominio. Por eso el callback se configura con **localhost**; tu frontend sigue en la IP.

Para que el callback llegue al backend cuando alguien hace "Conectar Google":

- **Navegas desde el servidor:** Abres el admin en `http://10.90.61.11`, clic en "Conectar Google". Google redirige a `http://localhost:4000/api/auth/google/callback`; el backend (en ese mismo servidor) lo recibe.
- **Navegas desde tu PC:** Túnel SSH al puerto del backend:  
  `ssh -L 4000:localhost:4000 usuario@10.90.61.11`  
  Dejas la sesión abierta. En tu PC, `localhost:4000` apunta al backend. Abres el admin en `http://10.90.61.11`, "Conectar Google"; Google redirige a `localhost:4000/...` y el túnel lleva la petición al backend.

Arquitectura igual: frontend y backend en el servidor por IP; solo el callback de Google usa localhost.

## Pasos en Google Cloud Console

1. **Entra a Google Cloud Console**  
   https://console.cloud.google.com/

2. **Crea o elige un proyecto** (p. ej. "Sosa Barber").

3. **Activa la API de Google Calendar** (opcional, para agendamiento):  
   APIs & Services → Library → busca "Google Calendar API" → Enable.

4. **Crea credenciales OAuth 2.0**  
   - APIs & Services → **Credentials** → **Create Credentials** → **OAuth client ID**.  
   - Si te pide configurar pantalla de consentimiento: **OAuth consent screen** → External → rellena nombre de la app y correo de soporte → Save.  
   - Tipo de cliente: **Web application**.  
   - Nombre: p. ej. "Sosa Barber Admin".  
   - **Orígenes de JavaScript autorizados:** solo el origen, **sin ruta**. Añade:
     - `http://localhost:4000`
   - **URIs de redirección autorizados:** (es **otro bloque** en la misma pantalla, no el de Orígenes). Añade:
     - `http://localhost:4000/api/auth/google/callback`
   - Guarda y copia **Client ID** y **Client Secret**.

5. **Configura el backend**  
   En el `.env` del backend (misma máquina donde corre el backend):

   ```env
   GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=tu-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
   FRONTEND_CALLBACK_URL=http://10.90.61.11
   ```

   - `GOOGLE_CALLBACK_URL`: tiene que ser **exactamente** la misma que en "URIs de redirección" de Google (localhost, no IP).  
   - `FRONTEND_CALLBACK_URL`: URL por la que entras al frontend (tu IP o dominio); aquí sí usas tu IP.

6. **Reinicia el backend** después de cambiar las variables.

## Varios barberos, un solo cliente

- No hace falta un Client ID por barbero.  
- Un solo OAuth client; cada barbero hace "Conectar cuenta de Google" en el panel.  
- El backend asocia el token/refresh token de Google al usuario (barbero) y lo guarda para usar su calendario.

## Error "The OAuth client was not found" / 401 invalid_client

- **Causa:** Client ID/Secret vacíos, incorrectos o no configurados en el entorno donde corre el backend.  
- **Solución:** Crear el cliente en Google Cloud (pasos anteriores), poner `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en el `.env` (o env de PM2/Docker) y reiniciar el backend.  
- Comprueba que la URL que usa el backend en `GOOGLE_CALLBACK_URL` esté añadida en "Authorized redirect URIs" en la consola de Google.

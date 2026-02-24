# Certificado SSL autofirmado – barbersosa.com

Para usar HTTPS y Google OAuth con **barbersosa.com**.

## 1. Generar certificado

En la raíz del proyecto:

```bash
chmod +x ssl/gen-cert.sh
./ssl/gen-cert.sh
```

Se crean `ssl/cert.pem` y `ssl/key.pem` (válidos 365 días).  
**No subas `key.pem` a un repositorio público.**

## 2. Levantar nginx con HTTPS

```bash
docker compose up -d
```

Nginx ya está configurado para:
- **HTTP (80):** redirige `barbersosa.com` y `www.barbersosa.com` a HTTPS.
- **HTTPS (443):** sirve la app en `https://barbersosa.com` y `https://www.barbersosa.com`.

## 3. Google OAuth

En Google Cloud (URIs de redirección):

- `https://barbersosa.com/api/auth/google/callback`

En el `.env` del backend (o variables del `app`):

```env
GOOGLE_CALLBACK_URL=https://barbersosa.com/api/auth/google/callback
FRONTEND_CALLBACK_URL=https://barbersosa.com
```

**Nota:** El navegador mostrará aviso de “conexión no segura” porque el certificado es autofirmado. Puedes continuar de todas formas; Google OAuth funcionará con HTTPS.

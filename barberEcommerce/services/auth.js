// Servicio de autenticación
// En desarrollo: usar la URL del backend directamente
// En producción: usar la variable de entorno o la URL del nginx
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // En el navegador, usar la misma URL (nginx redirige)
    return window.location.origin;
  }
  return process.env.NUXT_PUBLIC_API_BASE || 'http://localhost';
};

export const authService = {
  // Headers de autenticación (algunos proxies quitan Authorization; el backend también acepta X-Forwarded-Authorization)
  authHeaders(token) {
    if (!token) return {};
    const bearer = `Bearer ${token}`;
    return {
      'Authorization': bearer,
      'X-Forwarded-Authorization': bearer,
      'Content-Type': 'application/json',
    };
  },

  // Obtener usuario actual (envía cookie si existe; el backend la usa si el header falla)
  async getCurrentUser(token) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: 'include',
        headers: this.authHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error('No autenticado');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  },

  // Login con email/username y password (el backend devuelve Set-Cookie para sesión)
  async login(email, password) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar usuario');
      }

      const data = await response.json();
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // Login con Google (para uso futuro)
  loginWithGoogle() {
    const apiBase = getApiBase();
    window.location.href = `${apiBase}/api/auth/google`;
  },

  // Verificar si hay token en localStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  // Guardar token
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },

  // Eliminar token (logout) y borrar cookie en el servidor
  async logout() {
    if (typeof window !== 'undefined') {
      try {
        await fetch(`${getApiBase()}/api/auth/logout`, { credentials: 'include', method: 'GET' });
      } catch (e) {
        // ignorar si falla (ej. sin conexión)
      }
      localStorage.removeItem('access_token');
    }
  },

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getToken();
  },
};

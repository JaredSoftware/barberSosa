// Composable de Nuxt para autenticación
import { authService } from '~/services/auth.js';

export const useAuth = () => {
  const token = useState('auth_token', () => authService.getToken());
  const user = useState('auth_user', () => null);
  const loading = useState('auth_loading', () => false);

  // Obtener usuario actual
  const fetchUser = async () => {
    if (!token.value) {
      user.value = null;
      return null;
    }

    loading.value = true;
    try {
      user.value = await authService.getCurrentUser(token.value);
      return user.value;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      authService.removeToken();
      token.value = null;
      user.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Login con email/username y password
  const login = async (email, password) => {
    loading.value = true;
    try {
      const data = await authService.login(email, password);
      token.value = data.access_token;
      user.value = data.user;
      
      // Fusionar carrito de invitado con carrito de usuario
      try {
        const { mergeCart } = useCart();
        await mergeCart(data.access_token);
      } catch (mergeError) {
        console.warn('Error fusionando carrito, continuando:', mergeError);
      }
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Registrar nuevo usuario
  const register = async (userData) => {
    loading.value = true;
    try {
      const data = await authService.register(userData);
      token.value = data.access_token;
      user.value = data.user;
      
      // Fusionar carrito de invitado con carrito de usuario
      try {
        const { mergeCart } = useCart();
        await mergeCart(data.access_token);
      } catch (mergeError) {
        console.warn('Error fusionando carrito, continuando:', mergeError);
      }
      
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Login con Google (para uso futuro)
  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  // Logout (borra cookie en backend y token local)
  const logout = async () => {
    await authService.logout();
    token.value = null;
    user.value = null;
  };

  // Guardar token
  const setToken = (newToken) => {
    if (typeof window !== 'undefined') {
      authService.setToken(newToken);
      token.value = newToken;
      fetchUser();
    }
  };

  // Verificar si está autenticado
  // Nota: para permitir navegación entre rutas /admin sin depender de /me,
  // consideramos autenticado si existe token. El backend sigue validando.
  const isAuthenticated = computed(() => {
    return !!token.value;
  });

  // Inicializar al montar
  if (process.client && token.value) {
    fetchUser();
  }

  return {
    token,
    user,
    loading,
    fetchUser,
    login,
    register,
    loginWithGoogle,
    logout,
    setToken,
    isAuthenticated,
  };
};

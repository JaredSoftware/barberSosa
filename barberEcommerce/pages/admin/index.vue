<template>
  <div class="min-h-screen bg-background-deep flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Login Card -->
      <div v-if="!isAuthenticated" class="bg-charcoal border border-primary/20 rounded-sm p-8 sm:p-10 shadow-xl">
        <div class="text-center mb-8">
          <h1 class="text-white text-3xl sm:text-4xl font-display font-bold uppercase tracking-widest mb-2">
            Admin Panel
          </h1>
          <p class="text-gray-400 text-sm">Sosa Barber - Gestión de Ofertas Premium</p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-400">Verificando autenticación...</p>
        </div>

        <div v-else class="space-y-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Email o Username
              </label>
              <input
                v-model="loginForm.email"
                type="text"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="tu@email.com o username"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div v-if="loginError" class="text-red-400 text-sm text-center">
              {{ loginError }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gold-gradient text-background-deep font-black uppercase tracking-[0.2em] py-4 px-6 rounded-sm hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>

          <div class="text-center">
            <NuxtLink to="/" class="text-gray-500 hover:text-primary text-sm transition-colors">
              ← Volver al sitio
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Dashboard -->
      <div v-else class="bg-charcoal border border-primary/20 rounded-sm p-8 shadow-xl">
        <div v-if="googleConnectedMessage" class="mb-4 p-4 rounded-sm bg-green-900/30 border border-green-500/50 text-green-300 text-sm">
          {{ googleConnectedMessage }}
        </div>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-white text-2xl font-display font-bold uppercase tracking-widest">
              Panel de Administración
            </h1>
            <p class="text-gray-400 text-sm mt-1">Hola, {{ user?.name || user?.email }}</p>
          </div>
          <button
            @click="handleLogout"
            class="text-gray-400 hover:text-primary transition-colors"
            title="Cerrar sesión"
          >
            <span class="material-symbols-outlined">logout</span>
          </button>
        </div>

        <div class="space-y-4">
          <NuxtLink
            to="/admin/offers"
            class="block bg-primary/10 border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-bold text-lg mb-1">Servicios y Cortes (Ofertas)</h3>
                <p class="text-gray-400 text-sm">Precio, duración y descripción de los servicios en Reservas</p>
              </div>
              <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/products"
            class="block bg-primary/10 border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-bold text-lg mb-1">Gestionar Productos</h3>
                <p class="text-gray-400 text-sm">Crear, editar y eliminar productos del catálogo</p>
              </div>
              <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/calendar"
            class="block bg-primary/10 border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-bold text-lg mb-1">Calendario (Citas)</h3>
                <p class="text-gray-400 text-sm">Ver agenda y gestionar turnos</p>
              </div>
              <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/categories"
            class="block bg-primary/10 border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-bold text-lg mb-1">Gestionar Categorías</h3>
                <p class="text-gray-400 text-sm">Crear y organizar categorías de productos</p>
              </div>
              <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/barbers"
            class="block bg-primary/10 border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-bold text-lg mb-1">Barberos</h3>
                <p class="text-gray-400 text-sm">Imagen, nombre artístico y descripción para la página de reservas</p>
              </div>
              <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </NuxtLink>

          <button
            type="button"
            @click="handleGoogleConnect"
            class="block w-full text-left bg-primary/10 border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center w-12 h-12 rounded-sm bg-white text-gray-800">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </span>
                <div>
                  <h3 class="text-white font-bold text-lg mb-1">Conectar cuenta de Google</h3>
                  <p class="text-gray-400 text-sm">Para agendamiento: vincula tu cuenta de Google y se guardará el token</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          <NuxtLink
            to="/"
            class="block text-center text-gray-400 hover:text-primary text-sm transition-colors pt-4"
          >
            ← Volver al sitio
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { isAuthenticated, user, loading, login, logout, fetchUser, token, loginWithGoogle } = useAuth();

const loginForm = ref({
  email: '',
  password: '',
});

const loginError = ref('');
const googleConnectedMessage = ref('');

onMounted(async () => {
  if (token.value && !user.value) {
    await fetchUser();
  }
  if (route.query.google_connected === '1') {
    googleConnectedMessage.value = 'Cuenta de Google vinculada correctamente. Ya puedes usar el calendario de este barbero.';
    router.replace({ path: '/admin', query: {} });
  }
});

const handleLogin = async () => {
  loginError.value = '';
  try {
    await login(loginForm.value.email, loginForm.value.password);
    // Redirigir o actualizar se hará automáticamente por la reactividad
  } catch (error) {
    loginError.value = error.message || 'Error al iniciar sesión';
  }
};

const handleLogout = () => {
  logout();
  navigateTo('/admin');
};

const handleGoogleConnect = () => {
  loginWithGoogle();
};

useHead({
  title: 'Admin Panel - Sosa Barber'
});
</script>

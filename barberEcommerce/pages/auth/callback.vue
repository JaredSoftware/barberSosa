<template>
  <div class="min-h-screen bg-background-deep flex items-center justify-center px-4">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p class="text-gray-400">Procesando autenticación...</p>
      </div>
      <div v-else-if="error" class="space-y-4">
        <span class="material-symbols-outlined text-red-500 text-5xl">error</span>
        <p class="text-gray-400">{{ error }}</p>
        <NuxtLink to="/admin" class="text-primary hover:underline">
          Volver al login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { setToken, fetchUser } = useAuth();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
      setToken(accessToken);
      await fetchUser();
      
      // Redirigir al admin después de un breve delay
      setTimeout(() => {
        navigateTo('/admin');
      }, 500);
    } else {
      error.value = 'No se recibió el token de autenticación';
      loading.value = false;
    }
  } catch (err) {
    console.error('Error en callback:', err);
    error.value = 'Error al procesar la autenticación';
    loading.value = false;
  }
});

useHead({
  title: 'Autenticando...'
});
</script>

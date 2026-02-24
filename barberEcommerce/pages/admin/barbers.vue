<template>
  <div class="min-h-screen bg-background-deep py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <NuxtLink to="/admin" class="text-gray-400 hover:text-primary text-sm mb-2 inline-block transition-colors">
            ← Volver al Dashboard
          </NuxtLink>
          <h1 class="text-white text-3xl sm:text-4xl font-display font-bold uppercase tracking-widest">
            Barberos
          </h1>
          <p class="text-gray-500 text-sm mt-1">Imagen, nombre artístico y descripción que se muestran en Reservas</p>
        </div>
      </div>

      <div class="bg-charcoal/80 border border-primary/20 rounded-sm p-4 sm:p-5 mb-8 text-sm">
        <p class="text-gray-300 mb-2">
          Los barberos se crean al <strong class="text-primary">conectar una cuenta de Google</strong> desde el dashboard. Aquí puedes editar la <strong class="text-white">ficha pública</strong>: nombre artístico, rol, imagen y descripción que aparecen en la página de reservas.
        </p>
        <p class="text-gray-500 text-xs mt-2">Si un barbero está inactivo, no se mostrará en la selección de reservas.</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Cargando barberos...</p>
      </div>

      <div v-else-if="barbersError" class="text-center py-12 bg-charcoal border border-red-500/30 rounded-sm">
        <p class="text-red-400 mb-2">Error al cargar la lista.</p>
        <p class="text-gray-400 text-sm mb-4">{{ barbersError }}</p>
        <p class="text-gray-500 text-xs">Si has cerrado sesión, vuelve a entrar en el admin e intenta de nuevo.</p>
        <button type="button" @click="fetchAdminBarbers().catch(() => {})" class="mt-4 text-primary hover:underline text-sm">Reintentar</button>
      </div>

      <div v-else-if="barbers.length === 0" class="text-center py-12 bg-charcoal border border-primary/20 rounded-sm">
        <p class="text-gray-400 mb-2">No hay barberos registrados.</p>
        <p class="text-gray-500 text-sm">Conecta una cuenta de Google desde el Panel de Administración para añadir barberos.</p>
        <NuxtLink to="/admin" class="inline-block mt-4 text-primary hover:underline text-sm">Ir al Dashboard →</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="barber in barbers"
          :key="barber._id"
          class="bg-charcoal border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all flex flex-col"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 rounded-sm overflow-hidden border border-white/10 shrink-0 bg-black/40">
              <img
                v-if="barber.imagen || barber.picture"
                :src="barber.imagen || barber.picture"
                :alt="barber.nombreArtista || barber.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-white/30">
                <span class="material-symbols-outlined text-4xl">person</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-white font-bold text-lg uppercase tracking-wider truncate">
                {{ barber.nombreArtista || barber.name || barber.email }}
              </h3>
              <p v-if="barber.rol" class="text-primary/90 text-xs font-bold uppercase tracking-wider mt-0.5">
                {{ barber.rol }}
              </p>
              <span
                :class="barber.activo !== false ? 'bg-green-600' : 'bg-gray-600'"
                class="inline-block mt-2 text-xs px-2 py-1 rounded text-white"
              >
                {{ barber.activo !== false ? 'Visible en reservas' : 'Oculto' }}
              </span>
            </div>
          </div>
          <p v-if="barber.descripcion" class="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {{ barber.descripcion }}
          </p>
          <p v-else class="text-gray-500 text-xs italic mb-4 flex-1">Sin descripción</p>
          <p class="text-gray-500 text-xs mb-4 truncate" :title="barber.email">{{ barber.email }}</p>
          <button
            type="button"
            @click="editBarber(barber)"
            class="w-full bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
          >
            Editar ficha
          </button>
        </div>
      </div>

      <!-- Modal edición -->
      <div
        v-if="editingBarber"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-charcoal border border-primary/20 rounded-sm p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 class="text-white text-2xl font-display font-bold uppercase tracking-widest mb-6">
            Editar barbero
          </h2>
          <form @submit.prevent="saveBarber" class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Nombre artístico</label>
              <input
                v-model="formData.nombreArtista"
                type="text"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary"
                placeholder="Ej. Ricardo Sosa"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Rol / título</label>
              <input
                v-model="formData.rol"
                type="text"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary"
                placeholder="Ej. Fundador & Master"
              />
            </div>
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">URL de imagen</label>
              <input
                v-model="formData.imagen"
                type="url"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary"
                placeholder="https://..."
              />
              <p class="text-gray-500 text-xs mt-1">Si está vacío se usará la foto de Google.</p>
            </div>
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Descripción</label>
              <textarea
                v-model="formData.descripcion"
                rows="3"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary resize-none"
                placeholder="Breve descripción del barbero..."
              />
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="formData.activo"
                type="checkbox"
                id="activo"
                class="rounded border-primary/30 text-primary focus:ring-primary"
              />
              <label for="activo" class="text-gray-300 text-sm">Visible en la página de reservas</label>
            </div>
            <div v-if="saveError" class="text-red-400 text-sm">{{ saveError }}</div>
            <div class="flex gap-2 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-sm transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 bg-gold-gradient text-background-deep font-black uppercase tracking-wider py-2 px-4 rounded-sm hover:brightness-110 disabled:opacity-50"
              >
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin',
});

const { isAuthenticated } = useAuth();
const { barbers, loading, error: barbersError, fetchAdminBarbers, updateBarber } = useBarbers();

const editingBarber = ref(null);
const saveError = ref('');
const formData = ref({
  nombreArtista: '',
  rol: '',
  imagen: '',
  descripcion: '',
  activo: true,
});

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await fetchAdminBarbers();
    } catch {
      // Error ya guardado en barbersError, se muestra en template
    }
  }
});

function editBarber(barber) {
  editingBarber.value = barber;
  formData.value = {
    nombreArtista: barber.nombreArtista || '',
    rol: barber.rol || '',
    imagen: barber.imagen || '',
    descripcion: barber.descripcion || '',
    activo: barber.activo !== false,
  };
  saveError.value = '';
}

function closeModal() {
  editingBarber.value = null;
  saveError.value = '';
}

async function saveBarber() {
  saveError.value = '';
  try {
    await updateBarber(editingBarber.value._id, {
      nombreArtista: formData.value.nombreArtista.trim() || undefined,
      rol: formData.value.rol.trim() || undefined,
      imagen: formData.value.imagen.trim() || undefined,
      descripcion: formData.value.descripcion.trim() || undefined,
      activo: formData.value.activo,
    });
    closeModal();
    await fetchAdminBarbers();
  } catch (e) {
    saveError.value = e.message || 'Error al guardar';
  }
}

useHead({
  title: 'Barberos - Admin',
});
</script>

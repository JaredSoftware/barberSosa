<template>
  <div class="min-h-screen bg-background-deep py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <NuxtLink to="/admin" class="text-gray-400 hover:text-primary text-sm mb-2 inline-block transition-colors">
            ← Volver al Dashboard
          </NuxtLink>
          <h1 class="text-white text-3xl sm:text-4xl font-display font-bold uppercase tracking-widest">
            Gestionar ofertas (servicios)
          </h1>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-gold-gradient text-background-deep font-black uppercase tracking-[0.2em] py-3 px-6 rounded-sm hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
        >
          <span class="material-symbols-outlined">add</span>
          Nueva oferta
        </button>
      </div>

      <!-- Explicación -->
      <div class="bg-charcoal/80 border border-primary/20 rounded-sm p-4 sm:p-5 mb-8 text-sm">
        <p class="text-gray-300 mb-2">
          <strong class="text-white">Una sola lista de ofertas.</strong> Cada oferta puede ser <strong class="text-primary">Premium</strong> o <strong class="text-gray-400">estándar</strong>. La diferencia es solo dónde se muestran en la página de reservas:
        </p>
        <ul class="text-gray-400 space-y-1 list-disc list-inside">
          <li><strong class="text-primary">Premium</strong> → aparecen en el bloque «Reservas Premium» (grid de 3 columnas).</li>
          <li><strong class="text-gray-400">Estándar</strong> → aparecen en «Selecciona Servicios» (tarjetas grandes).</li>
        </ul>
        <p class="text-gray-500 mt-3 text-xs">Al crear o editar una oferta, marca o desmarca «Reserva premium» para cambiar el tipo.</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Cargando ofertas...</p>
      </div>

      <!-- Lista organizada en dos secciones -->
      <div v-else class="space-y-10 mb-8">
        <!-- Sección: Reservas Premium -->
        <section>
          <h2 class="text-white text-lg font-display font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-2xl">star</span>
            Reservas Premium
          </h2>
          <p class="text-gray-500 text-xs mb-4">Se muestran en el grid destacado de la página de reservas.</p>
          <div v-if="premiumOffers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="offer in premiumOffers"
              :key="offer._id"
              class="bg-charcoal border border-primary/30 rounded-sm p-6 hover:border-primary/50 transition-all group relative overflow-hidden"
            >
              <div class="absolute top-4 right-4 flex flex-col gap-1 items-end">
                <span
                  :class="offer.active ? 'bg-green-600' : 'bg-gray-600'"
                  class="text-xs px-2 py-1 rounded text-white"
                >
                  {{ offer.active ? 'Activa' : 'Inactiva' }}
                </span>
                <span class="text-xs px-2 py-1 rounded bg-primary/90 text-black font-bold uppercase flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">star</span>
                  Premium
                </span>
              </div>
              <div class="mb-4">
                <div class="flex items-center gap-4 mb-3">
                  <div v-if="offer.icon" class="text-primary text-4xl">
                    <span class="material-symbols-outlined">{{ offer.icon }}</span>
                  </div>
                  <div v-else-if="offer.image" class="w-12 h-12">
                    <img :src="offer.image" :alt="offer.title" class="w-full h-full object-contain" />
                  </div>
                </div>
                <h3 class="text-white text-xl font-display font-bold uppercase tracking-widest mb-2">{{ offer.title }}</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">{{ offer.description }}</p>
              </div>
              <div class="flex items-baseline justify-between mb-4 pb-4 border-b border-primary/10">
                <span class="text-primary font-bold text-2xl">${{ offer.price }}</span>
                <span class="text-gray-500 text-xs uppercase tracking-widest">{{ offer.duration }} MIN</span>
              </div>
              <div v-if="offer.features && offer.features.length > 0" class="mb-4">
                <ul class="text-gray-500 text-xs space-y-1">
                  <li v-for="feature in offer.features" :key="feature" class="flex items-center gap-2">
                    <span class="text-primary">•</span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
              <div class="flex gap-2 mt-4">
                <button
                  @click="editOffer(offer)"
                  class="flex-1 bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
                >
                  Editar
                </button>
                <button
                  @click="deleteOfferConfirm(offer._id)"
                  class="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 bg-charcoal/50 border border-primary/10 border-dashed rounded-sm">
            <p class="text-gray-500 text-sm">Ninguna oferta marcada como premium. Edita una oferta y activa «Reserva premium».</p>
          </div>
        </section>

        <!-- Sección: Servicios estándar -->
        <section>
          <h2 class="text-white text-lg font-display font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-500 text-2xl">content_cut</span>
            Servicios estándar
          </h2>
          <p class="text-gray-500 text-xs mb-4">Se muestran en las tarjetas de «Selecciona Servicios» en la página de reservas.</p>
          <div v-if="standardOffers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="offer in standardOffers"
              :key="offer._id"
              class="bg-charcoal border border-white/10 rounded-sm p-6 hover:border-primary/30 transition-all group relative overflow-hidden"
            >
              <div class="absolute top-4 right-4">
                <span
                  :class="offer.active ? 'bg-green-600' : 'bg-gray-600'"
                  class="text-xs px-2 py-1 rounded text-white"
                >
                  {{ offer.active ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              <div class="mb-4">
                <div class="flex items-center gap-4 mb-3">
                  <div v-if="offer.icon" class="text-primary text-4xl">
                    <span class="material-symbols-outlined">{{ offer.icon }}</span>
                  </div>
                  <div v-else-if="offer.image" class="w-12 h-12">
                    <img :src="offer.image" :alt="offer.title" class="w-full h-full object-contain" />
                  </div>
                </div>
                <h3 class="text-white text-xl font-display font-bold uppercase tracking-widest mb-2">{{ offer.title }}</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">{{ offer.description }}</p>
              </div>
              <div class="flex items-baseline justify-between mb-4 pb-4 border-b border-primary/10">
                <span class="text-primary font-bold text-2xl">${{ offer.price }}</span>
                <span class="text-gray-500 text-xs uppercase tracking-widest">{{ offer.duration }} MIN</span>
              </div>
              <div v-if="offer.features && offer.features.length > 0" class="mb-4">
                <ul class="text-gray-500 text-xs space-y-1">
                  <li v-for="feature in offer.features" :key="feature" class="flex items-center gap-2">
                    <span class="text-primary">•</span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
              <div class="flex gap-2 mt-4">
                <button
                  @click="editOffer(offer)"
                  class="flex-1 bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
                >
                  Editar
                </button>
                <button
                  @click="deleteOfferConfirm(offer._id)"
                  class="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 bg-charcoal/50 border border-white/10 border-dashed rounded-sm">
            <p class="text-gray-500 text-sm">Ninguna oferta estándar. Todas están como premium o no hay ofertas.</p>
          </div>
        </section>
      </div>

      <!-- Empty state global (sin ofertas) -->
      <div v-if="!loading && offers.length === 0" class="text-center py-12 bg-charcoal border border-primary/20 rounded-sm">
        <p class="text-gray-400">No hay ofertas. Crea una nueva oferta para comenzar.</p>
      </div>

      <!-- Modal de creación/edición -->
      <div
        v-if="showCreateModal || editingOffer"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-charcoal border border-primary/20 rounded-sm p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 class="text-white text-2xl font-display font-bold uppercase tracking-widest mb-6">
            {{ editingOffer ? 'Editar Oferta' : 'Nueva Oferta' }}
          </h2>

          <form @submit.prevent="saveOffer" class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Título *
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="Ej: Corte Premium"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Descripción *
              </label>
              <textarea
                v-model="formData.description"
                required
                rows="3"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Descripción detallada del servicio"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Precio *
                </label>
                <input
                  v-model.number="formData.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Duración (min) *
                </label>
                <input
                  v-model.number="formData.duration"
                  type="number"
                  min="1"
                  required
                  class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Icono (Material Symbols)
              </label>
              <input
                v-model="formData.icon"
                type="text"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="content_cut"
              />
              <div class="flex items-center gap-2 mt-1">
                <p class="text-gray-500 text-xs">
                  Nombre del icono de Material Symbols (opcional)
                </p>
                <a
                  href="https://fonts.google.com/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:text-gold text-xs underline flex items-center gap-1"
                  title="Buscar iconos disponibles"
                >
                  <span class="material-symbols-outlined !text-sm">open_in_new</span>
                  Ver iconos disponibles
                </a>
              </div>
              <div v-if="formData.icon" class="mt-2 flex items-center gap-2">
                <span class="text-gray-400 text-xs">Vista previa:</span>
                <span class="material-symbols-outlined text-primary text-2xl">{{ formData.icon }}</span>
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                URL de Imagen
              </label>
              <input
                v-model="formData.image"
                type="url"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider mb-3">
                Características (una por línea)
              </label>
              <textarea
                v-model="featuresText"
                rows="4"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Corte profesional&#10;Lavado incluido&#10;Productos premium"
              ></textarea>
            </div>

            <div class="flex items-center gap-2">
              <input
                v-model="formData.active"
                type="checkbox"
                id="active"
                class="rounded border-primary/20 bg-background-deep text-primary focus:ring-primary"
              />
              <label for="active" class="text-gray-400 text-sm uppercase tracking-wider">
                Oferta activa
              </label>
            </div>

            <div class="flex items-center gap-2">
              <input
                v-model="formData.premium"
                type="checkbox"
                id="premium"
                class="rounded border-primary/20 bg-background-deep text-primary focus:ring-primary"
              />
              <label for="premium" class="text-gray-400 text-sm uppercase tracking-wider">
                Reserva premium (aparece en la sección Premium en reservas)
              </label>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                class="flex-1 bg-gold-gradient text-background-deep font-black uppercase tracking-[0.2em] py-3 px-6 rounded-sm hover:brightness-110 transition-all shadow-lg"
              >
                {{ editingOffer ? 'Actualizar' : 'Crear' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-background-deep border border-primary/20 text-gray-400 hover:text-white font-bold py-3 px-6 rounded-sm transition-all uppercase tracking-wider"
              >
                Cancelar
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
  middleware: 'admin'
});

const { isAuthenticated, user } = useAuth();
const { offers, loading, fetchOffers, createOffer, updateOffer, deleteOffer } = useOffers();

const premiumOffers = computed(() => (offers.value || []).filter(o => o.premium === true));
const standardOffers = computed(() => (offers.value || []).filter(o => !o.premium));

const showCreateModal = ref(false);
const editingOffer = ref(null);
const formData = ref({
  title: '',
  description: '',
  price: 0,
  duration: 0,
  icon: '',
  image: '',
  active: true,
  premium: false,
  features: []
});

const featuresText = ref('');

// Cargar ofertas al montar
onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchOffers(false); // Cargar todas las ofertas (activas e inactivas)
  }
});

// Watch para sincronizar featuresText con formData.features
watch(featuresText, (newVal) => {
  formData.value.features = newVal
    .split('\n')
    .map(f => f.trim())
    .filter(f => f.length > 0);
});

const editOffer = (offer) => {
  editingOffer.value = offer;
  formData.value = {
    title: offer.title,
    description: offer.description,
    price: offer.price,
    duration: offer.duration,
    icon: offer.icon || '',
    image: offer.image || '',
    active: offer.active !== false,
    premium: offer.premium === true,
    features: offer.features || []
  };
  featuresText.value = (offer.features || []).join('\n');
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingOffer.value = null;
  formData.value = {
    title: '',
    description: '',
    price: 0,
    duration: 0,
    icon: '',
    image: '',
    active: true,
    premium: false,
    features: []
  };
  featuresText.value = '';
};

const saveOffer = async () => {
  try {
    // Preparar datos, asegurando que los campos numéricos sean números
    const offerData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      price: Number(formData.value.price),
      duration: Number(formData.value.duration),
      active: formData.value.active !== false,
      premium: formData.value.premium === true,
      // Importante: enviar estos campos aunque vengan vacíos para poder "limpiarlos"
      // (si no se envían en el PATCH, el backend mantiene el valor anterior)
      icon: (formData.value.icon ?? '').trim(),
      image: (formData.value.image ?? '').trim(),
      features: Array.isArray(formData.value.features) ? formData.value.features : [],
    };
    
    console.log('💾 Guardando oferta:', offerData);
    console.log('📋 formData.premium original:', formData.value.premium);
    console.log('✅ premium enviado al backend:', offerData.premium);
    
    if (editingOffer.value) {
      const updated = await updateOffer(editingOffer.value._id, offerData);
      console.log('✅ Oferta actualizada desde el backend:', updated);
    } else {
      const created = await createOffer(offerData);
      console.log('✅ Oferta creada desde el backend:', created);
    }
    closeModal();
    await fetchOffers(false);
  } catch (error) {
    console.error('❌ Error guardando oferta:', error);
    const errorMessage = error.message || 'Error desconocido';
    alert('Error al guardar la oferta: ' + errorMessage);
  }
};

const deleteOfferConfirm = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
    try {
      await deleteOffer(id);
      await fetchOffers(false);
    } catch (error) {
      console.error('Error eliminando oferta:', error);
      alert('Error al eliminar la oferta: ' + (error.message || 'Error desconocido'));
    }
  }
};

useHead({
  title: 'Gestionar ofertas (servicios) - Admin'
});
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1
        class="text-4xl md:text-5xl font-bold text-center mb-4 font-cinzel text-gold-gradient"
      >
        RESERVAR CITA
      </h1>
      <p class="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        Selecciona tu barbero de preferencia y el horario que mejor se adapte a
        ti.
      </p>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Left Column: Selection -->
        <div class="space-y-8">
          <!-- Barber Selection -->
          <div class="space-y-4">
            <h2 class="text-2xl font-cinzel text-white flex items-center gap-2">
              <span
                class="flex items-center justify-center w-8 h-8 rounded-full bg-gold-gradient text-black text-sm font-bold"
                >1</span
              >
              ELIGE TU BARBERO
            </h2>

            <div v-if="barbersLoading" class="text-gold-400">
              Cargando barberos...
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
              <div
                v-for="barber in barbers"
                :key="barber._id"
                @click="selectBarber(barber)"
                class="cursor-pointer group relative overflow-hidden rounded-lg border transition-all duration-300"
                :class="
                  selectedBarber?._id === barber._id
                    ? 'border-gold-500 bg-white/5'
                    : 'border-white/10 hover:border-gold-500/50'
                "
              >
                <div class="aspect-square bg-gray-800 relative">
                  <img
                    v-if="barber.picture || barber.imagen"
                    :src="barber.imagen || barber.picture"
                    :alt="barber.name"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-600"
                  >
                    <span class="material-symbols-outlined text-4xl"
                      >person</span
                    >
                  </div>

                  <!-- Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-3"
                  >
                    <p class="font-bold text-white">
                      {{ barber.nombreArtista || barber.name }}
                    </p>
                    <p class="text-xs text-gold-400">
                      {{ barber.rol || "Barber" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar Component -->
          <div v-if="selectedBarber" class="space-y-4 animate-fade-in-up">
            <h2 class="text-2xl font-cinzel text-white flex items-center gap-2">
              <span
                class="flex items-center justify-center w-8 h-8 rounded-full bg-gold-gradient text-black text-sm font-bold"
                >2</span
              >
              SELECCIONA HORARIO
            </h2>
            <BookingCalendar
              :barberId="selectedBarber._id"
              @slotSelected="onSlotSelected"
            />
          </div>
        </div>

        <!-- Right Column: Confirmation Form -->
        <div v-if="selectedSlot && selectedBarber" class="relative">
          <div class="sticky top-24">
            <div
              class="p-6 rounded-xl border border-gold-500/30 bg-[#111] shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <h2
                class="text-2xl font-cinzel text-gold-gradient mb-6 text-center"
              >
                CONFIGURACIÓN
              </h2>

              <div class="space-y-4 mb-6 text-sm text-gray-300">
                <div class="flex justify-between border-b border-gray-800 pb-2">
                  <span>Barbero:</span>
                  <span class="font-bold text-white">{{
                    selectedBarber.nombreArtista || selectedBarber.name
                  }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-800 pb-2">
                  <span>Fecha:</span>
                  <span class="font-bold text-white">{{
                    new Date(selectedSlot).toLocaleDateString()
                  }}</span>
                </div>
                <div class="flex justify-between border-b border-gray-800 pb-2">
                  <span>Hora:</span>
                  <span class="font-bold text-white">{{
                    new Date(selectedSlot).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}</span>
                </div>
              </div>

              <!-- Guest Form -->
              <form @submit.prevent="confirmBooking" class="space-y-4">
                <div>
                  <label
                    class="block text-xs uppercase tracking-wider text-gray-500 mb-1"
                    >Nombre Completo</label
                  >
                  <input
                    v-model="form.clientName"
                    type="text"
                    required
                    class="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-white focus:border-gold-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs uppercase tracking-wider text-gray-500 mb-1"
                    >Email</label
                  >
                  <input
                    v-model="form.clientEmail"
                    type="email"
                    required
                    class="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-white focus:border-gold-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs uppercase tracking-wider text-gray-500 mb-1"
                    >Teléfono</label
                  >
                  <input
                    v-model="form.clientPhone"
                    type="tel"
                    required
                    class="w-full bg-black/50 border border-gray-700 rounded-md p-2 text-white focus:border-gold-500 focus:ring-0 transition-colors"
                  />
                </div>

                <div
                  v-if="errorMessage"
                  class="p-3 bg-red-900/30 border border-red-800 rounded text-red-400 text-sm"
                >
                  {{ errorMessage }}
                </div>

                <button
                  type="submit"
                  :disabled="bookingLoading"
                  class="w-full py-3 mt-4 bg-gold-gradient text-black font-bold uppercase tracking-widest rounded transition-transform active:scale-95 disabled:opacity-70 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                  <span v-if="bookingLoading">Procesando...</span>
                  <span v-else>Confirmar Cita</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const API_URL = config.public.apiBase;

const barbers = ref([]);
const barbersLoading = ref(true);
const selectedBarber = ref(null);
const selectedSlot = ref(null);
const bookingLoading = ref(false);
const errorMessage = ref("");

const form = reactive({
  clientName: "",
  clientEmail: "",
  clientPhone: "",
});

onMounted(async () => {
  try {
    const { data } = await useFetch(`${API_URL}/api/barberos`);
    if (data.value) {
      barbers.value = data.value;
    }
  } catch (e) {
    console.error("Error fetching barbers", e);
  } finally {
    barbersLoading.value = false;
  }
});

function selectBarber(barber) {
  selectedBarber.value = barber;
  selectedSlot.value = null;
}

function onSlotSelected(slot) {
  selectedSlot.value = slot;
}

async function confirmBooking() {
  bookingLoading.value = true;
  errorMessage.value = "";

  try {
    const { data, error } = await useFetch(`${API_URL}/api/appointments`, {
      method: "POST",
      body: {
        barberId: selectedBarber.value._id,
        date: selectedSlot.value,
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
      },
    });

    if (error.value) {
      throw new Error(error.value.message || "Error creating appointment");
    }

    // Success
    alert("Cita reservada con éxito!");
    // Reset or redirect
    selectedSlot.value = null;
    selectedBarber.value = null;
    form.clientName = "";
    form.clientEmail = "";
    form.clientPhone = "";
  } catch (e) {
    errorMessage.value =
      "No se pudo reservar la cita. El horario podría no estar disponible.";
    console.error(e);
  } finally {
    bookingLoading.value = false;
  }
}
</script>

<style scoped>
.font-cinzel {
  font-family: "Cinzel", serif;
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

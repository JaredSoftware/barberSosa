<template>
  <div
    class="booking-calendar p-6 rounded-xl premium-border bg-opacity-10 bg-black backdrop-blur-sm"
  >
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gold-gradient font-cinzel">
        SELECCIONAR FECHA
      </h3>
      <div class="flex gap-2">
        <button
          @click="prevWeek"
          :disabled="isCurrentWeek"
          class="p-2 text-gold-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          @click="nextWeek"
          class="p-2 text-gold-400 hover:text-white transition-colors"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- Date Strip -->
    <div class="grid grid-cols-7 gap-2 mb-8">
      <div
        v-for="day in weekDays"
        :key="day.dateStr"
        @click="selectDate(day.dateStr)"
        class="flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-300 border border-transparent hover:border-gold-500/30"
        :class="
          selectedDate === day.dateStr
            ? 'bg-gold-gradient text-black font-bold'
            : 'bg-white/5 text-gray-300'
        "
      >
        <span class="text-xs uppercase opacity-80">{{ day.dayName }}</span>
        <span class="text-lg">{{ day.dayNumber }}</span>
      </div>
    </div>

    <!-- Time Slots -->
    <div v-if="selectedDate" class="animate-fade-in">
      <h3 class="text-xl font-bold text-gold-gradient font-cinzel mb-4">
        HORARIOS DISPONIBLES
      </h3>

      <div v-if="loading" class="flex justify-center py-8">
        <div
          class="animate-spin h-8 w-8 border-2 border-gold-500 rounded-full border-t-transparent"
        ></div>
      </div>

      <div
        v-else-if="slots.length === 0"
        class="text-center py-8 text-gray-400"
      >
        No hay horarios disponibles para esta fecha.
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        <button
          v-for="slot in formattedSlots"
          :key="slot.iso"
          @click="selectSlot(slot.iso)"
          class="py-2 px-4 rounded-md text-sm transition-all duration-300 border"
          :class="
            selectedSlot === slot.iso
              ? 'bg-gold-500 text-black border-gold-500 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'bg-transparent text-gold-400 border-gold-500/30 hover:border-gold-500 hover:bg-gold-500/10'
          "
        >
          {{ slot.time }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  barberId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["slotSelected"]);

const selectedDate = ref(null);
const selectedSlot = ref(null);
const slots = ref([]);
const loading = ref(false);
const currentWeekStart = ref(new Date());

const config = useRuntimeConfig();
const API_URL = config.public.apiBase; // Fallback removed

// Compute week days
const weekDays = computed(() => {
  const days = [];
  const start = new Date(currentWeekStart.value);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      dateStr: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
      dayNumber: d.getDate(),
    });
  }
  return days;
});

const isCurrentWeek = computed(() => {
  const now = new Date();
  const start = new Date(currentWeekStart.value);
  return start <= now && start.toDateString() !== now.toDateString(); // Simplified check
});

function prevWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() - 7);
  if (d < new Date()) {
    currentWeekStart.value = new Date();
  } else {
    currentWeekStart.value = d;
  }
}

function nextWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() + 7);
  currentWeekStart.value = d;
}

async function selectDate(dateStr) {
  selectedDate.value = dateStr;
  selectedSlot.value = null;
  await fetchSlots(dateStr);
}

function selectSlot(isoDate) {
  selectedSlot.value = isoDate;
  emit("slotSelected", isoDate);
}

async function fetchSlots(date) {
  if (!props.barberId) return;

  loading.value = true;
  try {
    const { data } = await useFetch(
      `${API_URL}/api/appointments/availability`,
      {
        params: {
          barberId: props.barberId,
          date: date,
        },
      },
    );

    if (data.value) {
      slots.value = data.value;
    }
  } catch (error) {
    console.error("Error fetching slots:", error);
    slots.value = [];
  } finally {
    loading.value = false;
  }
}

const formattedSlots = computed(() => {
  return slots.value.map((iso) => {
    const d = new Date(iso);
    return {
      iso,
      time: d.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });
});

// Reset if barber changes
watch(
  () => props.barberId,
  () => {
    selectedDate.value = null;
    selectedSlot.value = null;
    slots.value = [];
  },
);
</script>

<style scoped>
.font-cinzel {
  font-family: "Cinzel", serif;
}
</style>

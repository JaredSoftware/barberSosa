<template>
  <div class="dark">
    <div
      class="calendar-root bg-slate-50 text-slate-900 dark:bg-deeper-gray dark:text-white min-h-screen flex flex-col"
    >
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar Filters -->
        <aside
          class="w-64 bg-background-deep border-r border-white/10 p-6 flex flex-col gap-8 overflow-y-auto hidden lg:flex"
        >
          <div>
            <h3
              class="text-white text-xs font-bold uppercase tracking-widest mb-4"
            >
              Calendario
            </h3>
            <div class="bg-accent-gray/30 rounded-xl p-4 border border-white/5">
              <div class="flex items-center justify-between mb-4">
                <button
                  class="text-white hover:text-primary"
                  type="button"
                  @click="previousMonth"
                >
                  <span class="material-symbols-outlined text-sm"
                    >chevron_left</span
                  >
                </button>
                <span class="text-white text-sm font-bold capitalize">{{
                  currentMonthLabel
                }}</span>
                <button
                  class="text-white hover:text-primary"
                  type="button"
                  @click="nextMonth"
                >
                  <span class="material-symbols-outlined text-sm"
                    >chevron_right</span
                  >
                </button>
              </div>
              <div
                class="grid grid-cols-7 gap-1 text-[10px] text-center text-white/50 mb-2"
              >
                <span>L</span><span>M</span><span>M</span><span>J</span
                ><span>V</span><span>S</span><span>D</span>
              </div>
              <div class="grid grid-cols-7 gap-1">
                <div
                  v-for="day in monthDays"
                  :key="day.key"
                  class="text-[11px] h-6 flex items-center justify-center rounded-md"
                  :class="[
                    day.isCurrentMonth ? 'text-white' : 'text-white/20',
                    day.isToday
                      ? 'bg-primary text-background-deep font-bold'
                      : 'hover:bg-white/10',
                  ]"
                >
                  {{ day.label }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col">
              <h3
                class="text-white text-xs font-bold uppercase tracking-widest mb-4"
              >
                Filtrar por Barbero
              </h3>
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold cursor-pointer transition-all"
                :class="
                  !selectedBarber
                    ? 'bg-primary text-background-deep'
                    : 'hover:bg-white/5 text-white/80'
                "
                @click="selectedBarber = null"
              >
                <span class="material-symbols-outlined">group</span>
                <span class="text-sm">Todos</span>
              </label>
              <template v-if="barbers">
                <label
                  v-for="barber in barbers"
                  :key="barber._id"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                  :class="
                    selectedBarber === barber._id
                      ? 'bg-primary text-background-deep font-bold'
                      : 'hover:bg-white/5 text-white/80'
                  "
                  @click="selectedBarber = barber._id"
                >
                  <div
                    class="size-6 rounded-full bg-cover bg-center"
                    :aria-label="`Profile of ${barber.name}`"
                    :style="{
                      backgroundImage: `url(${barber.picture || 'https://via.placeholder.com/30'})`,
                    }"
                  ></div>
                  <span class="text-sm">{{ barber.name }}</span>
                </label>
              </template>
            </div>
          </div>
        </aside>

        <!-- Main Content (Calendar) -->
        <main class="flex-1 flex flex-col overflow-hidden bg-deeper-gray">
          <!-- Page Heading -->
          <div
            class="flex flex-wrap justify-between items-end gap-3 px-8 py-6 border-b border-white/5"
          >
            <div class="flex flex-col gap-1">
              <p
                class="text-white text-3xl font-black leading-tight tracking-tight"
              >
                Gestión de Citas
              </p>
              <div class="flex items-center gap-2 text-primary/80 font-medium">
                <span class="material-symbols-outlined text-sm"
                  >calendar_today</span
                >
                <p class="text-sm">{{ weekRangeLabel }}</p>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="flex bg-accent-gray rounded-lg p-1">
                <button
                  :class="
                    viewMode === 'week'
                      ? 'bg-deeper-gray text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  "
                  class="px-4 py-1.5 rounded-md text-xs font-bold transition-colors"
                  type="button"
                  @click="viewMode = 'week'"
                >
                  Semana
                </button>
                <button
                  :class="
                    viewMode === 'month'
                      ? 'bg-deeper-gray text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  "
                  class="px-4 py-1.5 rounded-md text-xs font-bold transition-colors"
                  type="button"
                  @click="viewMode = 'month'"
                >
                  Mes
                </button>
              </div>
              <button
                @click="openConfigModal"
                class="flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary text-background-deep text-xs font-bold hover:bg-white transition-colors"
              >
                <span class="material-symbols-outlined text-sm">settings</span>
                Configurar Horarios
              </button>
            </div>
          </div>

          <!-- Configuration Modal -->
          <div
            v-if="showConfigModal"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div
              class="bg-background-deep border border-white/10 rounded-xl w-full max-w-lg p-6 shadow-2xl"
            >
              <h3 class="text-xl font-bold text-white mb-4">
                Configurar Horarios y Festivos
              </h3>

              <div class="flex flex-col gap-4">
                <!-- Hours -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="text-white/60 text-xs font-bold uppercase mb-1 block"
                      >Hora Apertura</label
                    >
                    <input
                      v-model="configForm.openTime"
                      type="time"
                      class="w-full bg-accent-gray text-white border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label
                      class="text-white/60 text-xs font-bold uppercase mb-1 block"
                      >Hora Cierre</label
                    >
                    <input
                      v-model="configForm.closeTime"
                      type="time"
                      class="w-full bg-accent-gray text-white border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <!-- Working Days -->
                <div>
                  <label
                    class="text-white/60 text-xs font-bold uppercase mb-2 block"
                    >Días Laborables</label
                  >
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="(day, idx) in [
                        'Dom',
                        'Lun',
                        'Mar',
                        'Mié',
                        'Jue',
                        'Vie',
                        'Sáb',
                      ]"
                      :key="idx"
                      class="flex items-center gap-2 cursor-pointer bg-accent-gray px-3 py-1.5 rounded-md border border-white/5 hover:border-white/20"
                    >
                      <input
                        type="checkbox"
                        :value="idx"
                        v-model="configForm.workingDays"
                        class="accent-primary"
                      />
                      <span class="text-white text-xs">{{ day }}</span>
                    </label>
                  </div>
                </div>

                <!-- Holidays -->
                <div>
                  <label
                    class="text-white/60 text-xs font-bold uppercase mb-2 block"
                    >Días Festivos (Cierre)</label
                  >
                  <div class="flex gap-2 mb-2">
                    <input
                      v-model="configForm.newHoliday"
                      type="date"
                      class="flex-1 bg-accent-gray text-white border border-white/10 rounded-lg p-2 text-sm"
                    />
                    <button
                      @click="addHoliday"
                      class="bg-primary text-background-deep px-3 rounded-lg font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    <div
                      v-for="(h, idx) in configForm.holidays"
                      :key="idx"
                      class="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded text-xs flex items-center gap-2"
                    >
                      {{ h }}
                      <button
                        @click="removeHoliday(idx)"
                        class="hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  class="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10"
                >
                  <button
                    @click="showConfigModal = false"
                    class="text-white/60 hover:text-white text-sm font-bold px-4 py-2"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="saveConfiguration"
                    class="bg-primary hover:bg-white text-background-deep text-sm font-bold px-6 py-2 rounded-lg transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="flex-1 overflow-auto p-4 lg:p-8">
            <!-- Vista Semana -->
            <div
              v-if="viewMode === 'week'"
              class="min-w-[800px] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-background-deep border-b border-white/10">
                    <th
                      class="w-24 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-center"
                    >
                      Hora
                    </th>
                    <th
                      v-for="day in weekDays"
                      :key="day"
                      class="py-4 text-sm font-bold text-white border-l border-white/5 capitalize"
                    >
                      {{ format(day, "EEEE d", { locale: es }) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-deeper-gray">
                  <tr
                    v-for="hour in hours"
                    :key="hour"
                    class="border-b border-white/5 min-h-[6rem]"
                  >
                    <td
                      class="text-center text-xs font-medium text-white/40 align-top pt-4"
                    >
                      {{ String(hour).padStart(2, "0") }}:00
                    </td>
                    <td
                      v-for="day in weekDays"
                      :key="day"
                      class="p-2 border-l border-white/5 align-top relative min-h-[6rem] transition-colors cursor-pointer"
                      :class="{ 'bg-white/5': isSameDay(day, selectedDay) }"
                      @click="selectedDay = day"
                    >
                      <div
                        v-for="appt in getAppointmentsForSlot(day, hour)"
                        :key="appt._id"
                        class="bg-background-deep border-l-4 border-primary p-2 rounded-md shadow-lg mb-2 hover:scale-[1.02] transition-transform cursor-pointer relative group"
                      >
                        <p
                          class="text-primary text-[10px] font-black uppercase"
                        >
                          {{ format(new Date(appt.date), "HH:mm") }} -
                          {{
                            format(
                              addMinutes(
                                new Date(appt.date),
                                appt.duration || 60,
                              ),
                              "HH:mm",
                            )
                          }}
                        </p>
                        <p class="text-white text-xs font-bold mt-1 truncate">
                          {{ appt.user?.name || appt.clientName || "Cliente" }}
                        </p>
                        <div class="flex items-center gap-1 mt-1">
                          <div
                            class="size-3 rounded-full bg-cover bg-center"
                            :style="{
                              backgroundImage: `url(${appt.barber?.picture || 'https://via.placeholder.com/30'})`,
                            }"
                          ></div>
                          <p class="text-white/50 text-[9px] truncate">
                            {{ appt.barber?.name }}
                          </p>
                        </div>
                        <p
                          v-if="appt.notes"
                          class="text-white/40 text-[9px] italic mt-1 truncate"
                        >
                          {{ appt.notes }}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Vista Mes -->
            <div
              v-else
              class="border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              <div
                class="bg-background-deep border-b border-white/10 px-6 py-4 flex items-center justify-between"
              >
                <h4
                  class="text-white font-black uppercase tracking-widest text-sm"
                >
                  Octubre 2023
                </h4>
                <div
                  class="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest"
                >
                  <span class="material-symbols-outlined text-sm"
                    >calendar_month</span
                  >
                  <span>Vista mensual</span>
                </div>
              </div>

              <div class="bg-deeper-gray p-4">
                <div
                  class="grid grid-cols-7 gap-2 text-[10px] text-center text-white/50 mb-3 font-bold uppercase tracking-widest"
                >
                  <span>L</span><span>M</span><span>M</span><span>J</span
                  ><span>V</span><span>S</span><span>D</span>
                </div>

                <div class="grid grid-cols-7 gap-2">
                  <div
                    v-for="day in monthDays"
                    :key="day.key"
                    :class="
                      day.isCurrentMonth
                        ? 'bg-background-deep/60 border-white/10'
                        : 'bg-background-deep/20 border-white/5 opacity-50'
                    "
                    class="min-h-[110px] rounded-xl border p-3 flex flex-col gap-2"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-white/70 text-xs font-black">{{
                        day.label
                      }}</span>
                      <span
                        v-if="day.isToday"
                        class="text-[10px] font-black text-primary"
                        >HOY</span
                      >
                    </div>

                    <div class="flex flex-col gap-1">
                      <template v-if="eventsByDay[day.dayNumber]?.length">
                        <div
                          v-for="(ev, idx) in eventsByDay[day.dayNumber]"
                          :key="idx"
                          class="bg-background-deep border-l-4 border-primary rounded-md px-2 py-1"
                        >
                          <p
                            class="text-primary text-[9px] font-black uppercase leading-none"
                          >
                            {{ ev.time }}
                          </p>
                          <p
                            class="text-white text-[10px] font-bold truncate leading-tight"
                          >
                            {{ ev.client }}
                          </p>
                        </div>
                      </template>
                      <div v-else class="text-white/20 text-[10px] italic pt-2">
                        Sin citas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Right Side Panel: Today's Agenda -->
        <aside
          class="w-80 bg-background-deep border-l border-white/10 flex flex-col hidden xl:flex"
        >
          <div class="p-6 border-b border-white/5">
            <h3 class="text-white text-lg font-bold mb-1">Agenda del Día</h3>
            <p class="text-white/40 text-xs capitalize">
              {{ format(selectedDay, "EEEE, d 'de' MMMM", { locale: es }) }}
            </p>
          </div>
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <template v-if="agendaAppointments?.length">
              <div
                v-for="appt in agendaAppointments"
                :key="appt._id"
                class="bg-accent-gray/20 rounded-xl p-4 border border-white/5 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div class="flex justify-between items-start mb-2">
                  <span
                    class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider"
                    >{{ appt.status || "Confirmado" }}</span
                  >
                  <span class="text-white/40 text-[10px] font-bold">
                    <!-- Manually format UTC time to show "Shop Time" -->
                    {{
                      String(new Date(appt.date).getUTCHours()).padStart(
                        2,
                        "0",
                      )
                    }}:{{
                      String(new Date(appt.date).getUTCMinutes()).padStart(
                        2,
                        "0",
                      )
                    }}
                  </span>
                </div>
                <!-- Rest of card content same... -->
                <h4
                  class="text-white font-bold text-sm mb-1 group-hover:text-primary transition-colors"
                >
                  {{ appt.user?.name || appt.clientName || "Cliente" }}
                </h4>
                <p class="text-white/50 text-xs">
                  Servicio: {{ appt.notes || "General" }}
                </p>
                <div
                  class="mt-3 pt-3 border-t border-white/5 flex items-center gap-2"
                >
                  <div
                    class="size-5 rounded-full bg-cover bg-center"
                    aria-label="Barber profile"
                    :style="{
                      backgroundImage: `url(${appt.barber?.picture || 'https://via.placeholder.com/20'})`,
                    }"
                  ></div>
                  <span class="text-white/40 text-[10px]"
                    >Atendido por: {{ appt.barber?.name }}</span
                  >
                </div>
              </div>
            </template>
            <div v-else class="text-white/40 text-sm text-center italic py-4">
              No hay citas para este día.
            </div>
          </div>

          <div class="p-6 bg-background-deep mt-auto border-t border-white/5">
            <div class="flex justify-between text-white/60 text-xs mb-2">
              <span>Ocupación:</span>
              <span class="text-primary font-bold">{{ dailyOccupancy }}%</span>
            </div>
            <div
              class="w-full h-1.5 bg-accent-gray rounded-full overflow-hidden"
            >
              <div
                class="bg-primary h-full transition-all duration-500"
                :style="{ width: `${dailyOccupancy}%` }"
              ></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const { appointments, fetchAppointments } = useAppointments();
const { shopConfig, fetchConfig, updateConfig } = useShopConfig();
const { barbers, fetchBarbers } = useBarbers();

const viewMode = ref("week"); // 'week' | 'month'
const showConfigModal = ref(false);
const selectedBarber = ref(null); // null means 'All'

// Configuration State
const configForm = ref({
  openTime: "09:00",
  closeTime: "20:00",
  workingDays: [],
  holidays: [],
  newHoliday: "",
});

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchAppointments(), fetchConfig(), fetchBarbers()]);

  if (shopConfig.value) {
    configForm.value = {
      ...shopConfig.value,
      holidays: shopConfig.value.holidays.map(
        (d) => new Date(d).toISOString().split("T")[0],
      ),
    };
  }
});

const openConfigModal = () => {
  if (shopConfig.value) {
    configForm.value = {
      ...shopConfig.value,
      holidays:
        shopConfig.value.holidays.map(
          (d) => new Date(d).toISOString().split("T")[0],
        ) || [],
    };
  }
  showConfigModal.value = true;
};

const saveConfiguration = async () => {
  const success = await updateConfig({
    ...configForm.value,
    holidays: configForm.value.holidays.map((d) => new Date(d)),
  });
  if (success) {
    showConfigModal.value = false;
    alert("Configuración guardada correctamente");
    await fetchConfig(); // Refresh to ensure sync
  } else {
    alert("Error al guardar configuración");
  }
};

const addHoliday = () => {
  if (configForm.value.newHoliday) {
    configForm.value.holidays.push(configForm.value.newHoliday);
    configForm.value.newHoliday = "";
  }
};

const removeHoliday = (index) => {
  configForm.value.holidays.splice(index, 1);
};

// Calendar Logic
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  format,
  isSameDay,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  addMinutes,
} from "date-fns";
import { es } from "date-fns/locale";

const currentDate = ref(new Date());

const weekStart = computed(() =>
  startOfWeek(currentDate.value, { weekStartsOn: 1 }),
);
const weekEnd = computed(() =>
  endOfWeek(currentDate.value, { weekStartsOn: 1 }),
);
const weekDays = computed(() =>
  eachDayOfInterval({ start: weekStart.value, end: weekEnd.value }),
);

const hours = computed(() => {
  const start = parseInt(shopConfig.value?.openTime?.split(":")[0] || "9");
  const end = parseInt(shopConfig.value?.closeTime?.split(":")[0] || "20");
  const h = [];
  for (let i = start; i <= end; i++) {
    h.push(i);
  }
  return h;
});

const selectedDay = ref(new Date());

const getAppointmentsForSlot = (day, hour) => {
  if (!appointments.value) return [];
  return appointments.value.filter((appt) => {
    // Filter by barber if selected
    if (selectedBarber.value && appt.barber?._id !== selectedBarber.value) {
      // Handle case where appt.barber might be just an ID string or object
      if (
        typeof appt.barber === "string" &&
        appt.barber !== selectedBarber.value
      ) {
        return false;
      }
      if (
        typeof appt.barber === "object" &&
        appt.barber?._id !== selectedBarber.value
      ) {
        return false;
      }
    }

    const apptDate = new Date(appt.date);
    // Use UTC components to interpret the stored time as "Shop Time"
    // This bypasses browser timezone conversion
    const isSameDate =
      apptDate.getUTCDate() === day.getDate() &&
      apptDate.getUTCMonth() === day.getMonth() &&
      apptDate.getUTCFullYear() === day.getFullYear();

    return isSameDate && apptDate.getUTCHours() === hour;
  });
};

const getEventStyle = (appt) => {
  // Dynamic styling based on status or barber
  return {};
};

const nextWeek = () => {
  currentDate.value = addDays(currentDate.value, 7);
  fetchAppointments(); // Re-fetch for new range if needed? Current fetchAll gets all. Ideally fetch by range.
};

const prevWeek = () => {
  currentDate.value = addDays(currentDate.value, -7);
  fetchAppointments();
};

const eventsByDay = computed(() => {
  const map = {};
  if (!appointments.value) return map;

  appointments.value.forEach((appt) => {
    const d = new Date(appt.date);
    const day = d.getDate();
    // Simple month view logic (can be refined)
    if (
      d.getMonth() === currentDate.value.getMonth() &&
      d.getFullYear() === currentDate.value.getFullYear()
    ) {
      if (!map[day]) map[day] = [];
      map[day].push({
        time: format(d, "HH:mm"),
        client: appt.user?.name || appt.clientName || "Cliente",
        barber: appt.barber?.name,
        service: appt.notes || "Servicio",
      });
    }
  });
  return map;
});

const agendaAppointments = computed(() => {
  if (!appointments.value) return [];
  return appointments.value.filter((appt) => {
    const apptDate = new Date(appt.date);
    return (
      apptDate.getUTCDate() === selectedDay.value.getDate() &&
      apptDate.getUTCMonth() === selectedDay.value.getMonth() &&
      apptDate.getUTCFullYear() === selectedDay.value.getFullYear()
    );
  });
});

const dailyOccupancy = computed(() => {
  // Simple calculation: appointments duration / open hours
  if (!agendaAppointments.value.length) return 0;
  // Assume 10 slots per day per barber approx for demo
  return Math.min(
    Math.round((agendaAppointments.value.length / 20) * 100),
    100,
  );
});

const monthDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const monthIndex = currentDate.value.getMonth();
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const daysInMonth = last.getDate();

  const jsDay = first.getDay();
  const offset = (jsDay + 6) % 7;

  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const today = new Date();
  const isThisMonth =
    today.getFullYear() === year && today.getMonth() === monthIndex;

  const result = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - offset + 1;
    const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
    const label = isCurrentMonth ? String(dayNum) : "";

    result.push({
      key: `${year}-${monthIndex}-${i}`,
      label,
      isCurrentMonth,
      dayNumber: isCurrentMonth ? dayNum : null,
      isToday:
        isThisMonth &&
        isCurrentMonth &&
        today.getDate() === dayNum &&
        isCurrentMonth, // check again to be safe
    });
  }
  return result;
});

const weekRangeLabel = computed(() => {
  const start = format(weekStart.value, "d 'de' MMMM", { locale: es });
  const end = format(weekEnd.value, "d 'de' MMMM, yyyy", { locale: es });
  return `Semana del ${start} al ${end}`;
});

const currentMonthLabel = computed(() => {
  return format(currentDate.value, "MMMM yyyy", { locale: es });
});

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  );
};

useHead({
  title: "Gestión de Citas - Admin Barber Sosa",
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

.metallic-gradient {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
}

.gold-border-glow {
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.15);
}

:deep(::-webkit-scrollbar) {
  width: 8px;
}

:deep(::-webkit-scrollbar-track) {
  background: #1a1a1a;
}

:deep(::-webkit-scrollbar-thumb) {
  background: #343434;
  border-radius: 4px;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: #d4af37;
}
</style>

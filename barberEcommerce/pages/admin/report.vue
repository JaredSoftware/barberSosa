<template>
  <div class="report-root min-h-screen bg-background-deep text-white">
    <div
      class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden"
    >
      <div class="layout-container flex h-full grow flex-col">
        <main class="px-6 md:px-20 lg:px-40 flex flex-1 justify-center py-10">
          <div
            class="layout-content-container flex flex-col max-w-[1200px] flex-1"
          >
            <div class="mb-12">
              <h2
                class="text-white text-4xl font-black leading-tight tracking-tighter uppercase"
              >
                Reporte Financiero
              </h2>
              <div class="h-1 w-20 bg-primary mt-2"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div
                class="flex flex-col gap-4 rounded-2xl p-8 bg-black border border-white/5 shadow-2xl relative overflow-hidden group"
              >
                <div class="absolute top-0 right-0 p-4 opacity-10">
                  <span class="material-symbols-outlined text-6xl">today</span>
                </div>
                <p
                  class="text-primary font-bold tracking-[0.2em] uppercase text-xs"
                >
                  Ganancia Hoy
                </p>
                <p
                  class="gold-gradient-text text-6xl font-black tracking-tighter"
                >
                  {{ formatCurrency(stats.totalDay) }}
                </p>
              </div>

              <div
                class="flex flex-col gap-4 rounded-2xl p-8 bg-black border border-white/5 shadow-2xl relative overflow-hidden"
              >
                <div class="absolute top-0 right-0 p-4 opacity-10">
                  <span class="material-symbols-outlined text-6xl"
                    >calendar_month</span
                  >
                </div>
                <p
                  class="text-primary font-bold tracking-[0.2em] uppercase text-xs"
                >
                  Ganancia Mes
                </p>
                <p
                  class="gold-gradient-text text-6xl font-black tracking-tighter"
                >
                  {{ formatCurrency(stats.totalMonth) }}
                </p>
              </div>

              <div
                class="flex flex-col gap-4 rounded-2xl p-8 bg-black border border-white/5 shadow-2xl relative overflow-hidden"
              >
                <div class="absolute top-0 right-0 p-4 opacity-10">
                  <span class="material-symbols-outlined text-6xl"
                    >account_balance</span
                  >
                </div>
                <p
                  class="text-primary font-bold tracking-[0.2em] uppercase text-xs"
                >
                  Ganancia Año
                </p>
                <p
                  class="gold-gradient-text text-6xl font-black tracking-tighter"
                >
                  {{ formatCurrency(stats.totalYear) }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-6">
              <div class="flex items-center justify-between">
                <h3
                  class="text-white text-2xl font-bold tracking-tight uppercase"
                >
                  Producción por Barbero
                </h3>
                <span
                  class="text-white/40 text-xs font-medium uppercase tracking-widest italic"
                >
                  Datos actualizados en tiempo real
                </span>
              </div>

              <div
                class="overflow-hidden rounded-xl border border-white/10 bg-[#141414] shadow-2xl"
              >
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr
                      class="bg-white/[0.03] text-primary/70 text-[10px] font-black uppercase tracking-[0.15em]"
                    >
                      <th class="px-8 py-5 border-b border-white/5">
                        Nombre del Barbero
                      </th>
                      <th class="px-8 py-5 border-b border-white/5 text-right">
                        Producción Día
                      </th>
                      <th class="px-8 py-5 border-b border-white/5 text-right">
                        Producción Mes
                      </th>
                      <th class="px-8 py-5 border-b border-white/5 text-right">
                        Producción Año
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-sm divide-y divide-white/5">
                    <tr
                      v-for="barber in stats.barbers"
                      :key="barber.barberId"
                      class="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td class="px-8 py-5">
                        <div class="flex items-center gap-3">
                          <div
                            class="size-8 rounded-full bg-[#493f22] flex items-center justify-center text-[10px] font-bold text-primary"
                          >
                            {{ barber.initials }}
                          </div>
                          <span class="text-white font-bold text-base">{{
                            barber.name
                          }}</span>
                        </div>
                      </td>
                      <td class="px-8 py-5 text-right text-white font-medium">
                        {{ formatCurrency(barber.dayRevenue) }}
                      </td>
                      <td class="px-8 py-5 text-right text-white font-medium">
                        {{ formatCurrency(barber.monthRevenue) }}
                      </td>
                      <td
                        class="px-8 py-5 text-right text-primary font-black text-base"
                      >
                        {{ formatCurrency(barber.yearRevenue) }}
                      </td>
                    </tr>
                    <tr v-if="stats.barbers && stats.barbers.length === 0">
                      <td
                        colspan="4"
                        class="px-8 py-5 text-center text-white/40 italic"
                      >
                        No hay datos de barberos disponibles.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        <footer
          class="px-10 py-10 border-t border-white/5 bg-black text-center"
        >
          <p
            class="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            © 2024 BARBER SOSA • EXCLUSIVA GESTIÓN FINANCIERA DE ALTO NIVEL
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

useHead({
  title: "Reporte Financiero y Producción - Barber Sosa",
});

const config = useRuntimeConfig();
const { formatCurrency } = useCurrency();

const stats = ref({
  totalDay: 0,
  totalMonth: 0,
  totalYear: 0,
  barbers: [],
});

const fetchStats = async () => {
  try {
    const { data } = await useFetch(
      `${config.public.apiBase}/api/appointments/stats/revenue`,
    );
    if (data.value) {
      // Ensure barbers is an array
      stats.value = {
        totalDay: data.value.totalDay || 0,
        totalMonth: data.value.totalMonth || 0,
        totalYear: data.value.totalYear || 0,
        barbers: Array.isArray(data.value.barbers) ? data.value.barbers : [],
      };
    }
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
  }
};

onMounted(() => {
  fetchStats();
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

.gold-gradient-text {
  background: linear-gradient(to bottom, #f2b90d 0%, #a67c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

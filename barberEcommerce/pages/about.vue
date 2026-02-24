<template>
  <div class="dark bg-background-dark font-display text-white selection:bg-primary selection:text-black">
    <div class="relative min-h-screen w-full flex flex-col overflow-x-hidden">
      <!-- Hero Section -->
      <section class="w-full flex justify-center pt-8 sm:pt-12 pb-12 sm:pb-16">
        <div class="w-full max-w-[1200px] px-4 sm:px-6">
          <div class="relative min-h-[300px] sm:min-h-[400px] md:min-h-[450px] flex flex-col gap-4 sm:gap-6 bg-cover bg-center rounded-xl items-center justify-center p-6 sm:p-8 text-center metallic-border overflow-hidden" style='background-image: linear-gradient(rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOXou33mLM60Q_dzPRIJdUOjILnWk5wmS7AoMz69Vj_WKkvaJJ5JPk7Ms_RNl0xHQ4sl7UO6B7M0BRhBD6eoTQUYHdgLm4sC3H4u-Lt4geYmq2gd36bli4uo51CKTtAYIkAC521zAlWHyE0K6TYJ8zIFYd1Q3usudEd9TZPAPd9lnSHu1NEWZPtQ_fe62Ikp6jn56gca-1TuWcCDGZhw_RsgPOgpSG8TW-dWdHEuLLdOGycQ1dlXtAqSZ6ODlJxEbNuiRdEO-B_FE");'>
            <div class="z-10 flex flex-col items-center">
              <div class="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 rounded-full bg-black/40 border border-primary/20">
                <img src="/logo_barber.png" alt="Sosa Estilo Real Logo" class="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain" />
              </div>
              <h1 class="gold-gradient-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold leading-tight tracking-tighter mb-3 sm:mb-4 px-4">
                {{ t("about.heroTitle") }}
              </h1>
              <h2 class="text-white/80 text-base sm:text-lg md:text-xl lg:text-2xl font-light italic max-w-2xl mx-auto tracking-wide px-4">
                {{ t("about.heroSubtitle") }}
              </h2>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          </div>
        </div>
      </section>

      <!-- Legacy Section -->
      <section class="w-full flex justify-center py-12 sm:py-16 md:py-20 bg-block-gray border-y border-metallic-gray">
        <div class="w-full max-w-[960px] px-4 sm:px-6 text-center">
          <h2 class="gold-gradient-text text-3xl sm:text-4xl md:text-5xl font-bold leading-tight pb-6 sm:pb-8 uppercase tracking-widest">
            {{ t("about.legacyTitle") }}
          </h2>
          <div class="space-y-6 sm:space-y-8">
            <p class="text-white text-lg sm:text-xl md:text-2xl font-light leading-relaxed px-2">
              {{ t("about.legacyParagraph1") }}
            </p>
            <div class="h-px w-20 sm:w-24 bg-primary/30 mx-auto"></div>
            <p class="text-white/80 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto px-2">
              {{ t("about.legacyParagraph2") }}
            </p>
          </div>
        </div>
      </section>

      <!-- Quote Section -->
      <section class="w-full flex justify-center py-16 sm:py-24 md:py-32 bg-black relative">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#f4c025 0.5px, transparent 0.5px); background-size: 20px 20px;"></div>
        <div class="max-w-[800px] px-4 sm:px-6 text-center relative z-10">
          <span class="material-symbols-outlined text-primary/30 text-5xl sm:text-6xl md:text-8xl absolute -top-8 sm:-top-10 md:-top-12 -left-4 sm:-left-6 md:-left-8 select-none" style="font-variation-settings: 'FILL' 1">format_quote</span>
          <blockquote class="text-white italic text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-snug px-4">
            "{{ t("about.quote") }}"
          </blockquote>
          <cite class="block mt-6 sm:mt-8 text-primary font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">— {{ t("about.quoteSource") }} —</cite>
        </div>
      </section>

      <!-- Masters Section (barbers from DB) -->
      <section class="w-full flex flex-col items-center py-12 sm:py-16 md:py-24 bg-block-gray border-t border-metallic-gray">
        <div class="w-full max-w-[1200px] px-4 sm:px-6 text-center mb-8 sm:mb-12 md:mb-16">
          <h2 class="gold-gradient-text text-3xl sm:text-4xl font-bold uppercase tracking-widest">
            {{ t("about.mastersTitle") }}
          </h2>
          <div class="h-0.5 w-24 sm:w-32 bg-primary mx-auto mt-4 sm:mt-6"></div>
        </div>
        <div v-if="barbersLoading" class="flex justify-center py-12">
          <p class="text-white/60">{{ t("about.loadingBarbers") }}</p>
        </div>
        <div v-else-if="!barbersList.length" class="text-center py-12 text-white/50 max-w-[1200px] px-4">
          <p>{{ t("about.noBarbers") }}</p>
        </div>
        <div v-else class="w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
          <div
            v-for="barber in barbersList"
            :key="barber._id"
            class="flex flex-col items-center group"
          >
            <div class="relative">
              <div class="size-52 rounded-full border-2 border-primary/20 p-1.5 group-hover:border-primary transition-all duration-700 overflow-hidden mb-8">
                <img
                  v-if="barberImage(barber)"
                  class="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500 scale-105"
                  :alt="barberName(barber)"
                  :src="barberImage(barber)"
                />
                <span
                  v-else
                  class="flex w-full h-full items-center justify-center text-white/30 text-5xl rounded-full bg-black/40"
                >
                  <span class="material-symbols-outlined">person</span>
                </span>
              </div>
            </div>
            <h3 class="text-white text-2xl font-bold mb-2 tracking-wide">
              {{ barberName(barber) }}
            </h3>
            <p v-if="barber.rol" class="text-primary text-sm font-bold uppercase tracking-[0.2em]">
              {{ barber.rol }}
            </p>
          </div>
        </div>
      </section>

      <!-- Values Section -->
      <section class="w-full flex justify-center py-12 sm:py-16 md:py-24 bg-black border-t border-metallic-gray">
        <div class="w-full max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <!-- Value 1 -->
            <div class="bg-block-gray p-6 sm:p-8 md:p-10 rounded-lg metallic-border hover:border-primary/50 transition-all duration-500 text-center group">
              <span class="material-symbols-outlined text-primary text-5xl sm:text-6xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">history_edu</span>
              <h4 class="gold-gradient-text text-xl font-bold mb-4 uppercase tracking-widest">
                {{ t("about.valuesTraditionTitle") }}
              </h4>
              <p class="text-white/70 text-base leading-relaxed">
                {{ t("about.valuesTraditionBody") }}
              </p>
            </div>

            <!-- Value 2 -->
            <div class="bg-block-gray p-10 rounded-lg metallic-border hover:border-primary/50 transition-all duration-500 text-center group">
              <span class="material-symbols-outlined text-primary text-6xl mb-6 group-hover:scale-110 transition-transform">diamond</span>
              <h4 class="gold-gradient-text text-xl font-bold mb-4 uppercase tracking-widest">
                {{ t("about.valuesStyleTitle") }}
              </h4>
              <p class="text-white/70 text-base leading-relaxed">
                {{ t("about.valuesStyleBody") }}
              </p>
            </div>

            <!-- Value 3 -->
            <div class="bg-block-gray p-10 rounded-lg metallic-border hover:border-primary/50 transition-all duration-500 text-center group">
              <span class="material-symbols-outlined text-primary text-6xl mb-6 group-hover:scale-110 transition-transform">verified</span>
              <h4 class="gold-gradient-text text-xl font-bold mb-4 uppercase tracking-widest">
                {{ t("about.valuesQualityTitle") }}
              </h4>
              <p class="text-white/70 text-base leading-relaxed">
                {{ t("about.valuesQualityBody") }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="w-full flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 bg-black border-t border-metallic-gray">
        <div class="flex items-center gap-4 mb-10">
          <img src="/logo_barber.png" alt="Barber Sosa Logo" class="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
          <span class="gold-gradient-text font-bold uppercase tracking-[0.3em] text-xl sm:text-2xl">Barber Sosa</span>
        </div>
        <div class="flex gap-10 mb-10">
          <a class="text-white/40 hover:text-primary transition-colors transform hover:scale-125" href="#">
            <span class="material-symbols-outlined text-3xl">public</span>
          </a>
          <a class="text-white/40 hover:text-primary transition-colors transform hover:scale-125" href="#">
            <span class="material-symbols-outlined text-3xl">camera_alt</span>
          </a>
          <a class="text-white/40 hover:text-primary transition-colors transform hover:scale-125" href="#">
            <span class="material-symbols-outlined text-3xl">mail</span>
          </a>
        </div>
        <div class="w-24 h-px bg-metallic-gray mb-8"></div>
        <p class="text-white/40 text-xs tracking-[0.4em] uppercase">
          {{ t("about.footerCopyright") }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const { barbers, loading: barbersLoading, fetchBarbers } = useBarbers();

const barbersList = computed(() => barbers.value || []);

function barberName(b) {
  return b?.nombreArtista || b?.name || b?.email || t('about.barberFallback');
}
function barberImage(b) {
  const url = b?.imagen || b?.picture;
  return url && url.trim() ? url : null;
}

onMounted(() => {
  fetchBarbers(true);
});

useHead({
  title: t('about.headTitle'),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap' }
  ],
});
</script>

<style>
        :root {
            --primary-gold: #f4c025;
            --deep-black: #050505;
        }

        .gold-gradient-text {
            background: linear-gradient(135deg, #f4c025 0%, #d4a017 50%, #f4c025 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 1px rgba(244, 192, 37, 0.3));
        }

        .metallic-border {
            border: 1px solid #333333;
        }

        .gold-border {
            border: 1px solid #f4c025;
        }

body {
  font-family: "Newsreader", serif;
  background-color: #0a0a0a;
}
    </style>

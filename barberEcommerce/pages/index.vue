<template>
  <div class="layout-container flex h-full grow flex-col">

        <!-- Hero Section -->
        <div class="px-4 sm:px-6 md:px-20 flex justify-center pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-16 md:pb-20">
          <div class="layout-content-container flex flex-col max-w-[1400px] flex-1">
            <div class="@container">
              <div class="flex min-h-[400px] sm:min-h-[550px] md:min-h-[650px] lg:min-h-[750px] flex-col gap-6 sm:gap-8 md:gap-10 bg-cover bg-center bg-no-repeat rounded-sm items-center justify-center p-6 sm:p-8 text-center border border-primary/10 relative overflow-hidden hero-background">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0a_100%)]"></div>
                <div class="flex flex-col gap-4 sm:gap-6 max-w-4xl relative z-10 px-4">
                  <div class="flex items-center justify-center gap-2 sm:gap-4">
                    <div class="h-[1px] w-8 sm:w-12 bg-primary/50"></div>
                    <span class="text-primary font-bold tracking-[0.3em] sm:tracking-[0.5em] uppercase text-[10px] sm:text-xs">{{ $t('home.since') }}</span>
                    <div class="h-[1px] w-8 sm:w-12 bg-primary/50"></div>
                  </div>
                  <h1 class="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black leading-[1.1] tracking-tight">
                    {{ $t('home.title') }}
                  </h1>
                  <h2 class="text-gray-400 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
                    {{ $t('home.subtitle') }}
                  </h2>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8 relative z-10 w-full sm:w-auto px-4">
                  <NuxtLink to="/reservas" class="flex w-full sm:min-w-[200px] md:min-w-[240px] cursor-pointer items-center justify-center rounded-sm h-14 sm:h-16 px-6 sm:px-8 md:px-10 bg-gold-gradient text-background-deep text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:scale-105 transition-transform shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                    {{ $t('home.reserveChair') }}
                  </NuxtLink>
                  <NuxtLink to="/catalogo" class="flex w-full sm:min-w-[200px] md:min-w-[240px] cursor-pointer items-center justify-center rounded-sm h-14 sm:h-16 px-6 sm:px-8 md:px-10 bg-white/5 backdrop-blur-md border border-primary/30 text-primary text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-primary/10 transition-all">
                    {{ $t('home.curatedShop') }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Services Section -->
        <div class="px-4 sm:px-6 md:px-20 flex justify-center mt-8 sm:mt-10 md:mt-12" id="services">
          <div class="layout-content-container flex flex-col max-w-[1400px] flex-1">
            <div class="flex flex-col items-center text-center px-2 sm:px-4 pb-8 sm:pb-10 md:pb-12">
              <div class="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div class="w-6 sm:w-8 h-[2px] bg-primary"></div>
                <span class="text-primary uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs font-bold">{{ $t('home.eliteServices') }}</span>
                <div class="w-6 sm:w-8 h-[2px] bg-primary"></div>
              </div>
              <h2 class="text-white text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-wide">{{ $t('home.premiumOfferings') }}</h2>
            </div>
          </div>
        </div>

        <div class="px-4 sm:px-6 md:px-20 flex justify-center pb-8 sm:pb-10 md:pb-12">
          <div class="layout-content-container flex flex-col max-w-[1400px] flex-1">
            <!-- Loading state -->
            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 p-2 sm:p-4">
              <div v-for="i in 3" :key="i" class="flex flex-1 gap-6 rounded-sm border border-primary/10 bg-charcoal p-10 flex-col animate-pulse">
                <div class="h-16 w-16 bg-primary/10 rounded"></div>
                <div class="h-6 bg-white/10 rounded w-3/4"></div>
                <div class="h-4 bg-white/5 rounded w-full"></div>
                <div class="h-4 bg-white/5 rounded w-2/3"></div>
              </div>
            </div>
            
            <!-- Offers from API: solo premium (premium === true) -->
            <div v-else-if="(offers || []).filter(o => o.premium === true).length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 p-2 sm:p-4">
              <div 
                v-for="(offer, idx) in (offers || []).filter(o => o.premium === true)" 
                :key="offer._id"
                class="flex flex-1 gap-4 sm:gap-6 rounded-sm border border-primary/10 bg-charcoal p-6 sm:p-8 md:p-10 flex-col hover:border-primary/40 transition-all group relative overflow-hidden"
                :class="{ 'border-primary/40 ring-1 ring-primary/20': idx === 1 }"
              >
                <div class="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-primary/5 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 transition-transform group-hover:scale-150"></div>
                <div class="group-hover:scale-110 transition-transform">
                  <img 
                    v-if="offer.image" 
                    :src="offer.image" 
                    :alt="offer.title" 
                    class="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain" 
                  />
                  <span 
                    v-else-if="offer.icon" 
                    class="material-symbols-outlined text-primary !text-5xl font-light"
                  >{{ offer.icon }}</span>
                  <img 
                    v-else 
                    src="/logo_barber.png" 
                    :alt="offer.title" 
                    class="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain" 
                  />
                </div>
                <div class="flex flex-col gap-3 sm:gap-4 relative z-10">
                  <h2 class="text-white text-xl sm:text-2xl font-display font-bold uppercase tracking-widest">{{ offer.title }}</h2>
                  <p class="text-gray-400 text-xs sm:text-sm leading-relaxed font-light">{{ offer.description }}</p>
                  <div v-if="offer.features && offer.features.length > 0" class="mt-2">
                    <ul class="text-gray-500 text-[10px] sm:text-xs space-y-1">
                      <li v-for="feature in offer.features" :key="feature" class="flex items-center gap-2">
                        <span class="text-primary">•</span>
                        <span>{{ feature }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="flex items-baseline gap-2 mt-3 sm:mt-4">
                    <span class="text-primary font-bold text-xl sm:text-2xl">${{ offer.price }}</span>
                    <span class="text-gray-600 text-[10px] sm:text-xs uppercase tracking-widest">{{ offer.duration }} {{ $t('services.minutes') }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty state (sin ofertas premium o sin ofertas) -->
            <div v-else class="text-center py-12">
              <p class="text-gray-500 text-sm">{{ $t('home.noOffers') || 'No hay ofertas premium disponibles' }}</p>
            </div>
          </div>
        </div>

        <!-- Shop Section -->
        <div class="px-4 sm:px-6 md:px-20 flex justify-center mt-12 sm:mt-16 md:mt-24" id="shop">
          <div class="layout-content-container flex flex-col max-w-[1400px] flex-1">
            <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 px-2 sm:px-4 pb-8 sm:pb-10 md:pb-12 border-b border-primary/10">
              <div>
                <h2 class="text-white text-3xl sm:text-4xl font-display font-bold uppercase tracking-widest">The Gold Standard</h2>
                <p class="text-gray-500 mt-2 font-light uppercase tracking-[0.2em] text-[10px] sm:text-xs">Exclusively curated grooming essentials</p>
              </div>
              <NuxtLink to="/catalogo" class="text-primary font-bold uppercase text-[10px] tracking-[0.3em] sm:tracking-[0.4em] border-b border-primary/50 pb-2 hover:border-primary transition-all flex items-center gap-2 self-start sm:self-end">
                Collection <span class="material-symbols-outlined !text-sm">trending_flat</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="px-4 sm:px-6 md:px-20 flex justify-center pb-12 sm:pb-16 md:pb-24 pt-8 sm:pt-10 md:pt-12">
          <div class="layout-content-container flex flex-col max-w-[1400px] flex-1">
            <!-- Loading state -->
            <div v-if="productsLoading" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 p-2 sm:p-4">
              <div v-for="i in 4" :key="i" class="flex flex-col gap-5 animate-pulse">
                <div class="aspect-[4/5] w-full rounded-sm bg-charcoal/50 border border-primary/5"></div>
                <div class="text-center space-y-2">
                  <div class="h-4 bg-white/10 rounded mx-auto w-3/4"></div>
                  <div class="h-5 bg-primary/10 rounded mx-auto w-1/2"></div>
                </div>
              </div>
            </div>

            <!-- Products from API -->
            <div v-else-if="featuredProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 p-2 sm:p-4">
              <NuxtLink 
                v-for="product in featuredProducts" 
                :key="product._id"
                to="/catalogo"
                class="flex flex-col gap-5 group"
              >
                <div class="aspect-[4/5] w-full rounded-sm overflow-hidden bg-charcoal border border-primary/5 relative">
                  <img 
                    :alt="product.name" 
                    class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" 
                    :src="product.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 500\'%3E%3Crect fill=\'%23111\' width=\'400\' height=\'500\'/%3E%3Ctext fill=\'%23444\' x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'16\'%3E' + encodeURIComponent(product.name) + '%3C/text%3E%3C/svg%3E'" 
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-background-deep via-transparent to-transparent opacity-60"></div>
                  <button class="absolute bottom-6 left-6 right-6 bg-gold-gradient text-background-deep py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Add to Collection
                  </button>
                </div>
                <div class="text-center">
                  <h3 class="text-gray-200 font-display text-sm tracking-widest uppercase mb-1">{{ product.name }}</h3>
                  <p class="text-primary font-bold text-lg">${{ Number(product.price).toFixed(2) }}</p>
                </div>
              </NuxtLink>
            </div>

            <!-- Empty state -->
            <div v-else class="text-center py-12 text-gray-500">
              <p class="text-sm">No hay productos destacados disponibles</p>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="px-4 sm:px-6 md:px-20 flex justify-center pb-12 sm:pb-16 md:pb-24">
          <div class="layout-content-container flex flex-col max-w-[1400px] flex-1">
            <div class="rounded-sm bg-charcoal p-6 sm:p-8 md:p-12 lg:p-24 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 overflow-hidden relative border border-primary/20">
              <div class="absolute inset-0 charcoal-grain pointer-events-none opacity-10"></div>
              <div class="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/5 blur-[120px]"></div>
                <div class="z-10 flex flex-col gap-3 sm:gap-4 text-center md:text-left max-w-xl">
                  <h2 class="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold uppercase tracking-wide leading-tight">{{ $t('home.joinInnerCircle') }}</h2>
                  <p class="text-gray-400 text-sm sm:text-base md:text-lg font-light tracking-wide">{{ $t('home.joinDescription') }}</p>
                </div>
                <div class="z-10 flex flex-col items-center gap-3 sm:gap-4 w-full md:w-auto">
                  <NuxtLink to="/reservas" class="flex w-full md:min-w-[240px] lg:min-w-[280px] cursor-pointer items-center justify-center rounded-sm h-14 sm:h-16 px-6 sm:px-8 md:px-10 bg-gold-gradient text-background-deep text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:brightness-110 transition-all shadow-xl">
                    {{ $t('home.bookAppointment') }}
                  </NuxtLink>
                  <span class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.3em] sm:tracking-[0.4em]">{{ $t('home.limitedAvailability') }}</span>
                </div>
            </div>
          </div>
        </div>

  </div>
</template>

<script setup>
const { t } = useI18n();

// Exponer $t para usar en template
const $t = t;

// Cargar ofertas premium desde la API (público - no requiere autenticación)
const { offers, loading, fetchOffers } = useOffers();

// Cargar productos desde la API
const { products, loading: productsLoading, fetchProducts } = useProducts();

// Mostrar solo los primeros 4 productos en la home
const featuredProducts = computed(() => {
  return (products.value || []).slice(0, 4);
});

// Cargar ofertas y productos al montar el componente
onMounted(async () => {
  await Promise.all([
    fetchOffers(true), // Solo ofertas activas
    fetchProducts(true) // Solo productos activos
  ]);
});

useHead({
  title: 'Sosa Barber | Premium Grooming',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
});
</script>

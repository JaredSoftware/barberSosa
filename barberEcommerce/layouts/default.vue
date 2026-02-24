<template>
  <div class="dark text-gray-300 antialiased overflow-x-hidden">
    <div class="fixed inset-0 charcoal-grain pointer-events-none z-0"></div>
    <div class="relative flex w-full flex-col z-10">
      <!-- Header Navigation -->
      <div class="px-4 sm:px-6 md:px-20 flex justify-center py-2 bg-background-deep/90 backdrop-blur-xl sticky top-0 z-50 border-b border-primary/20">
        <div class="layout-content-container flex flex-col max-w-[1400px] flex-1">
          <header class="flex items-center justify-between whitespace-nowrap px-2 sm:px-4 py-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <img src="/logo_barber.png" alt="Sosa Barber Logo" class="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" />
                <span class="text-white text-lg sm:text-xl md:text-2xl font-display font-black leading-tight tracking-[0.2em] uppercase">
                  Sosa Barber
                </span>
              </NuxtLink>
            </div>
            <div class="flex flex-1 justify-end gap-4 sm:gap-6 md:gap-10 items-center">
              <!-- Desktop Navigation -->
              <nav class="hidden lg:flex items-center gap-8 xl:gap-10">
                <NuxtLink to="/" class="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-[0.2em] transition-all">
                  {{ $t('nav.home') }}
                </NuxtLink>
                <NuxtLink to="/catalogo" class="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-[0.2em] transition-all">
                  {{ $t('nav.shop') }}
                </NuxtLink>
                <NuxtLink to="/reservas" class="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-[0.2em] transition-all">
                  {{ $t('nav.reservations') }}
                </NuxtLink>
                <NuxtLink to="/about" class="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-[0.2em] transition-all">
                  {{ $t('nav.about') }}
                </NuxtLink>
                <NuxtLink to="/politicas" class="text-gray-400 hover:text-primary text-xs font-bold uppercase tracking-[0.2em] transition-all">
                  {{ $t('nav.policies') }}
                </NuxtLink>
              </nav>
              <div class="flex gap-2 sm:gap-4 items-center">
                <!-- Language Switcher - Hidden on mobile -->
                <div class="hidden sm:flex items-center gap-2 border border-primary/30 rounded-sm overflow-hidden">
                  <button 
                    @click="switchLocale('es')"
                    :class="[
                      'px-2 sm:px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all',
                      locale === 'es' 
                        ? 'bg-primary text-background-deep' 
                        : 'text-gray-400 hover:text-primary'
                    ]"
                  >
                    ES
                  </button>
                  <button 
                    @click="switchLocale('en')"
                    :class="[
                      'px-2 sm:px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all',
                      locale === 'en' 
                        ? 'bg-primary text-background-deep' 
                        : 'text-gray-400 hover:text-primary'
                    ]"
                  >
                    EN
                  </button>
                </div>
                <!-- Book Now Button - Responsive -->
                <NuxtLink to="/reservas" class="hidden sm:flex min-w-[100px] md:min-w-[120px] cursor-pointer items-center justify-center rounded-sm h-9 md:h-11 px-4 md:px-6 bg-gold-gradient text-background-deep text-[10px] md:text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  {{ $t('nav.bookNow') }}
                </NuxtLink>
                <!-- Carrito: abre el drawer -->
                <button
                  type="button"
                  class="hidden md:flex items-center justify-center rounded-sm h-9 md:h-11 w-9 md:w-11 border border-primary/30 text-primary hover:bg-primary/10 transition-all relative"
                  :aria-label="$t('cart.viewCart')"
                  @click="openCartDrawer"
                >
                  <span class="material-symbols-outlined !text-lg md:!text-xl">shopping_cart</span>
                  <span 
                    v-if="totalItems > 0" 
                    class="absolute -top-1 -right-1 bg-gold text-background-deep text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {{ totalItems > 9 ? '9+' : totalItems }}
                  </span>
                </button>
                <!-- Mobile Menu Button -->
                <button 
                  @click="mobileMenuOpen = !mobileMenuOpen"
                  class="lg:hidden flex items-center justify-center rounded-sm h-9 w-9 border border-primary/30 text-primary hover:bg-primary/10 transition-all"
                  aria-label="Toggle menu"
                >
                  <span class="material-symbols-outlined !text-xl">
                    {{ mobileMenuOpen ? 'close' : 'menu' }}
                  </span>
                </button>
              </div>
            </div>
          </header>
          <!-- Mobile Menu -->
          <div 
            v-if="mobileMenuOpen"
            class="lg:hidden border-t border-primary/20 bg-background-deep/95 backdrop-blur-xl"
          >
            <nav class="flex flex-col py-4 px-4 gap-4">
              <NuxtLink 
                to="/" 
                @click="mobileMenuOpen = false"
                class="text-gray-400 hover:text-primary text-sm font-bold uppercase tracking-[0.2em] transition-all py-2"
              >
                {{ $t('nav.home') }}
              </NuxtLink>
              <NuxtLink 
                to="/catalogo" 
                @click="mobileMenuOpen = false"
                class="text-gray-400 hover:text-primary text-sm font-bold uppercase tracking-[0.2em] transition-all py-2"
              >
                {{ $t('nav.shop') }}
              </NuxtLink>
              <NuxtLink 
                to="/reservas" 
                @click="mobileMenuOpen = false"
                class="text-gray-400 hover:text-primary text-sm font-bold uppercase tracking-[0.2em] transition-all py-2"
              >
                {{ $t('nav.reservations') }}
              </NuxtLink>
              <NuxtLink 
                to="/about" 
                @click="mobileMenuOpen = false"
                class="text-gray-400 hover:text-primary text-sm font-bold uppercase tracking-[0.2em] transition-all py-2"
              >
                {{ $t('nav.about') }}
              </NuxtLink>
              <NuxtLink 
                to="/politicas" 
                @click="mobileMenuOpen = false"
                class="text-gray-400 hover:text-primary text-sm font-bold uppercase tracking-[0.2em] transition-all py-2"
              >
                {{ $t('nav.policies') }}
              </NuxtLink>
              <button
                type="button"
                @click="mobileMenuOpen = false; openCartDrawer()"
                class="flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-bold uppercase tracking-[0.2em] transition-all py-2 text-left"
              >
                <span class="material-symbols-outlined text-lg">shopping_cart</span>
                {{ $t('cart.titleShort') }}
                <span v-if="totalItems > 0" class="bg-gold text-background-deep text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {{ totalItems }}
                </span>
              </button>
              <div class="flex items-center gap-2 pt-2 border-t border-primary/20">
                <button 
                  @click="switchLocale('es')"
                  :class="[
                    'px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all',
                    locale === 'es' 
                      ? 'bg-primary text-background-deep' 
                      : 'text-gray-400 hover:text-primary'
                  ]"
                >
                  ES
                </button>
                <button 
                  @click="switchLocale('en')"
                  :class="[
                    'px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all',
                    locale === 'en' 
                      ? 'bg-primary text-background-deep' 
                      : 'text-gray-400 hover:text-primary'
                  ]"
                >
                  EN
                </button>
              </div>
              <NuxtLink 
                to="/reservas" 
                @click="mobileMenuOpen = false"
                class="flex w-full cursor-pointer items-center justify-center rounded-sm h-11 px-6 bg-gold-gradient text-background-deep text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] mt-2"
              >
                {{ $t('nav.bookNow') }}
              </NuxtLink>
            </nav>
          </div>
        </div>
      </div>

      <!-- Drawer del carrito (visual lateral) -->
      <CartDrawer />

      <!-- Page Content -->
      <slot />

      <!-- Footer -->
      <footer class="bg-background-deep border-t border-primary/20 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-20 relative overflow-hidden">
        <div class="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 relative z-10">
          <div class="flex flex-col gap-8">
            <div class="flex items-center gap-4">
              <img src="/logo_barber.png" alt="Sosa Barber Logo" class="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
              <h2 class="text-white text-xl font-display font-black uppercase tracking-[0.2em]">Sosa Barber</h2>
            </div>
            <p class="text-gray-500 text-sm leading-relaxed font-light tracking-wide">
              {{ $t('footer.description') }}
            </p>
          </div>
          <div>
            <h4 class="text-primary font-bold uppercase mb-8 tracking-[0.3em] text-xs">{{ $t('footer.atelier') }}</h4>
            <p class="text-gray-400 text-sm leading-loose font-light tracking-widest">
              MAYFAIR DISTRICT<br/>
              102 SAVILE ROW<br/>
              LONDON, W1S 3PR
            </p>
          </div>
          <div>
            <h4 class="text-primary font-bold uppercase mb-8 tracking-[0.3em] text-xs">{{ $t('footer.availability') }}</h4>
            <ul class="text-gray-400 text-sm space-y-4 font-light tracking-widest">
              <li class="flex justify-between"><span>MON - FRI</span> <span class="text-gray-500">09:00 - 20:00</span></li>
              <li class="flex justify-between"><span>SATURDAY</span> <span class="text-gray-500">10:00 - 18:00</span></li>
              <li class="flex justify-between"><span>SUNDAY</span> <span class="text-primary/60 italic uppercase text-[10px]">By Invite Only</span></li>
            </ul>
          </div>
          <div>
            <h4 class="text-primary font-bold uppercase mb-8 tracking-[0.3em] text-xs">{{ $t('footer.newsletter') }}</h4>
            <div class="flex flex-col gap-4">
              <div class="relative">
                <input 
                  class="w-full bg-charcoal border-primary/20 text-white rounded-sm px-4 py-4 focus:ring-primary focus:border-primary placeholder-gray-600 text-xs tracking-widest uppercase" 
                  :placeholder="$t('footer.emailPlaceholder')" 
                  type="email" 
                />
              </div>
              <button class="bg-gold-gradient text-background-deep py-4 rounded-sm font-black uppercase text-[10px] tracking-[0.3em] hover:brightness-110 transition-all">
                {{ $t('footer.enroll') }}
              </button>
            </div>
          </div>
        </div>
        <div class="max-w-[1400px] mx-auto mt-20 pt-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <p class="text-gray-600 text-[10px] uppercase tracking-[0.3em]">{{ $t('footer.copyright') }}</p>
          <div class="flex gap-10 text-primary/60">
            <a class="hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined !text-xl">brand_awareness</span></a>
            <a class="hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined !text-xl">camera_outdoor</span></a>
            <a class="hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined !text-xl">public</span></a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
// Usar composable temporal hasta que se instale @nuxtjs/i18n
const { locale, t, setLocale } = useI18n();
const { totalItems, fetchCart } = useCart();

const mobileMenuOpen = ref(false);
const cartDrawerOpen = useState('cart_drawer_open', () => false);

function openCartDrawer() {
  cartDrawerOpen.value = true;
}

// Cargar el carrito en segundo plano sin bloquear la carga (silent = no mostrar loading)
onMounted(() => {
  fetchCart({ silent: true });
});

const switchLocale = (lang) => {
  setLocale(lang);
};

// Exponer t como $t para usar en template
const $t = t;
</script>

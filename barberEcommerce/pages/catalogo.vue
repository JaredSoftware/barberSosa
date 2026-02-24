<template>
  <div class="flex flex-1 justify-center py-8 sm:py-10 md:py-12 bg-deeper-gray">
    <div class="layout-content-container flex flex-col max-w-[1280px] w-full px-4 sm:px-6 lg:px-20">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 pb-8 text-[10px] font-bold uppercase tracking-[0.2em]">
              <NuxtLink to="/" class="text-gray-500 hover:text-gold transition-colors">{{ $t('nav.home') }}</NuxtLink>
              <span class="text-gray-700">/</span>
              <span class="text-gold">{{ $t('catalog.breadcrumb') }}</span>
            </div>

            <div class="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12">
              <!-- Sidebar -->
              <aside class="w-full lg:w-64 shrink-0">
                <div class="flex flex-col gap-6 sm:gap-8 md:gap-10 sticky top-24 sm:top-28 md:top-32">
                  <!-- Categories -->
                  <section>
                    <h3 class="text-gold font-display text-sm font-bold uppercase mb-6 tracking-widest">{{ $t('catalog.categories') }}</h3>
                    <div class="flex flex-col gap-1">
                      <div 
                        v-for="category in categories" 
                        :key="category.id"
                        @click="selectedCategory = category.id; currentPage = 1"
                        :class="[
                          'flex items-center justify-between px-4 py-3 cursor-pointer font-bold uppercase text-xs tracking-wider transition-all',
                          selectedCategory === category.id 
                            ? 'bg-gold/20 border-l-4 border-gold text-gold' 
                            : 'hover:bg-accent-gray text-gray-400 hover:text-gold border-l-4 border-transparent'
                        ]"
                      >
                        <div class="flex items-center gap-3">
                          <span class="material-symbols-outlined text-lg" :class="selectedCategory === category.id ? 'text-gold' : ''">{{ category.icon }}</span>
                          <span>{{ category.name }}</span>
                        </div>
                        <span class="text-[10px]" :class="selectedCategory === category.id ? 'text-gold' : 'text-gray-500'">{{ category.count }}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </aside>

              <!-- Products Grid -->
              <div class="flex-1">
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4 pb-4 sm:pb-6">
                  <div>
                    <h2 class="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-2">{{ $t('catalog.exquisiteCollection') }}</h2>
                    <h1 class="text-white text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-wide">{{ $t('catalog.careEssentials') }}</h1>
                  </div>
                  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span class="text-[10px] text-gray-500 uppercase font-black tracking-widest">{{ $t('catalog.sortBy') }}</span>
                    <select 
                      v-model="sortBy"
                      class="bg-dark-gray text-gold border border-gold/20 rounded-none text-xs font-bold uppercase py-2 pl-3 pr-10 focus:ring-1 focus:ring-gold appearance-none cursor-pointer w-full sm:w-auto"
                    >
                      <option value="popular">{{ $t('catalog.mostPopular') }}</option>
                      <option value="newest">{{ $t('catalog.newest') }}</option>
                      <option value="price-asc">{{ $t('catalog.priceAsc') }}</option>
                      <option value="price-desc">{{ $t('catalog.priceDesc') }}</option>
                    </select>
                  </div>
                </div>

                <div v-if="productsLoading" class="text-center py-12 text-gray-400">
                  {{ $t('catalog.loading') }}
                </div>
                <div v-else-if="paginatedProducts.length === 0" class="text-center py-12 text-gray-500">
                  {{ $t('catalog.empty') }}
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  <div 
                    v-for="product in paginatedProducts" 
                    :key="product._id"
                    class="product-card bg-dark-gray p-6 flex flex-col group"
                  >
                    <div class="h-72 w-full bg-accent-gray mb-6 relative overflow-hidden">
                      <img 
                        :alt="product.name" 
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0" 
                        :src="product.image || '/placeholder-product.png'" 
                        @error="($event.target).src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 400\'%3E%3Crect fill=\'%23333\' width=\'400\' height=\'400\'/%3E%3Ctext fill=\'%23666\' x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'18\'%3E' + encodeURIComponent($t('catalog.noImage')) + '%3C/text%3E%3C/svg%3E'"
                      />
                      <div 
                        v-if="product.badge"
                        :class="[
                          'absolute top-0 right-0 text-black text-[9px] font-black px-3 py-1 uppercase tracking-widest',
                          product.badge === 'Premium' ? 'bg-gold' : 'bg-accent-gray text-gold border-r border-b border-gold/20'
                        ]"
                      >
                        {{ product.badge }}
                      </div>
                    </div>
                    <div class="flex flex-col flex-1">
                      <p class="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">{{ product.category }}</p>
                      <h3 class="text-gold font-display text-xl font-bold uppercase mb-3 leading-tight group-hover:text-white transition-colors">
                        {{ product.name }}
                      </h3>
                      <p class="text-xs text-gray-500 mb-6 leading-relaxed font-light">{{ product.description }}</p>
                      <div class="mt-auto flex items-center justify-between pt-6 border-t border-gold/10">
                        <span class="text-white text-lg font-bold font-display">${{ Number(product.price).toFixed(2) }}</span>
                        <button 
                          @click.prevent="addToCart(product)"
                          :disabled="isAddDisabled(product)"
                          :class="[
                            'px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2',
                            (addState[product?.id ?? product?._id] === 'added')
                              ? 'bg-green-600 text-white'
                              : (addState[product?.id ?? product?._id] === 'error')
                                ? 'bg-red-900/80 text-white'
                                : 'bg-gold hover:bg-gold-dark text-black'
                          ]"
                        >
                          <span 
                            v-if="addState[product?.id ?? product?._id] === 'adding'" 
                            class="material-symbols-outlined text-sm animate-spin"
                          >
                            progress_activity
                          </span>
                          <span 
                            v-else-if="addState[product?.id ?? product?._id] === 'added'" 
                            class="material-symbols-outlined text-sm"
                          >
                            check
                          </span>
                          <span 
                            v-else 
                            class="material-symbols-outlined text-sm"
                          >
                            add_shopping_cart
                          </span>
                          {{ getAddButtonLabel(product) }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 mt-16">
                  <button 
                    @click="currentPage > 1 && currentPage--"
                    class="w-10 h-10 flex items-center justify-center border border-gold/20 hover:border-gold text-gold transition-colors"
                  >
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'w-10 h-10 flex items-center justify-center font-bold transition-colors',
                      currentPage === page 
                        ? 'bg-gold text-black' 
                        : 'border border-gold/20 hover:border-gold text-gold'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button 
                    @click="currentPage < totalPages && currentPage++"
                    class="w-10 h-10 flex items-center justify-center border border-gold/20 hover:border-gold text-gold transition-colors"
                  >
                    <span class="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const $t = t;

useHead({
  title: `Sosa Barber | ${$t('catalog.title')}`,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
});

const { products, loading: productsLoading, fetchProducts } = useProducts();
const { categories: apiCategories, fetchCategories } = useCategories();

const searchQuery = ref('');
const selectedCategory = ref(null);
const sortBy = ref('popular');
const currentPage = ref(1);
const itemsPerPage = 6;

const categories = computed(() => {
  const list = products.value || [];
  return (apiCategories.value || []).map((cat) => ({
    id: cat._id,
    name: cat.name,
    icon: cat.icon,
    count: list.filter((p) => p.category === cat.name).length
  }));
});

onMounted(async () => {
  await Promise.all([
    fetchProducts(true),
    fetchCategories(true)
  ]);
  // Seleccionar la primera categoría por defecto
  if (categories.value.length > 0 && !selectedCategory.value) {
    selectedCategory.value = categories.value[0].id;
  }
});

const filteredProducts = computed(() => {
  let filtered = [...(products.value || [])];
  
  // Filtrar por categoría seleccionada
  if (selectedCategory.value) {
    const selectedCat = categories.value.find(c => c.id === selectedCategory.value);
    if (selectedCat) {
      filtered = filtered.filter((p) => p.category === selectedCat.name);
    }
  }
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }
  
  // Ordenar
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-desc':
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      break;
    default:
      break;
  }
  return filtered;
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage));
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const { addToCart: addProductToCart, totalItems, fetchCart } = useCart();

// Estado por producto: 'idle' | 'adding' | 'added' | 'error'
const addState = ref({});

const cartDrawerOpen = useState('cart_drawer_open', () => false);

const addToCart = async (product) => {
  const productId = product?.id ?? product?._id;
  if (!productId) {
    console.error('Producto sin id:', product);
    return;
  }
  addState.value[productId] = 'adding';
  try {
    await addProductToCart(productId, 1);
    addState.value[productId] = 'added';
    setTimeout(() => { addState.value[productId] = 'idle'; }, 2000);
    // Abrir el drawer del carrito para que vea que se agregó
    cartDrawerOpen.value = true;
  } catch (error) {
    console.error('Error añadiendo al carrito:', error);
    addState.value[productId] = 'error';
    setTimeout(() => { addState.value[productId] = 'idle'; }, 3000);
  }
};

const getAddButtonLabel = (product) => {
  const productId = product?.id ?? product?._id;
  const state = addState.value[productId] || 'idle';
  if (state === 'adding') return $t('catalog.adding');
  if (state === 'added') return $t('catalog.added');
  if (state === 'error') return $t('catalog.error');
  return $t('catalog.addToCart');
};

const isAddDisabled = (product) => {
  const productId = product?.id ?? product?._id;
  return addState.value[productId] === 'adding';
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.gold-border {
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.gold-divider {
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.product-card {
  transition: all 0.3s;
  border: 1px solid transparent;
}

.product-card:hover {
  border-color: #D4AF37;
  transform: translateY(-4px);
}
</style>

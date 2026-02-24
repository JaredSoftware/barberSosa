<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="drawer-backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 z-[100] md:z-[80]"
        aria-hidden="true"
        @click="close"
      />
    </Transition>
    <Transition name="drawer-panel">
      <aside
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-full max-w-md bg-background-deep border-l border-primary/20 shadow-2xl z-[101] md:z-[81] flex flex-col"
        role="dialog"
        :aria-label="$t('cart.title')"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-primary/20 bg-charcoal/50">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">shopping_cart</span>
            <h2 class="text-white font-display font-bold text-lg uppercase tracking-wider">
              {{ $t('cart.title') }}
            </h2>
            <span 
              v-if="totalItems > 0" 
              class="bg-gold text-background-deep text-[10px] font-black rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center"
            >
              {{ totalItems }}
            </span>
          </div>
          <button
            type="button"
            class="p-2 rounded-sm border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
            :aria-label="$t('cart.closeCart')"
            @click="close"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Contenido -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>

          <div v-else-if="!cart.items || cart.items.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <span class="material-symbols-outlined text-6xl text-gray-600 mb-4">shopping_cart</span>
            <p class="text-gray-400 mb-6">{{ $t('cart.emptyTitle') }}</p>
            <NuxtLink
              to="/catalogo"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-background-deep font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 transition-all"
              @click="close"
            >
              {{ $t('cart.viewCatalog') }}
            </NuxtLink>
          </div>

          <ul v-else class="space-y-4">
            <li
              v-for="item in itemsWithProduct"
              :key="item.productId"
              class="flex gap-3 p-3 rounded-sm bg-charcoal/50 border border-primary/10"
            >
              <div class="w-16 h-16 rounded overflow-hidden bg-accent-gray flex-shrink-0">
                <img
                  v-if="item.product"
                  :src="item.product.image || fallbackImg"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-bold text-sm truncate">
                  {{ item.product?.name || $t('cart.productFallback') }}
                </p>
                <p class="text-primary font-bold text-sm">
                  ${{ item.product ? (item.product.price * item.quantity).toFixed(2) : '—' }}
                </p>
                <p class="text-gray-500 text-xs">{{ $t('cart.quantity') }}: {{ item.quantity }}</p>
              </div>
              <button
                type="button"
                class="p-1.5 text-gray-500 hover:text-red-400 transition-colors self-start"
                :aria-label="$t('cart.removeItem')"
                @click="removeItem(item.productId)"
              >
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Footer (solo si hay items) -->
        <div 
          v-if="cart.items && cart.items.length > 0 && !loading" 
          class="p-4 border-t border-primary/20 bg-charcoal/50 space-y-3"
        >
          <div class="flex justify-between text-white font-bold">
            <span>{{ $t('cart.subtotal') }}</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <NuxtLink
            to="/cart"
            class="block w-full py-3 text-center bg-gold text-background-deep font-black text-xs uppercase tracking-widest rounded-sm hover:brightness-110 transition-all"
            @click="close"
          >
            {{ $t('cart.viewFull') }}
          </NuxtLink>
          <button
            type="button"
            class="block w-full py-2.5 text-center border border-primary/30 text-primary font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-primary/10 transition-all"
            @click="close"
          >
            {{ $t('cart.continueShopping') }}
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup>
const { t } = useI18n();
const $t = t;

const cartDrawerOpen = useState('cart_drawer_open', () => false);
const { cart, loading, totalItems, fetchCart, removeFromCart } = useCart();
const { products, fetchProducts } = useProducts();

const fallbackImg = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect fill=\'%23333\' width=\'100\' height=\'100\'/%3E%3Ctext fill=\'%23666\' x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'10\'%3E?%3C/text%3E%3C/svg%3E';

const isOpen = computed(() => cartDrawerOpen.value);

const itemsWithProduct = computed(() => {
  const list = cart.value?.items || [];
  const prods = products.value || [];
  return list.map((item) => ({
    ...item,
    product: prods.find((p) => p._id === item.productId || p.id === item.productId),
  }));
});

const subtotal = computed(() => {
  return itemsWithProduct.value.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
});

function close() {
  cartDrawerOpen.value = false;
}

async function removeItem(productId) {
  await removeFromCart(productId);
}

watch(isOpen, (open) => {
  if (open) {
    fetchCart();
    fetchProducts();
  }
});
</script>

<style scoped>
.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-panel-enter-active,
.drawer-panel-leave-active {
  transition: transform 0.25s ease;
}
.drawer-panel-enter-from,
.drawer-panel-leave-to {
  transform: translateX(100%);
}
</style>

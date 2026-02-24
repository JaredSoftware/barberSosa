<template>
  <div class="min-h-screen bg-background-deep py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Mensaje tras volver de Mercado Pago -->
      <div v-if="paymentMessage" class="mb-6 p-4 rounded-sm border" :class="paymentMessage.type === 'success' ? 'bg-green-900/30 border-green-600 text-green-200' : paymentMessage.type === 'failure' ? 'bg-red-900/30 border-red-600 text-red-200' : 'bg-amber-900/30 border-amber-600 text-amber-200'">
        <p class="font-bold">{{ paymentMessage.text }}</p>
      </div>

      <!-- Título -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-[0.2em] mb-2">
          {{ $t('cart.title') }}
        </h1>
        <p class="text-gray-400 text-sm tracking-wide">
          {{ totalItems }} {{ totalItems === 1 ? $t('cart.itemSingular') : $t('cart.itemPlural') }} {{ $t('cart.inYourCart') }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p class="text-gray-400 mt-4">{{ $t('cart.loading') }}</p>
      </div>

      <!-- Carrito vacío -->
      <div v-else-if="!cart.items || cart.items.length === 0" class="text-center py-20">
        <span class="material-symbols-outlined text-6xl text-gray-600 mb-4">shopping_cart</span>
        <h2 class="text-2xl font-display text-white mb-4">{{ $t('cart.emptyTitle') }}</h2>
        <p class="text-gray-400 mb-8">{{ $t('cart.emptyDescription') }}</p>
        <NuxtLink
          to="/catalogo"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gold-gradient text-background-deep font-bold uppercase text-xs tracking-widest rounded-sm hover:brightness-110 transition-all"
        >
          <span class="material-symbols-outlined">storefront</span>
          {{ $t('cart.viewCatalog') }}
        </NuxtLink>
      </div>

      <!-- Contenido del carrito -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items del carrito -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartItemsWithDetails"
            :key="item.productId"
            class="bg-dark-gray border border-primary/20 rounded-sm p-4 flex gap-4"
          >
            <!-- Imagen del producto -->
            <div class="w-24 h-24 bg-accent-gray rounded overflow-hidden flex-shrink-0">
              <img
                v-if="item.product"
                :src="item.product.image || fallbackImage"
                :alt="item.product?.name || $t('cart.productFallback')"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Detalles del producto -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-white font-bold text-lg mb-1">
                  {{ item.product?.name || $t('cart.loadingProduct') }}
                </h3>
                <p class="text-gray-400 text-sm">
                  {{ item.product?.category || '' }}
                </p>
              </div>
              <div class="flex items-center gap-4">
                <!-- Cantidad -->
                <div class="flex items-center gap-2 border border-primary/30 rounded-sm">
                  <button
                    @click="decrementQuantity(item)"
                    class="px-3 py-1 text-primary hover:bg-primary/10 transition-all"
                    :disabled="updating"
                  >
                    -
                  </button>
                  <span class="px-3 text-white font-bold">{{ item.quantity }}</span>
                  <button
                    @click="incrementQuantity(item)"
                    class="px-3 py-1 text-primary hover:bg-primary/10 transition-all"
                    :disabled="updating"
                  >
                    +
                  </button>
                </div>
                <!-- Precio -->
                <p class="text-white font-bold text-lg">
                  ${{ item.product ? (item.product.price * item.quantity).toFixed(2) : '0.00' }}
                </p>
              </div>
            </div>

            <!-- Botón eliminar -->
            <button
              @click="handleRemove(item.productId)"
              class="text-gray-500 hover:text-red-500 transition-all"
              :aria-label="$t('cart.removeItem')"
              :disabled="updating"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>

        <!-- Resumen de compra -->
        <div class="lg:col-span-1">
          <div class="bg-dark-gray border border-primary/20 rounded-sm p-6 sticky top-24">
            <h2 class="text-white font-display font-bold text-xl uppercase tracking-wider mb-6">
              {{ $t('cart.summary') }}
            </h2>
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-400">
                <span>{{ $t('cart.subtotal') }}</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>{{ $t('cart.shipping') }}</span>
                <span>{{ $t('cart.shippingCheckout') }}</span>
              </div>
              <div class="border-t border-primary/20 pt-4 flex justify-between text-white font-bold text-xl">
                <span>{{ $t('cart.total') }}</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
            </div>
            <div class="mb-6 p-4 bg-amber-900/20 border border-amber-600/50 rounded-sm flex gap-3">
              <span class="material-symbols-outlined text-amber-400 flex-shrink-0">local_shipping</span>
              <p class="text-amber-200 text-sm">{{ $t('cart.noShippingNotice') }}</p>
            </div>
            <label class="flex items-start gap-3 mb-4 cursor-pointer group">
              <input
                v-model="termsAccepted"
                type="checkbox"
                class="mt-1 rounded border-primary/30 bg-accent-gray text-primary focus:ring-primary"
              />
              <span class="text-gray-400 text-sm group-hover:text-gray-300">
                {{ $t('cart.termsLabel') }}
                <NuxtLink to="/politicas" target="_blank" class="text-primary underline hover:no-underline">{{ $t('cart.termsLink') }}</NuxtLink>.
              </span>
            </label>
            <p v-if="cartError" class="text-red-400 text-sm mb-3">{{ cartError }}</p>
            <button
              class="w-full py-4 bg-gold-gradient text-background-deep font-black uppercase text-xs tracking-widest rounded-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="paymentLoading || !termsAccepted"
              @click="handleCheckout"
            >
              {{ paymentLoading ? $t('cart.redirectingToPayment') : $t('cart.checkout') }}
            </button>
            <button
              @click="handleClearCart"
              class="w-full py-3 border border-primary/30 text-primary font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-primary/10 transition-all"
              :disabled="updating"
            >
              {{ $t('cart.clear') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { cart, loading, totalItems, paymentLoading, error: cartError, fetchCart, updateCartItem, removeFromCart, clearCart, createPaymentPreference } = useCart();
const { products, fetchProducts } = useProducts();
const { t } = useI18n();
const $t = t;

const updating = ref(false);
const termsAccepted = ref(false);

const fallbackImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23333' width='400' height='400'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3E${encodeURIComponent($t('catalog.noImage'))}%3C/text%3E%3C/svg%3E`;


// Items con detalles de producto
const cartItemsWithDetails = computed(() => {
  if (!cart.value.items || !products.value) return [];
  
  return cart.value.items.map((item) => {
    const product = products.value.find((p) => p._id === item.productId);
    return {
      ...item,
      product,
    };
  });
});

// Subtotal
const subtotal = computed(() => {
  return cartItemsWithDetails.value.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
});

// Incrementar cantidad
const incrementQuantity = async (item) => {
  updating.value = true;
  try {
    await updateCartItem(item.productId, item.quantity + 1);
  } catch (error) {
    console.error('Error incrementando cantidad:', error);
  } finally {
    updating.value = false;
  }
};

// Decrementar cantidad
const decrementQuantity = async (item) => {
  if (item.quantity <= 1) {
    handleRemove(item.productId);
    return;
  }
  
  updating.value = true;
  try {
    await updateCartItem(item.productId, item.quantity - 1);
  } catch (error) {
    console.error('Error decrementando cantidad:', error);
  } finally {
    updating.value = false;
  }
};

// Eliminar item
const handleRemove = async (productId) => {
  if (!confirm($t('cart.removeConfirm'))) return;
  
  updating.value = true;
  try {
    await removeFromCart(productId);
  } catch (error) {
    console.error('Error eliminando producto:', error);
  } finally {
    updating.value = false;
  }
};

// Vaciar carrito
const handleClearCart = async () => {
  if (!confirm($t('cart.clearConfirm'))) return;
  
  updating.value = true;
  try {
    await clearCart();
  } catch (error) {
    console.error('Error vaciando carrito:', error);
  } finally {
    updating.value = false;
  }
};

// Ir a pagar (Mercado Pago Checkout Pro)
const handleCheckout = async () => {
  if (!termsAccepted.value) {
    cartError.value = $t('cart.termsRequired');
    return;
  }
  try {
    const data = await createPaymentPreference();
    const url = data.sandbox_init_point || data.init_point;
    if (url) window.location.href = url;
  } catch (error) {
    console.error('Error al iniciar pago:', error);
  }
};

// Mensaje al volver de Mercado Pago (query: ?payment=success|failure|pending)
const route = useRoute();
const paymentMessage = ref(null);

onMounted(async () => {
  await fetchCart();
  await fetchProducts();

  const status = route.query.payment;
  if (status === 'success') {
    paymentMessage.value = { type: 'success', text: t('cart.paymentSuccess') };
    await clearCart();
    await fetchCart();
  } else if (status === 'failure') {
    paymentMessage.value = { type: 'failure', text: t('cart.paymentFailure') };
  } else if (status === 'pending') {
    paymentMessage.value = { type: 'pending', text: t('cart.paymentPending') };
  }
});
</script>

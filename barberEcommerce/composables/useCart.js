// Composable del carrito
import { cartService } from '~/services/cart.js';

export const useCart = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const cart = useState('cart', () => ({ items: [], updatedAt: new Date() }));
  const loading = useState('cart_loading', () => false);
  const error = useState('cart_error', () => null);

  // Total de items en el carrito
  const totalItems = computed(() => {
    return cart.value.items.reduce((sum, item) => sum + item.quantity, 0);
  });

  // Obtener carrito desde el servidor
  // silent: true evita poner loading = true (útil en carga inicial del layout para no retrasar la UI)
  const fetchCart = async (opts = {}) => {
    const silent = opts.silent === true;
    if (!silent) loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.getCart(apiBase);
      return cart.value;
    } catch (err) {
      error.value = err.message || 'Error al obtener carrito';
      console.error('Error obteniendo carrito:', err);
      return cart.value;
    } finally {
      if (!silent) loading.value = false;
    }
  };

  // Añadir producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.addToCart(apiBase, productId, quantity);
      return cart.value;
    } catch (err) {
      error.value = err.message || 'Error al añadir al carrito';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar cantidad de un producto
  const updateCartItem = async (productId, quantity) => {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.updateCartItem(apiBase, productId, quantity);
      return cart.value;
    } catch (err) {
      error.value = err.message || 'Error al actualizar';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.removeFromCart(apiBase, productId);
      return cart.value;
    } catch (err) {
      error.value = err.message || 'Error al eliminar';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    loading.value = true;
    error.value = null;
    try {
      await cartService.clearCart(apiBase);
      cart.value = { items: [], updatedAt: new Date() };
      return cart.value;
    } catch (err) {
      error.value = err.message || 'Error al vaciar carrito';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fusionar carrito tras login
  const mergeCart = async (token) => {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.mergeCart(apiBase, token);
      return cart.value;
    } catch (err) {
      error.value = err.message || 'Error al fusionar carrito';
      console.error('Error fusionando carrito:', err);
      // No lanzar error, solo loguear
      return cart.value;
    } finally {
      loading.value = false;
    }
  };

  // Estado para "redirigiendo a pago"
  const paymentLoading = useState('cart_payment_loading', () => false);

  // Crear preferencia Mercado Pago y devolver init_point para redirigir
  const createPaymentPreference = async (opts = {}) => {
    paymentLoading.value = true;
    error.value = null;
    try {
      const data = await cartService.createPaymentPreference(apiBase, {
        payerEmail: opts.payerEmail,
        payerName: opts.payerName,
        payerSurname: opts.payerSurname,
        externalReference: opts.externalReference,
      });
      return data;
    } catch (err) {
      error.value = err.message || 'Error al iniciar el pago';
      throw err;
    } finally {
      paymentLoading.value = false;
    }
  };

  return {
    cart,
    loading,
    error,
    totalItems,
    paymentLoading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeCart,
    createPaymentPreference,
  };
};

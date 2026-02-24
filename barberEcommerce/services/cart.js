// Servicio del carrito de compras

export const cartService = {
  /**
   * Obtener carrito actual (usa sessionId en cookie o userId si está autenticado)
   */
  async getCart(apiBase) {
    try {
      const response = await fetch(`${apiBase}/api/cart`, {
        credentials: 'include', // Importante: enviar cookies
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al obtener carrito');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      return { items: [], updatedAt: new Date() };
    }
  },

  /**
   * Añadir producto al carrito
   */
  async addToCart(apiBase, productId, quantity = 1) {
    const response = await fetch(`${apiBase}/api/cart/items`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al añadir al carrito' }));
      throw new Error(errorData.message || 'Error al añadir al carrito');
    }
    return await response.json();
  },

  /**
   * Actualizar cantidad de un producto
   */
  async updateCartItem(apiBase, productId, quantity) {
    const response = await fetch(`${apiBase}/api/cart/items/${productId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Error al actualizar item');
    return await response.json();
  },

  /**
   * Eliminar producto del carrito
   */
  async removeFromCart(apiBase, productId) {
    const response = await fetch(`${apiBase}/api/cart/items/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al eliminar del carrito');
    return await response.json();
  },

  /**
   * Vaciar todo el carrito
   */
  async clearCart(apiBase) {
    const response = await fetch(`${apiBase}/api/cart`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al vaciar carrito');
    return await response.json();
  },

  /**
   * Crear preferencia de Mercado Pago (Checkout Pro).
   * Devuelve { init_point, preference_id } para redirigir al usuario a pagar.
   */
  async createPaymentPreference(apiBase, body = {}) {
    const response = await fetch(`${apiBase}/api/payment/create-preference`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear el pago');
    }
    return await response.json();
  },

  /**
   * Fusionar carrito de invitado con carrito de usuario (al hacer login)
   * Requiere autenticación
   */
  async mergeCart(apiBase, token) {
    const response = await fetch(`${apiBase}/api/cart/merge`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al fusionar carrito');
    return await response.json();
  },
};

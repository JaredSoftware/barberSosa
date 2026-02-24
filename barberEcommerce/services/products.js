// Servicio de productos del catálogo
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NUXT_PUBLIC_API_BASE || 'http://10.90.61.11';
};

export const productsService = {
  async getAll(activeOnly = true) {
    try {
      const API_BASE = getApiBase();
      const url = `${API_BASE}/api/products${activeOnly ? '?active=true' : ''}`;
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al obtener productos');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al obtener el producto');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      return null;
    }
  },

  async create(productData, token) {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al crear el producto' }));
      const errorMessage =
        errorData.message ||
        (Array.isArray(errorData) ? errorData.map((e) => e.message || e).join(', ') : 'Error al crear el producto');
      throw new Error(errorMessage);
    }
    return await response.json();
  },

  async update(id, productData, token) {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al actualizar el producto' }));
      const errorMessage =
        errorData.message ||
        (Array.isArray(errorData) ? errorData.map((e) => e.message || e).join(', ') : 'Error al actualizar el producto');
      throw new Error(errorMessage);
    }
    return await response.json();
  },

  async delete(id, token) {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al eliminar el producto');
    return true;
  },
};

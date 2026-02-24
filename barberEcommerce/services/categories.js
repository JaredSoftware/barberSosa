// Servicio de categorías
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NUXT_PUBLIC_API_BASE || 'http://10.90.61.11';
};

export const categoriesService = {
  async getAll(activeOnly = true) {
    try {
      const API_BASE = getApiBase();
      const url = `${API_BASE}/api/categories${activeOnly ? '?active=true' : ''}`;
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al obtener categorías');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/categories/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al obtener la categoría');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      return null;
    }
  },

  async create(categoryData, token) {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al crear la categoría' }));
      const errorMessage =
        errorData.message ||
        (Array.isArray(errorData) ? errorData.map((e) => e.message || e).join(', ') : 'Error al crear la categoría');
      throw new Error(errorMessage);
    }
    return await response.json();
  },

  async update(id, categoryData, token) {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/api/categories/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al actualizar la categoría' }));
      const errorMessage =
        errorData.message ||
        (Array.isArray(errorData) ? errorData.map((e) => e.message || e).join(', ') : 'Error al actualizar la categoría');
      throw new Error(errorMessage);
    }
    return await response.json();
  },

  async delete(id, token) {
    const API_BASE = getApiBase();
    const response = await fetch(`${API_BASE}/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al eliminar la categoría');
    return true;
  },
};

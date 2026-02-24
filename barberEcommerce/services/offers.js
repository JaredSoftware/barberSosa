// Servicio de ofertas premium
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // En el navegador, usar la misma URL (nginx redirige)
    return window.location.origin;
  }
  return process.env.NUXT_PUBLIC_API_BASE || 'http://10.90.61.11';
};

export const offersService = {
  // Obtener todas las ofertas (público - no requiere autenticación)
  async getAll(activeOnly = true) {
    try {
      const API_BASE = getApiBase();
      const url = `${API_BASE}/api/offers${activeOnly ? '?active=true' : ''}`;
      console.log('🔄 Solicitando ofertas desde:', url);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Evitar caché
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener ofertas');
      }
      
      const data = await response.json();
      console.log('📦 Ofertas recibidas del backend:', data);
      console.log('📊 Resumen por campo premium:', {
        total: data.length,
        premium: data.filter(o => o.premium === true).length,
        noPremium: data.filter(o => o.premium !== true).length,
        sinCampo: data.filter(o => !('premium' in o)).length,
      });
      return data;
    } catch (error) {
      console.error('Error obteniendo ofertas:', error);
      return [];
    }
  },

  // Obtener una oferta por ID (público - no requiere autenticación)
  async getById(id) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/offers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener la oferta');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo oferta:', error);
      return null;
    }
  },

  // Crear una oferta (requiere autenticación)
  async create(offerData, token) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/offers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al crear la oferta' }));
        const errorMessage = errorData.message || 
                           (Array.isArray(errorData) ? errorData.map(e => e.message || e).join(', ') : 'Error al crear la oferta');
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando oferta:', error);
      throw error;
    }
  },

  // Actualizar una oferta (requiere autenticación)
  async update(id, offerData, token) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/offers/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Error al actualizar la oferta' }));
        const errorMessage =
          errorData.message ||
          (Array.isArray(errorData)
            ? errorData.map((e) => e.message || e).join(', ')
            : 'Error al actualizar la oferta');
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando oferta:', error);
      throw error;
    }
  },

  // Eliminar una oferta (requiere autenticación)
  async delete(id, token) {
    try {
      const API_BASE = getApiBase();
      const response = await fetch(`${API_BASE}/api/offers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar la oferta');
      }
      
      return true;
    } catch (error) {
      console.error('Error eliminando oferta:', error);
      throw error;
    }
  },
};

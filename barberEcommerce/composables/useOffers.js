// Composable de Nuxt para ofertas premium
import { offersService } from '~/services/offers.js';
import { authService } from '~/services/auth.js';

export const useOffers = () => {
  const offers = useState('offers', () => []);
  const loading = useState('offers_loading', () => false);
  const error = useState('offers_error', () => null);

  // Obtener todas las ofertas (público - no requiere autenticación)
  const fetchOffers = async (activeOnly = true, forceRefresh = false) => {
    loading.value = true;
    error.value = null;
    try {
      if (forceRefresh) {
        offers.value = []; // Limpiar estado antes de cargar
      }
      const freshData = await offersService.getAll(activeOnly);
      offers.value = freshData;
      console.log('✅ useOffers: estado actualizado con', offers.value.length, 'ofertas');
      return offers.value;
    } catch (err) {
      error.value = err.message || 'Error al obtener ofertas';
      console.error('Error obteniendo ofertas:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Obtener una oferta por ID (público - no requiere autenticación)
  const fetchOfferById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const offer = await offersService.getById(id);
      return offer;
    } catch (err) {
      error.value = err.message || 'Error al obtener la oferta';
      console.error('Error obteniendo oferta:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Crear una oferta (requiere autenticación)
  const createOffer = async (offerData) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    loading.value = true;
    error.value = null;
    try {
      const newOffer = await offersService.create(offerData, token);
      offers.value.push(newOffer);
      return newOffer;
    } catch (err) {
      error.value = err.message || 'Error al crear la oferta';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar una oferta (requiere autenticación)
  const updateOffer = async (id, offerData) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    loading.value = true;
    error.value = null;
    try {
      const updatedOffer = await offersService.update(id, offerData, token);
      const index = offers.value.findIndex(o => o._id === id);
      if (index !== -1) {
        offers.value[index] = updatedOffer;
      }
      return updatedOffer;
    } catch (err) {
      error.value = err.message || 'Error al actualizar la oferta';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar una oferta (requiere autenticación)
  const deleteOffer = async (id) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No autenticado');
    }

    loading.value = true;
    error.value = null;
    try {
      await offersService.delete(id, token);
      offers.value = offers.value.filter(o => o._id !== id);
      return true;
    } catch (err) {
      error.value = err.message || 'Error al eliminar la oferta';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    offers,
    loading,
    error,
    fetchOffers,
    fetchOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
  };
};

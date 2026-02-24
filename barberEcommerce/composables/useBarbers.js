import { barbersService } from '~/services/barbers.js';
import { authService } from '~/services/auth.js';

export const useBarbers = () => {
  const barbers = useState('barbers', () => []);
  const loading = useState('barbers_loading', () => false);
  const error = useState('barbers_error', () => null);

  /** Público: solo activos (para página reservas) */
  const fetchBarbers = async (forceRefresh = false) => {
    loading.value = true;
    error.value = null;
    try {
      if (forceRefresh) barbers.value = [];
      const data = await barbersService.getActivos();
      barbers.value = data;
      return barbers.value;
    } catch (err) {
      error.value = err.message || 'Error al obtener barberos';
      return [];
    } finally {
      loading.value = false;
    }
  };

  /** Admin: listado completo (requiere token) */
  const fetchAdminBarbers = async () => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      const data = await barbersService.getAdminList(token);
      barbers.value = Array.isArray(data) ? data : [];
      return barbers.value;
    } catch (err) {
      error.value = err.message || 'Error al obtener barberos';
      barbers.value = [];
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBarber = async (id, data) => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      const updated = await barbersService.update(id, data, token);
      const idx = barbers.value.findIndex((b) => b._id === id);
      if (idx !== -1) barbers.value[idx] = updated;
      return updated;
    } catch (err) {
      error.value = err.message || 'Error al actualizar el barbero';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    barbers,
    loading,
    error,
    fetchBarbers,
    fetchAdminBarbers,
    updateBarber,
  };
};

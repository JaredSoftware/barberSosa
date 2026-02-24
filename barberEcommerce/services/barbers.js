const getApiBase = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NUXT_PUBLIC_API_BASE || 'http://10.90.61.11';
};

export const barbersService = {
  /** Listado público: solo barberos activos (para reservas) */
  async getActivos() {
    const res = await fetch(`${getApiBase()}/api/barberos`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Error al obtener barberos');
    return res.json();
  },

  /** Listado completo para admin (requiere JWT; cookie también vale) */
  async getAdminList(token) {
    const bearer = token ? `Bearer ${token}` : '';
    const res = await fetch(`${getApiBase()}/api/barberos/admin/list`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
        'X-Forwarded-Authorization': bearer,
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Error al obtener barberos');
    return res.json();
  },

  /** Detalle de un barbero (admin) */
  async getOne(id, token) {
    const bearer = token ? `Bearer ${token}` : '';
    const res = await fetch(`${getApiBase()}/api/barberos/admin/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
        'X-Forwarded-Authorization': bearer,
      },
    });
    if (!res.ok) throw new Error('Error al obtener el barbero');
    return res.json();
  },

  /** Actualizar barbero (nombre artista, imagen, descripción, etc.) */
  async update(id, data, token) {
    const bearer = token ? `Bearer ${token}` : '';
    const res = await fetch(`${getApiBase()}/api/barberos/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
        'X-Forwarded-Authorization': bearer,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar el barbero');
    }
    return res.json();
  },
};

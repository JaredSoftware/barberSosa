// Composable de Nuxt para categorías
import { categoriesService } from '~/services/categories.js';
import { authService } from '~/services/auth.js';

export const useCategories = () => {
  const categories = useState('categories', () => []);
  const loading = useState('categories_loading', () => false);
  const error = useState('categories_error', () => null);

  const fetchCategories = async (activeOnly = true) => {
    loading.value = true;
    error.value = null;
    try {
      categories.value = await categoriesService.getAll(activeOnly);
      return categories.value;
    } catch (err) {
      error.value = err.message || 'Error al obtener categorías';
      console.error('Error obteniendo categorías:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchCategoryById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const category = await categoriesService.getById(id);
      return category;
    } catch (err) {
      error.value = err.message || 'Error al obtener la categoría';
      console.error('Error obteniendo categoría:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (categoryData) => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      const newCategory = await categoriesService.create(categoryData, token);
      categories.value.push(newCategory);
      return newCategory;
    } catch (err) {
      error.value = err.message || 'Error al crear la categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id, categoryData) => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      const updated = await categoriesService.update(id, categoryData, token);
      const index = categories.value.findIndex((c) => c._id === id);
      if (index !== -1) categories.value[index] = updated;
      return updated;
    } catch (err) {
      error.value = err.message || 'Error al actualizar la categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id) => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      await categoriesService.delete(id, token);
      categories.value = categories.value.filter((c) => c._id !== id);
      return true;
    } catch (err) {
      error.value = err.message || 'Error al eliminar la categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

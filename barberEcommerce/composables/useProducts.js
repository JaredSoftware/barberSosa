// Composable de Nuxt para productos del catálogo
import { productsService } from '~/services/products.js';
import { authService } from '~/services/auth.js';

export const useProducts = () => {
  const products = useState('products', () => []);
  const loading = useState('products_loading', () => false);
  const error = useState('products_error', () => null);

  const fetchProducts = async (activeOnly = true) => {
    loading.value = true;
    error.value = null;
    try {
      products.value = await productsService.getAll(activeOnly);
      return products.value;
    } catch (err) {
      error.value = err.message || 'Error al obtener productos';
      console.error('Error obteniendo productos:', err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchProductById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const product = await productsService.getById(id);
      return product;
    } catch (err) {
      error.value = err.message || 'Error al obtener el producto';
      console.error('Error obteniendo producto:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (productData) => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      const newProduct = await productsService.create(productData, token);
      products.value.push(newProduct);
      return newProduct;
    } catch (err) {
      error.value = err.message || 'Error al crear el producto';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (id, productData) => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      const updated = await productsService.update(id, productData, token);
      const index = products.value.findIndex((p) => p._id === id);
      if (index !== -1) products.value[index] = updated;
      return updated;
    } catch (err) {
      error.value = err.message || 'Error al actualizar el producto';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (id) => {
    const token = authService.getToken();
    if (!token) throw new Error('No autenticado');
    loading.value = true;
    error.value = null;
    try {
      await productsService.delete(id, token);
      products.value = products.value.filter((p) => p._id !== id);
      return true;
    } catch (err) {
      error.value = err.message || 'Error al eliminar el producto';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

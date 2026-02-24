<template>
  <div class="dark min-h-screen">
    <div class="min-h-screen bg-background-deep py-8 px-4">
      <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-white text-3xl sm:text-4xl font-display font-bold uppercase tracking-widest">
            Gestionar Productos
          </h1>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-gold-gradient text-background-deep font-black uppercase tracking-[0.2em] py-3 px-6 rounded-sm hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
        >
          <span class="material-symbols-outlined">add</span>
          Nuevo Producto
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Cargando productos...</p>
      </div>

      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="product in products"
          :key="product._id"
          class="bg-charcoal border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group relative overflow-hidden"
        >
          <div class="absolute top-4 right-4">
            <span
              :class="product.active ? 'bg-green-600' : 'bg-gray-600'"
              class="text-xs px-2 py-1 rounded text-white"
            >
              {{ product.active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <div class="mb-4">
            <div v-if="product.image" class="w-full h-32 bg-background-deep rounded-sm mb-3 overflow-hidden">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-white text-xl font-display font-bold uppercase tracking-widest mb-2">
              {{ product.name }}
            </h3>
            <p class="text-gray-500 text-xs uppercase mb-2">{{ product.category }}</p>
            <p class="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{{ product.description }}</p>
          </div>
          <div class="flex items-baseline justify-between mb-4 pb-4 border-b border-primary/10">
            <span class="text-primary font-bold text-2xl">${{ Number(product.price).toFixed(2) }}</span>
            <span v-if="product.badge" class="text-gray-500 text-xs uppercase">{{ product.badge }}</span>
          </div>
          <div class="flex gap-2 mt-4">
            <button
              @click="editProduct(product)"
              class="flex-1 bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
            >
              Editar
            </button>
            <button
              @click="deleteProductConfirm(product._id)"
              class="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 bg-charcoal border border-primary/20 rounded-sm">
        <p class="text-gray-400">No hay productos. Crea uno para que aparezca en el catálogo.</p>
      </div>

      <!-- Modal crear/editar -->
      <div
        v-if="showCreateModal || editingProduct"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-charcoal border border-primary/20 rounded-sm p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 class="text-white text-2xl font-display font-bold uppercase tracking-widest mb-6">
            {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
          </h2>

          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Nombre *</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="Ej: Bálsamo de Sándalo"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Categoría *</label>
              <select
                v-model="formData.category"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              >
                <option v-if="categories.length === 0" disabled value="">Cargando categorías...</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
              </select>
              <p v-if="categories.length === 0" class="text-gray-500 text-xs mt-1">
                Debes crear categorías primero en el panel de admin.
              </p>
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Descripción *</label>
              <textarea
                v-model="formData.description"
                required
                rows="3"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Descripción del producto"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Precio *</label>
              <input
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="0.00"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">URL de imagen</label>
              <input
                v-model="formData.image"
                type="url"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Badge (opcional)</label>
              <input
                v-model="formData.badge"
                type="text"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="Premium, Nuevo, etc."
              />
            </div>

            <div class="flex items-center gap-2">
              <input
                v-model="formData.active"
                type="checkbox"
                id="active"
                class="rounded border-primary/20 bg-background-deep text-primary focus:ring-primary"
              />
              <label for="active" class="text-gray-400 text-sm uppercase tracking-wider">Producto visible en catálogo</label>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                class="flex-1 bg-gold-gradient text-background-deep font-black uppercase tracking-[0.2em] py-3 px-6 rounded-sm hover:brightness-110 transition-all shadow-lg"
              >
                {{ editingProduct ? 'Actualizar' : 'Crear' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-background-deep border border-primary/20 text-gray-400 hover:text-white font-bold py-3 px-6 rounded-sm transition-all uppercase tracking-wider"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
});

const { isAuthenticated } = useAuth();
const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
const { categories, fetchCategories } = useCategories();

const showCreateModal = ref(false);
const editingProduct = ref(null);
const formData = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  image: '',
  badge: '',
  active: true
});

onMounted(async () => {
  if (isAuthenticated.value) {
    await Promise.all([
      fetchProducts(false),
      fetchCategories(true)
    ]);
    // Si hay categorías, establecer la primera como default
    if (categories.value.length > 0 && !formData.value.category) {
      formData.value.category = categories.value[0].name;
    }
  }
});

const editProduct = (product) => {
  editingProduct.value = product;
  formData.value = {
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    image: product.image || '',
    badge: product.badge || '',
    active: product.active !== false
  };
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingProduct.value = null;
  formData.value = {
    name: '',
    category: categories.value.length > 0 ? categories.value[0].name : '',
    description: '',
    price: 0,
    image: '',
    badge: '',
    active: true
  };
};

const saveProduct = async () => {
  try {
    const data = {
      name: formData.value.name.trim(),
      category: formData.value.category,
      description: formData.value.description.trim(),
      price: Number(formData.value.price),
      active: formData.value.active !== false,
      image: (formData.value.image ?? '').trim(),
      badge: (formData.value.badge ?? '').trim() || undefined
    };
    if (editingProduct.value) {
      await updateProduct(editingProduct.value._id, data);
    } else {
      await createProduct(data);
    }
    closeModal();
    await fetchProducts(false);
  } catch (error) {
    console.error('Error guardando producto:', error);
    alert('Error al guardar: ' + (error.message || 'Error desconocido'));
  }
};

const deleteProductConfirm = async (id) => {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
  try {
    await deleteProduct(id);
    await fetchProducts(false);
  } catch (error) {
    console.error('Error eliminando producto:', error);
    alert('Error al eliminar: ' + (error.message || 'Error desconocido'));
  }
};

useHead({ title: 'Gestionar Productos - Admin Panel' });
</script>

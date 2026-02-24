<template>
  <div class="min-h-screen bg-background-deep py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <NuxtLink to="/admin" class="text-gray-400 hover:text-primary text-sm mb-2 inline-block transition-colors">
            ← Volver al Dashboard
          </NuxtLink>
          <h1 class="text-white text-3xl sm:text-4xl font-display font-bold uppercase tracking-widest">
            Gestionar Categorías
          </h1>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-gold-gradient text-background-deep font-black uppercase tracking-[0.2em] py-3 px-6 rounded-sm hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
        >
          <span class="material-symbols-outlined">add</span>
          Nueva Categoría
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Cargando categorías...</p>
      </div>

      <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="category in categories"
          :key="category._id"
          class="bg-charcoal border border-primary/20 rounded-sm p-6 hover:border-primary/40 transition-all group relative"
        >
          <div class="absolute top-4 right-4">
            <span
              :class="category.active ? 'bg-green-600' : 'bg-gray-600'"
              class="text-xs px-2 py-1 rounded text-white"
            >
              {{ category.active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
          <div class="text-center mb-4">
            <span class="material-symbols-outlined text-primary text-5xl">{{ category.icon }}</span>
          </div>
          <h3 class="text-white text-xl font-display font-bold uppercase tracking-widest mb-2 text-center">
            {{ category.name }}
          </h3>
          <p class="text-gray-500 text-xs text-center mb-4">Orden: {{ category.order || 0 }}</p>
          <div class="flex gap-2">
            <button
              @click="editCategory(category)"
              class="flex-1 bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
            >
              Editar
            </button>
            <button
              @click="deleteCategoryConfirm(category._id)"
              class="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold py-2 px-4 rounded-sm transition-all text-sm uppercase tracking-wider"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 bg-charcoal border border-primary/20 rounded-sm">
        <p class="text-gray-400">No hay categorías. Crea una para organizar tus productos.</p>
      </div>

      <!-- Modal crear/editar -->
      <div
        v-if="showCreateModal || editingCategory"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-charcoal border border-primary/20 rounded-sm p-8 max-w-md w-full">
          <h2 class="text-white text-2xl font-display font-bold uppercase tracking-widest mb-6">
            {{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h2>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Nombre *</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="Ej: Barba"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Icono (Material Symbols) *
              </label>
              <input
                v-model="formData.icon"
                type="text"
                required
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="face"
              />
              <div class="flex items-center gap-2 mt-1">
                <a
                  href="https://fonts.google.com/icons"
                  target="_blank"
                  class="text-primary hover:text-gold text-xs underline"
                >
                  Ver iconos disponibles
                </a>
              </div>
              <div v-if="formData.icon" class="mt-2 flex items-center gap-2">
                <span class="text-gray-400 text-xs">Vista previa:</span>
                <span class="material-symbols-outlined text-primary text-3xl">{{ formData.icon }}</span>
              </div>
            </div>

            <div>
              <label class="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Orden</label>
              <input
                v-model.number="formData.order"
                type="number"
                min="0"
                class="w-full bg-background-deep border border-primary/20 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="0"
              />
              <p class="text-gray-500 text-xs mt-1">Las categorías se ordenan de menor a mayor</p>
            </div>

            <div class="flex items-center gap-2">
              <input
                v-model="formData.active"
                type="checkbox"
                id="active"
                class="rounded border-primary/20 bg-background-deep text-primary focus:ring-primary"
              />
              <label for="active" class="text-gray-400 text-sm uppercase tracking-wider">Categoría visible</label>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                class="flex-1 bg-gold-gradient text-background-deep font-black uppercase tracking-[0.2em] py-3 px-6 rounded-sm hover:brightness-110 transition-all shadow-lg"
              >
                {{ editingCategory ? 'Actualizar' : 'Crear' }}
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
</template>

<script setup>
definePageMeta({
  middleware: 'admin'
});

const { isAuthenticated } = useAuth();
const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();

const showCreateModal = ref(false);
const editingCategory = ref(null);
const formData = ref({
  name: '',
  icon: 'category',
  order: 0,
  active: true
});

onMounted(async () => {
  if (isAuthenticated.value) await fetchCategories(false);
});

const editCategory = (category) => {
  editingCategory.value = category;
  formData.value = {
    name: category.name,
    icon: category.icon,
    order: category.order || 0,
    active: category.active !== false
  };
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingCategory.value = null;
  formData.value = {
    name: '',
    icon: 'category',
    order: 0,
    active: true
  };
};

const saveCategory = async () => {
  try {
    const data = {
      name: formData.value.name.trim(),
      icon: formData.value.icon.trim(),
      order: Number(formData.value.order),
      active: formData.value.active !== false
    };
    if (editingCategory.value) {
      await updateCategory(editingCategory.value._id, data);
    } else {
      await createCategory(data);
    }
    closeModal();
    await fetchCategories(false);
  } catch (error) {
    console.error('Error guardando categoría:', error);
    alert('Error al guardar: ' + (error.message || 'Error desconocido'));
  }
};

const deleteCategoryConfirm = async (id) => {
  if (!confirm('¿Eliminar esta categoría? Los productos con esta categoría no se eliminarán.')) return;
  try {
    await deleteCategory(id);
    await fetchCategories(false);
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    alert('Error al eliminar: ' + (error.message || 'Error desconocido'));
  }
};

useHead({ title: 'Gestionar Categorías - Admin Panel' });
</script>

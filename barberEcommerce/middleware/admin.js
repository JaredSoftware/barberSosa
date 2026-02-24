export default defineNuxtRouteMiddleware(async (to) => {
  // Permitir siempre el login/dashboard base de admin
  if (to.path === '/admin') return;

  if (!to.path.startsWith('/admin')) return;

  const { isAuthenticated } = useAuth();
  if (isAuthenticated.value) return;

  // No autenticado -> redirigir al login
  return navigateTo('/admin');
});

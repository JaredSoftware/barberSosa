export const useShopConfig = () => {
  const config = useRuntimeConfig();
  const API_URL = config.public.apiBase;

  const shopConfig = useState("shopConfig", () => null);
  const loading = useState("shopConfigLoading", () => false);

  const fetchConfig = async () => {
    loading.value = true;
    try {
      const { data } = await useFetch(`${API_URL}/api/configuration`);
      if (data.value) {
        shopConfig.value = data.value;
      }
    } catch (error) {
      console.error("Error fetching shop config:", error);
    } finally {
      loading.value = false;
    }
  };

  const updateConfig = async (newConfig) => {
    loading.value = true;
    try {
      const { data } = await useFetch(`${API_URL}/api/configuration`, {
        method: "PUT",
        body: newConfig,
      });
      if (data.value) {
        shopConfig.value = data.value;
      }
      return true;
    } catch (error) {
      console.error("Error updating shop config:", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    shopConfig,
    loading,
    fetchConfig,
    updateConfig,
  };
};

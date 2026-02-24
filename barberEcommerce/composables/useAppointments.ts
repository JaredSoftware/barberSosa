export const useAppointments = () => {
  const config = useRuntimeConfig();
  const API_URL = config.public.apiBase;

  const appointments = useState("appointments", () => []);
  const loading = useState("appointmentsLoading", () => false);

  const fetchAppointments = async (start?: string, end?: string) => {
    loading.value = true;
    try {
      const { data } = await useFetch(`${API_URL}/api/appointments`, {
        params: { start, end },
      });
      if (data.value) {
        appointments.value = data.value;
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    appointments,
    loading,
    fetchAppointments,
  };
};

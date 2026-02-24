export const useCurrency = () => {
  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  return { formatCurrency };
};


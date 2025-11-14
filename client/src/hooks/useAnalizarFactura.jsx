import { useState } from "react";

export const useAnalizarFactura = (factura) => {
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Si no hay factura aún, no hacemos nada
  if (!factura) return;

  const analizarFactura = async () => {
    setLoading(true);
    console.log("Factura enviada a IA:", factura);
    try {
      const res = await fetch("http://localhost:5000/api/ia/analizar-factura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factura),
      });

      const data = await res.json();
      setAnalisis(data);
    } catch (error) {
      setAnalisis({
        estado: "Error",
        error,
        explicacion_normativa: "Hubo un problema al analizar la factura.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { analizarFactura, analisis, loading };
};

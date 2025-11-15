export const generarPDF = async (analisis) => {
  const res = await fetch("http://localhost:5000/api/pdf/generar-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analisis),
  });

  // Convertir a archivo descargable
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "analisis_factura.pdf";
  a.click();
};

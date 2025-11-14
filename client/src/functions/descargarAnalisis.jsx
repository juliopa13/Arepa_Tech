import jsPDF from "jspdf";

export const generarPDFAnalisis = (analisis) => {
  if (!analisis) return;

  const doc = new jsPDF();

  let y = 10; // posición vertical inicial

  // Título
  doc.setFontSize(16);
  doc.text("Reporte de Análisis de Factura", 10, y);
  y += 10;

  // Estado normativo
  if (analisis.estado) {
    doc.setFontSize(12);
    doc.text(`Estado normativo: ${analisis.estado}`, 10, y);
    y += 10;
  }

  // Errores técnicos detectados
  if (analisis.errores_detectados?.length > 0) {
    doc.setFontSize(14);
    doc.text("Errores técnicos detectados:", 10, y);
    y += 8;

    doc.setFontSize(12);

    analisis.errores_detectados.forEach((err) => {
      doc.text(`• ${err}`, 14, y);
      y += 7;

      // manejo de salto de página si se llena
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    y += 5;
  }

  // Explicación normativa
  if (analisis.explicacion_normativa) {
    doc.setFontSize(14);
    doc.text("Explicación normativa de la DIAN:", 10, y);
    y += 10;

    doc.setFontSize(12);

    const lines = doc.splitTextToSize(analisis.explicacion_normativa, 180);
    doc.text(lines, 10, y);
  }

  doc.save("analisis_factura.pdf");
};

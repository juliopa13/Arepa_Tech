import jsPDF from "jspdf";

export const generarPDFAnalisis = (analisis) => {
  if (!analisis) return;

  const doc = new jsPDF();
  let y = 20;

  // ================================
  // 🎨 PALETA DE COLORES
  // ================================
  const primary = {
    50: "#e6fff7",
    100: "#ccfff0",
    200: "#99ffe1",
    300: "#66ffd2",
    400: "#33ffc3",
    500: "#00cc99",
    600: "#00a37a",
    700: "#007a5c",
    800: "#00523d",
    900: "#00291f",
  };

  const secondary = {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  };

  // ================================
  // 🟩 ENCABEZADO COLOR
  // ================================
  doc.setFillColor(primary[500]);
  doc.rect(0, 0, 210, 25, "F");

  doc.setFontSize(18);
  doc.setTextColor("#ffffff");
  doc.text("Reporte de Análisis de Factura", 105, 16, { align: "center" });

  doc.setTextColor("#000000"); // reset color

  // ================================
  // 🟦 SECCIÓN ESTADO
  // ================================
  doc.setFillColor(secondary[50]);
  doc.setDrawColor(secondary[300]);
  doc.roundedRect(10, y, 190, 20, 3, 3, "FD");

  doc.setFontSize(14);
  doc.text("Estado normativo:", 15, y + 8);

  doc.setFontSize(16);
  doc.setTextColor(analisis.estado === "Cumple" ? primary[600] : "#cc0000");
  doc.text(analisis.estado || "No definido", 15, y + 16);

  doc.setTextColor("#000000");
  y += 30;

  // ================================
  // 🚨 ERRORES DETECTADOS
  // ================================
  if (analisis.errores_detectados?.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(primary[700]);
    doc.text("Errores técnicos detectados:", 10, y);
    doc.setTextColor("#000000");
    y += 8;

    // fondo suave
    doc.setFillColor(primary[50]);
    doc.roundedRect(
      10,
      y,
      190,
      8 + analisis.errores_detectados.length * 8,
      3,
      3,
      "F"
    );
    y += 10;

    doc.setFontSize(12);

    analisis.errores_detectados.forEach((err) => {
      doc.text(`• ${err}`, 14, y);
      y += 7;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
  }

  // ================================
  // 📘 EXPLICACIÓN NORMATIVA (IA)
  // ================================
  if (analisis.explicacion_normativa) {
    doc.setFontSize(16);
    doc.setTextColor(primary[700]);
    doc.text("Explicación normativa de la DIAN:", 10, y);
    doc.setTextColor("#000000");
    y += 10;

    doc.setFontSize(12);

    const paragraphs = doc.splitTextToSize(analisis.explicacion_normativa, 180);

    paragraphs.forEach((line) => {
      doc.text(line, 10, y);
      y += 7;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  // ================================
  // 📄 GUARDAR PDF
  // ================================
  doc.save("analisis_factura.pdf");
};

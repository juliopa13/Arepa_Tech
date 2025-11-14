import io
from flask import Blueprint, request, send_file, jsonify
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor

from controllers.validacion_controller import validate_invoice # Importas tu lógica existente
# Si analizar_factura está en otra ruta, ajusto import.

ia_pdf_bp = Blueprint("ia_pdf", __name__, url_prefix="/api/ia")


@ia_pdf_bp.post("/reporte-factura")
def generar_reporte_pdf():
    data = request.json

    if not data:
        return jsonify({"error": "No enviaste datos en el body"}), 400

    # ================================
    # 1. Obtener análisis de la IA
    # ================================
    
    resultado = validate_invoice(data)

    analisis = resultado.get_json()

    # ================================
    # 2. Crear PDF en memoria
    # ================================
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    w, h = letter
    y = h - 50

    # ================================
    # 🎨 PALETA DE COLORES
    # ================================
    primary = {
        500: "#00cc99",
        600: "#00a37a",
        700: "#007a5c",
    }

    secondary = {
        50: "#f8fafc",
        300: "#cbd5e1",
        700: "#334155",
    }

    # ================================
    # 🟩 Encabezado
    # ================================
    pdf.setFillColor(HexColor(primary[500]))
    pdf.rect(0, h - 80, w, 80, fill=1, stroke=0)

    pdf.setFillColor("white")
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawCentredString(w / 2, h - 40, "Reporte de Análisis de Factura")

    pdf.setFillColor("black")
    pdf.setFont("Helvetica", 12)

    # ================================
    # 🟦 Sección Estado
    # ================================
    y -= 40
    pdf.setFillColor(HexColor(secondary[50]))
    pdf.rect(40, y - 20, w - 80, 40, fill=1)
    pdf.setStrokeColor(HexColor(secondary[300]))
    pdf.rect(40, y - 20, w - 80, 40)

    pdf.setFillColor("black")
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y + 5, "Estado normativo:")

    pdf.setFont("Helvetica-Bold", 16)
    pdf.setFillColor(
        HexColor(primary[600]) if analisis.get("estado") == "Cumple" else HexColor("#cc0000")
    )
    pdf.drawString(200, y + 5, analisis.get("estado", "No definido"))
    pdf.setFillColor("black")

    y -= 60

    # ================================
    # 🚨 Errores técnicos
    # ================================
    errores = analisis.get("errores_detectados", [])

    if errores:
        pdf.setFont("Helvetica-Bold", 14)
        pdf.setFillColor(HexColor(primary[700]))
        pdf.drawString(40, y, "Errores técnicos detectados:")
        pdf.setFillColor("black")
        y -= 20

        pdf.setFont("Helvetica", 12)

        for err in errores:
            pdf.drawString(50, y, f"• {err}")
            y -= 16

            if y < 80:  # salto de página
                pdf.showPage()
                y = h - 50
                pdf.setFont("Helvetica", 12)

        y -= 10

    # ================================
    # 📘 Explicación normativa (IA)
    # ================================
    explicacion = analisis.get("explicacion_normativa", "")

    if explicacion:
        pdf.setFont("Helvetica-Bold", 14)
        pdf.setFillColor(HexColor(primary[700]))
        pdf.drawString(40, y, "Explicación normativa de la DIAN:")
        pdf.setFillColor("black")
        y -= 25

        pdf.setFont("Helvetica", 11)

        for line in dividir_texto(explicacion, 95):
            pdf.drawString(40, y, line)
            y -= 14
            if y < 60:
                pdf.showPage()
                y = h - 50

    # ================================
    # Guardar PDF
    # ================================
    pdf.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="reporte_factura.pdf",
        mimetype="application/pdf",
    )


# ============================================
# 🛠 Función para dividir texto en varias líneas
# ============================================
def dividir_texto(texto, max_chars=95):
    palabras = texto.split()
    linea = ""
    lineas = []

    for palabra in palabras:
        if len(linea + palabra) < max_chars:
            linea += palabra + " "
        else:
            lineas.append(linea)
            linea = palabra + " "

    if linea:
        lineas.append(linea)

    return lineas

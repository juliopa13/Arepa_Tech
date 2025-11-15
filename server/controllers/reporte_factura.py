from flask import Blueprint, request, jsonify
generar_pdf_bp = Blueprint("generar_pdf_bp", __name__, url_prefix="/api/pdf")

@generar_pdf_bp.post("/generar-pdf")
def generar_pdf():
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.pagesizes import letter
    from flask import send_file
    import tempfile

    data = request.json
    if not data:
        return jsonify({"error": "Debe enviar un JSON"}), 400

    # Crear archivo PDF temporal
    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf_path = temp_pdf.name

    styles = getSampleStyleSheet()
    story = []

    # Título
    story.append(Paragraph("<b>Informe Técnico de Análisis de Factura Comercial</b>", styles["Title"]))
    story.append(Spacer(1, 12))

    # Estado
    story.append(Paragraph(f"<b>Estado:</b> {data['estado']}", styles["Normal"]))
    story.append(Spacer(1, 12))

    # Errores detectados
    story.append(Paragraph("<b>Errores Detectados:</b>", styles["Heading3"]))
    for err in data["errores_detectados"]:
        story.append(Paragraph(f"• {err}", styles["Normal"]))
    story.append(Spacer(1, 12))

    # Explicación normativa (Markdown → texto simple)
    story.append(Paragraph("<b>Explicación Normativa:</b>", styles["Heading3"]))
    story.append(Paragraph(data["explicacion_normativa"].replace("\n", "<br/>"), styles["Normal"]))

    # Construir PDF
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    doc.build(story)

    # Enviar PDF al frontend
    return send_file(pdf_path, as_attachment=True, download_name="analisis_factura.pdf")

from flask import Blueprint, request, jsonify, send_file
import tempfile
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
import markdown  # Para convertir Markdown a HTML
from datetime import datetime

generar_pdf_bp = Blueprint("generar_pdf_bp", __name__, url_prefix="/api/pdf")

@generar_pdf_bp.post("/generar-pdf")
def generar_pdf():
    data = request.json
    if not data or not all(key in data for key in ["estado", "errores_detectados", "explicacion_normativa"]):
        return jsonify({"error": "JSON inválido o faltan campos requeridos (estado, errores_detectados, explicacion_normativa)"}), 400

    # Crear archivo PDF temporal
    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf_path = temp_pdf.name

    # Definir colores personalizados basados en tus variables CSS (convertidos a RGB)
    primary_50 = colors.Color(230/255, 255/255, 247/255)  # --primary-50
    primary_100 = colors.Color(204/255, 255/255, 240/255)  # --primary-100
    primary_500 = colors.Color(0/255, 204/255, 153/255)    # --primary-500
    primary_700 = colors.Color(0/255, 122/255, 92/255)     # --primary-700
    secondary_50 = colors.Color(248/255, 250/255, 252/255) # --secondary-50
    secondary_100 = colors.Color(241/255, 245/255, 249/255) # --secondary-100
    secondary_400 = colors.Color(148/255, 163/255, 184/255) # --secondary-400
    secondary_700 = colors.Color(51/255, 65/255, 85/255)    # --secondary-700
    secondary_900 = colors.Color(15/255, 23/255, 42/255)    # --secondary-900

    # Estilos personalizados usando los colores
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=18,
        textColor=primary_500,  # Verde azulado principal
        alignment=1,  # Centrado
        spaceAfter=20
    )
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=primary_700,  # Verde azulado oscuro para encabezados
        spaceAfter=10
    )
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        textColor=secondary_700,  # Gris azulado medio para texto
        fontSize=12
    )

    story = []

    # Encabezado: Logo (opcional), título y fecha
    try:
        # Si tienes un logo, descomenta y ajusta la ruta
        # logo = Image("path/to/logo.png", width=1*inch, height=1*inch)
        # story.append(logo)
        # story.append(Spacer(1, 12))
        pass
    except:
        pass

    story.append(Paragraph("<b>Informe Técnico de Análisis de Factura Comercial</b>", title_style))
    story.append(Paragraph(f"Generado el: {datetime.now().strftime('%d/%m/%Y %H:%M')}", normal_style))
    story.append(Spacer(1, 20))

    # Resumen / Estado
    story.append(Paragraph("<b>Resumen del Análisis</b>", heading_style))
    story.append(Paragraph(f"<b>Estado:</b> {data['estado']}", normal_style))
    story.append(Spacer(1, 12))

    # Errores Detectados: Tabla con colores personalizados
    story.append(Paragraph("<b>Errores Detectados</b>", heading_style))
    if data["errores_detectados"]:
        table_data = [["#", "Descripción del Error"]]
        for i, err in enumerate(data["errores_detectados"], 1):
            table_data.append([str(i), err])
        
        table = Table(table_data, colWidths=[0.5*inch, 5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), primary_100),  # Fondo verde azulado claro para encabezado
            ('TEXTCOLOR', (0, 0), (-1, 0), secondary_900),  # Texto gris azulado oscuro
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), secondary_50),  # Fondo gris azulado muy claro para filas
            ('GRID', (0, 0), (-1, -1), 1, primary_500)  # Bordes en verde azulado
        ]))
        story.append(table)
    else:
        story.append(Paragraph("No se detectaron errores.", normal_style))
    story.append(Spacer(1, 12))

    # Explicación Normativa
    story.append(Paragraph("<b>Explicación Normativa</b>", heading_style))
    html_content = markdown.markdown(data["explicacion_normativa"])
    story.append(Paragraph(html_content, normal_style))
    story.append(Spacer(1, 20))

    # Pie de página
    footer_style = ParagraphStyle(
        'Footer',
        parent=normal_style,
        fontSize=10,
        textColor=secondary_400,  # Gris azulado claro
        alignment=1
    )
    story.append(Paragraph("<i>Este reporte fue generado automáticamente por el sistema de análisis de facturas.</i>", footer_style))

    # Construir PDF con márgenes
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=0.5*inch, rightMargin=0.5*inch, topMargin=0.5*inch, bottomMargin=0.5*inch)
    doc.build(story)

    # Enviar PDF al frontend
    return send_file(pdf_path, as_attachment=True, download_name="analisis_factura.pdf")

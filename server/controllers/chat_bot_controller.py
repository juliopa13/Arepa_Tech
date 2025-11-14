import google.generativeai as genai
import os
from flask import Blueprint, request, jsonify
from services.pdf_texto import cargar_pdf_como_texto
from services.validation_service import validate_invoice

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # controllers/
PDF_PATH = os.path.join(BASE_DIR, "..", "files", "Cartilla-Factura-comercial-CT-COA-0124-V2.pdf")

cartilla_dian = cargar_pdf_como_texto(os.path.normpath(PDF_PATH))


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

ia_bp = Blueprint("ia", __name__, url_prefix="/api/ia")


@ia_bp.post("/analizar-factura")
def analizar_factura():

    data = request.json
    if not data:
        return jsonify({"error": "Debe enviar un JSON"}), 400

    # 1. VALIDACIONES INTERNAS
    resultado = validate_invoice(data)
    errores_detectados = resultado["errores"]
    dic_campos = resultado["datos"]

    # 2. SI NO HAY ERRORES → No es necesario usar IA
    if not errores_detectados:
        return jsonify({
            "estado": "Cumple",
            "mensaje": "La factura cumple con los requisitos técnicos y normativos."
        })

    # 3. Enviar errores a IA para complementarlos con fundamento legal
    prompt = f"""
Eres un experto en valoración aduanera y validación documental,  Tu tarea es crear un **Informe Técnico de Análisis de Factura Comercial** que sea profesional, legible y estéticamente estructurado para generar un PDF. 

Usa ÚNICAMENTE las siguientes fuentes normativas oficiales:

📘 **Cartilla DIAN – Factura Comercial y Determinación del Valor en Aduana**
{cartilla_dian}

Ahora explica los siguientes errores técnicos encontrados en la factura:

Errores detectados:
{errores_detectados}

Factura analizada (JSON):
{dic_campos}

Instrucciones:
1. Cada error debe presentarse como un **bloque independiente** con encabezado.
2. Para cada error, incluye:
   - **Error detectado:** descripción clara y concisa.
   - **Fundamento legal:** citar norma exacta (DIAN, CAN 1684, Artículos, Secciones).
   - **Explicación:** cómo afecta la validez de la factura y por qué es crítico.
   - **Cómo corregirlo:** sugerencia práctica, paso a paso, que el usuario pueda implementar.
   - **Riesgos o consecuencias:** qué pasa si no se corrige.
   - **Consejo adicional:** recomendaciones prácticas para evitar errores similares en futuras facturas.
3. Usa **subtítulos, viñetas y numeraciones** para mejorar la legibilidad.
4. No repitas la misma frase para distintos errores.
5. El texto debe ser **formal, coherente y fácil de leer** para un auditor o inspector aduanero.
6. Incluye una breve **introducción** al inicio explicando el propósito del informe.
7. Al final, agrega un **resumen o conclusión breve** sobre el estado general de la factura.

Genera el resultado en **formato Markdown**, listo para procesar en PDF con secciones, encabezados y viñetas.  
El informe debe verse profesional y **guiar al usuario paso a paso** sobre cómo solucionar cada problema identificado.
    """

    respuesta_ia = model.generate_content(prompt)

    return jsonify({
        "estado": "No cumple",
        "errores_detectados": errores_detectados,
        "explicacion_normativa": respuesta_ia.text
    })

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
Eres un experto en valoración aduanera y validación documental, por favor crea un informe bonito.

Usa ÚNICAMENTE las siguientes fuentes normativas oficiales:

📘 **Cartilla DIAN – Factura Comercial y Determinación del Valor en Aduana**
{cartilla_dian}

Ahora explica los siguientes errores técnicos encontrados en la factura:

Errores detectados:
{errores_detectados}

Factura analizada (JSON):
{dic_campos}

Tu tarea:
1. Explicar cada error con fundamento en la normativa DIAN y la CAN 1684.
2. Indicar por qué ese error invalida o afecta la validación aduanera.
3. Dar una **solución exacta** para corregirlo.
4. Explicar riesgos o consecuencias de no corregir la factura.
5. Responder en formato:
   - **Error detectado**
   - **Fundamento legal**
   - **Explicación**
   - **Cómo corregirlo**
    """

    respuesta_ia = model.generate_content(prompt)

    return jsonify({
        "estado": "No cumple",
        "errores_detectados": errores_detectados,
        "explicacion_normativa": respuesta_ia.text
    })

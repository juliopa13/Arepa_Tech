import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Blueprint


# --- Cargar variables de entorno (.env) ---
load_dotenv()
API_KEY = os.getenv("API_KEY")

# --- Configuración del modelo Gemini ---
genai.configure(api_key=API_KEY)

# --- Ruta del Chat ---
chat_ia = Blueprint('chat_ia', __name__)
@chat_ia.route("/api/codereview", methods=["POST"]) # Cambiar el nombre de la ruta es buena práctica
def generate_validation_code():
    try:
        data = request.get_json()
        
        # Nuevos nombres de variables más claros para el contexto de la DIAN
        regla_a_codificar = data.get("regla_a_codificar", "") 
        codigo_de_ayuda = data.get("codigo_de_ayuda", "") # Tus funciones ya creadas
        normativa_dian = data.get("normativa_dian", "") # Texto extraído del PDF

        # Construir prompt completo
        prompt = f"""
Eres un ingeniero de software experto en Flask y Python, especializado en normatividad aduanera colombiana (DIAN). Tu tarea es tomar una regla de la factura de importación y crear una nueva función de validación modular en Python.

# RECURSOS Y REGLAS DE AUTORIDAD
{normativa_dian}

# CÓDIGO DE AYUDA (Estructura que ya está en uso)
Utiliza este código como ejemplo de la firma de las funciones y la estructura del error:
{codigo_de_ayuda}

# TAREA
Genera el código de una nueva función modular de Python que implemente estrictamente la siguiente regla:
"{regla_a_codificar}"

La nueva función debe llamarse 'validar_[nombre_del_campo]' y debe aceptar (dic, errores) o (tabla, errores) como argumentos, y debe añadir un error a la lista 'errores' si la regla no se cumple.
Asegúrate de manejar posibles errores de tipo (ej., si esperas un número y recibes texto).

SOLO devuelve el bloque de código de la función Python. No añadas explicaciones ni texto introductorio.
"""

        # Crear el modelo de Gemini
        model = genai.GenerativeModel("gemini-2.0-flash")

        # Generar la respuesta
        response = model.generate_content(prompt)
        text = response.text if hasattr(response, "text") else "No se recibió código."

        return jsonify({"validation_function": text})

    except Exception as e:
        # La segunda parte del try/except es redundante y se puede eliminar
        print("Error al contactar la API de Gemini:", e)
        return jsonify({"error": "Lo siento, no pude procesar tu solicitud."}), 500
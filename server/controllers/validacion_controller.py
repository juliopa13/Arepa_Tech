from flask import Blueprint,request,jsonify
from services.validation_service import validate_invoice

validation_bp=Blueprint('validation_bp',__name__, url_prefix="/api/dian")

@validation_bp.route('/validate', methods=['POST'])
def validate_invoice_route():
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"estado": "No cumple", "errores": ["El cuerpo de la solicitud no es un JSON válido."]})

    # Llama a la capa de Servicio para procesar la lógica de negocio
    respuesta_data = validate_invoice(data)

    return jsonify(respuesta_data)
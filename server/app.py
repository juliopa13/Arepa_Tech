from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.validacion_controller import validation_bp
app = Flask(__name__)
CORS(app,resources={r"/api/dian/*": {"origins": "http://localhost:5173"}})

# Campos obligatorios DIAN y su equivalencia en tu JSON
# --- RUTA PRINCIPAL ---
app.register_blueprint(validation_bp)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
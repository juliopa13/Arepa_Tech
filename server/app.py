from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.validacion_controller import validation_bp
from controllers.chat_bot_controller import ia_bp
#from controllers.ia_pd import ia_pdf_bp
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app,resources={r"/api/dian/*": {"origins": "http://localhost:5173"}, r"/api/ia/*": {"origins": "http://localhost:5173"}})

# Campos obligatorios DIAN y su equivalencia en tu JSON
# --- RUTA PRINCIPAL ---
app.register_blueprint(validation_bp)
app.register_blueprint(ia_bp)
#app.register_blueprint(ia_pdf_bp)


print("API KEY CARGADA:", os.getenv("GOOGLE_API_KEY"))
if __name__ == "__main__":
    app.run(port=5000, debug=True)
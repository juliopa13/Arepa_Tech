from PyPDF2 import PdfReader

def cargar_pdf_como_texto(ruta):
    with open(ruta, "rb") as f:
        lector = PdfReader(f)
        texto = ""
        for pagina in lector.pages:
            texto += pagina.extract_text() + "\n"
    return texto

from PyPDF2 import PdfReader

def cargar_pdf_como_texto(ruta):
    with open(ruta, "rb") as f:
        lector = PdfReader(f)
        texto = ""
        for pagina in lector.pages:
            texto += pagina.extract_text() + "\n"
    return texto
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
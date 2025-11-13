from flask import Flask, request, jsonify
from constants.invoice_rules import OBLIGATORIOS,CAMPOS_ITEMS_OBLIGATORIOS
def validar_campos_obligatorios(dic, errores):
    """Valida que todos los campos de la lista OBLIGATORIOS existan y no estén vacíos."""
    for campo in OBLIGATORIOS:
        if campo not in dic or str(dic.get(campo, "")).strip() == "":
            errores.append(f"Falta el campo obligatorio o está vacío: {campo}")

def validar_tipo_factura(dic, errores):
    """Valida que el InvoiceType exista y no sea 'Proforma'."""
    INVOICE_TYPE_CAMPO = "InvoiceType"
    invoice_type_value = dic.get(INVOICE_TYPE_CAMPO)

    if not invoice_type_value or str(invoice_type_value).strip() == "":
        errores.append(f"El campo '{INVOICE_TYPE_CAMPO}' es obligatorio y no se encontró o está vacío.")
    elif str(invoice_type_value).strip().upper() == "PROFORMA":
        errores.append(f"La factura no es una factura definitiva. El tipo encontrado es: '{invoice_type_value}'.")

def validar_detalles_tabla(tabla, errores):
    """Valida la existencia de la tabla y los campos clave en el primer ítem."""
    if len(tabla) == 0:
        errores.append("La factura no tiene ítems en la tabla.")
        return

    # Validar campos esenciales en el primer ítem (o en todos, según necesidad)
    item = tabla[0]
    
    for campo in CAMPOS_ITEMS_OBLIGATORIOS:
        if item.get(campo, "").strip() == "":
            errores.append(f"Falta el campo '{campo}' en la tabla de ítems.")

def validar_valor_factura(dic, tabla, errores):
    """Valida que TotalInvoiceValue no sea 0 y coincida con la suma de los ítems."""
    TOTAL_INVOICE_CAMPO = "TotalInvoiceValue"
    valor_total_factura_str = dic.get(TOTAL_INVOICE_CAMPO, "").strip()
    
    if not valor_total_factura_str:
        # El error de "obligatorio" ya se registra en validar_campos_obligatorios
        return 

    try:
        valor_total_factura = float(valor_total_factura_str)

        if valor_total_factura <= 0:
            errores.append(f"El valor total de la factura ({TOTAL_INVOICE_CAMPO}) debe ser mayor a cero. Valor encontrado: {valor_total_factura_str}")

        # Sumatoria de ítems
        suma_items = 0.0
        for item in tabla:
            net_value_str = item.get("NetValuePerItem", "0").strip()
            try:
                suma_items += float(net_value_str)
            except ValueError:
                errores.append(f"El campo 'NetValuePerItem' en un ítem no es un número válido: {net_value_str}")
        
        # Comparación
        TOLERANCIA = 0.01
        diferencia = abs(valor_total_factura - suma_items)
        
        if diferencia > TOLERANCIA:
            errores.append(
                f"El valor total de la factura ({valor_total_factura_str}) no coincide con la suma de los ítems ({suma_items:.2f}). La diferencia es de {diferencia:.2f}."
            )
            
    except ValueError:
        errores.append(f"El campo '{TOTAL_INVOICE_CAMPO}' no contiene un valor numérico válido: {valor_total_factura_str}")


def validate_invoice(data):

    campos = data.get("Fields", [])
    tabla = data.get("Table", [])
    errores = []

    # 1. Preprocesamiento: Convertir a diccionario
    dic = {item["Fields"]: str(item["Value"]) for item in campos} # Convertir a str aquí facilita las validaciones

    # 2. Ejecución de Validaciones
    validar_campos_obligatorios(dic, errores)
    validar_tipo_factura(dic, errores)
    validar_detalles_tabla(tabla, errores)
    validar_valor_factura(dic, tabla, errores) # Ahora recibe dic y tabla correctamente

    # 3. Respuesta final
    estado = "Cumple" if not errores else "No cumple"

    return {
        "estado": estado,
        "errores": errores,
        "datos": dic,
        "items": tabla
    }

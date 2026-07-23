import os
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit
from django.conf import settings

def generar_pdf_reporte_cliente(reporte):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    ancho, alto = letter

    # Colores corporativos (usa los de tu marca)
    COLOR_PRIMARIO = HexColor('#1A237E')  # Azul oscuro
    COLOR_SECUNDARIO = HexColor('#475569') # Gris texto

    # --- ENCABEZADO ---
    c.setFillColor(COLOR_PRIMARIO)
    c.rect(0, alto - 80, ancho, 80, fill=1, stroke=0)
    
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, alto - 45, "REPORTE EJECUTIVO DE CANDIDATO")

    # --- DATOS GENERALES ---
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, alto - 120, "1. DATOS GENERALES")
    
    c.setFillColor(COLOR_SECUNDARIO)
    c.setFont("Helvetica", 10)
    c.drawString(40, alto - 145, f"Candidato: {reporte.candidato.nombre_completo}")
    c.drawString(40, alto - 165, f"Puesto evaluado: {reporte.vacante.nombre_puesto}")
    c.drawString(300, alto - 145, f"Empresa / Cliente: {reporte.vacante.cliente}")
    c.drawString(300, alto - 165, f"Fecha: {reporte.fecha_envio.strftime('%d/%m/%Y')}")

    # --- RESULTADOS Y CONCLUSIÓN ---
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, alto - 210, "2. RESUMEN EJECUTIVO Y CONCLUSIÓN")
    
    c.setFillColor(COLOR_SECUNDARIO)
    c.setFont("Helvetica", 10)
    
    y = alto - 235
    lineas_conclusion = simpleSplit(reporte.conclusion, "Helvetica", 10, ancho - 80)
    for linea in lineas_conclusion:
        c.drawString(40, y, linea)
        y -= 15

    y -= 10
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, y, f"Siguiente paso sugerido: {reporte.siguiente_paso}")
    
    # --- FORTALEZAS ---
    y -= 40
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "3. FORTALEZAS DEL PERFIL VS VACANTE")
    
    y -= 25
    c.setFillColor(COLOR_SECUNDARIO)
    c.setFont("Helvetica", 10)
    lineas_fortalezas = simpleSplit(reporte.fortalezas, "Helvetica", 10, ancho - 80)
    for linea in lineas_fortalezas:
        c.drawString(40, y, linea)
        y -= 15

    # --- BRECHAS / RIESGOS ---
    y -= 25
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "4. BRECHAS / RIESGOS A CONSIDERAR")
    
    y -= 25
    c.setFillColor(COLOR_SECUNDARIO)
    c.setFont("Helvetica", 10)
    lineas_brechas = simpleSplit(reporte.brechas, "Helvetica", 10, ancho - 80)
    for linea in lineas_brechas:
        c.drawString(40, y, linea)
        y -= 15

    # --- PIE DE PÁGINA ---
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor('#94A3B8'))
    c.drawString(40, 30, "Documento confidencial generado por el Sistema Integral de Gestión")

    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer

def generar_pdf_propuesta_cliente(propuesta):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    ancho, alto = letter

    COLOR_PRIMARIO = HexColor('#1A237E')
    COLOR_SECUNDARIO = HexColor('#475569')

    # ENCABEZADO
    c.setFillColor(COLOR_PRIMARIO)
    c.rect(0, alto - 80, ancho, 80, fill=1, stroke=0)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, alto - 45, "PROPUESTA DE PERFILAMIENTO COMERCIAL")

    # DATOS
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, alto - 120, "1. DETALLES DE LA VACANTE")
    
    c.setFillColor(COLOR_SECUNDARIO)
    c.setFont("Helvetica", 10)
    c.drawString(40, alto - 145, f"Cliente: {propuesta.vacante.cliente}")
    c.drawString(40, alto - 165, f"Puesto: {propuesta.vacante.nombre_puesto}")
    c.drawString(300, alto - 145, f"Modalidad: {propuesta.vacante.get_modalidad_display()}")
    
    sueldo = f"${propuesta.vacante.sueldo_ofertado:,.2f}" if propuesta.vacante.sueldo_ofertado else "A convenir"
    c.drawString(300, alto - 165, f"Sueldo Oferta: {sueldo}")
    
    # OBJETIVO Y ENTREGABLES
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, alto - 210, "2. OBJETIVO DEL PUESTO")
    
    c.setFillColor(COLOR_SECUNDARIO)
    c.setFont("Helvetica", 10)
    y = alto - 235
    for linea in simpleSplit(propuesta.objetivo_puesto, "Helvetica", 10, ancho - 80):
        c.drawString(40, y, linea)
        y -= 15

    y -= 15
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "3. ENTREGABLES ESPERADOS")
    
    c.setFillColor(COLOR_SECUNDARIO)
    c.setFont("Helvetica", 10)
    y -= 25
    for linea in simpleSplit(propuesta.entregables_esperados, "Helvetica", 10, ancho - 80):
        c.drawString(40, y, linea)
        y -= 15

    # CIERRE
    y -= 35
    c.setFillColor(COLOR_PRIMARIO)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, y, f"Tiempo estimado de cobertura: {propuesta.tiempo_estimado_cobertura}")
    
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor('#94A3B8'))
    c.drawString(40, 30, "Documento confidencial generado por el Sistema Integral de Gestión")

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer

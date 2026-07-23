from reportlab.lib import colors

# ============================================================
# TEMAS DE COTIZACIÓN
# Cada tema define el estilo visual del PDF generado.
# Las empresas referencian su tema en plantillas_config.py
# ============================================================

TEMAS = {
    # -------------------------
    # DISEÑOS POR CADA EMPRESA
    # -------------------------

    # AVIDUX
    "AVIDUX": {
        "estilo_cliente": "avidux",
        "color_header_tabla": "#F4DCDC",   # Rosa pastel del encabezado
        "color_texto_header": "#000000",   # Texto negro
        "estilo_tabla": "avidux_style",    # Estilo de tabla personalizado
    },

    # 373 COMERCIO
    "373 COMERCIO": {
        "estilo_cliente": "373_comercio",
        "color_header_tabla": "#3C4B64",   # Azul grisáceo
        "color_texto_header": "#FFFFFF",   # Texto blanco
        "estilo_tabla": "373_style",       # Estilo de tabla alternado
    },

    # MELLAFE
    "MELLAFE": {
        "estilo_cliente": "mellafe",
        "color_header_tabla": "#0076C0",   # Azul Mellafe
        "color_texto_header": "#FFFFFF",   # Texto blanco
        "estilo_tabla": "mellafe_style",   
    },

    # SISUC
    "SISUC": {
        "estilo_cliente": "sisuc",
        "color_header_tabla": "#00508C",   
        "color_texto_header": "#FFFFFF",   
        "estilo_tabla": "sisuc_style",   
        # --- AQUÍ CONFIGURAS LOS TEXTOS DE LA TABLA ---
    },

    # AGRAMON
    "AGRAMON": {
        "estilo_cliente": "agramon",
        "color_header_tabla": "#737373",   # Gris oscuro
        "color_texto_header": "#FFFFFF",   # Texto blanco
        "estilo_tabla": "agramon_style",   
        # --- ETIQUETAS PERSONALIZADAS ---
        "etiqueta_col1": "Descripción",
        "etiqueta_col2": "Cantidad",
        "etiqueta_col3": "Und",
        "etiqueta_col4": "Total",
    },

    # AMELIT
    "AMELIT": {
        "estilo_cliente": "amelit",
        "color_header_tabla": "#FFFFFF",   # Fondo blanco
        "color_texto_header": "#000000",   # Texto negro
        "estilo_tabla": "amelit_style",   
        # --- ETIQUETAS PERSONALIZADAS ---
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col2": "CANT",
    },

    #BERGUN
    "BERGUN": {
        "estilo_cliente": "bergun",
        "color_header_tabla": "#F4A4B8",   # Rosa para el encabezado
        "color_texto_header": "#87274E",   # Texto magenta oscuro
        "estilo_tabla": "bergun_style",   
        # --- ETIQUETAS INVERTIDAS ---
        "etiqueta_col1": "Cantidad",
        "etiqueta_col2": "Producto/servicio",
        "etiqueta_col3": "Valor unitario",
        "etiqueta_col4": "Valor",
        "anchos_columnas": [60, 240, 100, 100],
    },

    # BERZAN
    "BERZAN": {
        "estilo_cliente": "berzan",
        "color_header_tabla": "transparent", # No se usa porque quitaremos el fondo
        "color_texto_header": "#555555",     # Gris oscuro
        "estilo_tabla": "berzan_style",   
        # --- ETIQUETAS ---
        "etiqueta_col1": "CONCEPTO",
    },

    # CALAFELL

    "CALAFELL": {
        "estilo_cliente": "calafell",
        "color_header_tabla": "transparent", 
        "color_texto_header": "#000000",
        "estilo_tabla": "calafell_style",   
        # Las etiquetas no se usarán porque ya vienen impresas, pero las definimos
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col2": "PRECIO",
        "etiqueta_col3": "CANTIDAD",
        "anchos_columnas": [220, 100, 80, 100],
    },

    # CRISAC
    "CRISAC": {
        "estilo_cliente": "crisac",
        "color_header_tabla": "transparent",
        "color_texto_header": "#000000",
        "estilo_tabla": "crisac_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col3": "PRECIO UNITARIO",
        "anchos_columnas": [220, 80, 110, 80],
    },

    # CUENCA
    "CUENCA": {
        "estilo_cliente": "cuenca",
        "color_header_tabla": "transparent",
        "color_texto_header": "#1b1958", # Azul oscuro
        "estilo_tabla": "cuenca_style",   
        "anchos_columnas": [180, 100, 100, 100],
    },

    # DERSA
    "DERSA": {
        "estilo_cliente": "dersa",
        "color_header_tabla": "transparent",
        "color_texto_header": "#1b1464", # Azul DERSA
        "estilo_tabla": "dersa_style",   
        "etiqueta_col3": "VALOR<br/>UNITARIO",
        "anchos_columnas": [180, 100, 100, 100],
    },

    # EXPRESATEL
    "EXPRESATEL": {
        "estilo_cliente": "expresatel",
        "color_header_tabla": "#761dc9", # Morado
        "color_texto_header": "#ffffff", # Blanco
        "estilo_tabla": "expresatel_style",   
        "etiqueta_col1": "Descripción",
        "etiqueta_col2": "Cantidad",
        "etiqueta_col3": "Precio",
        "etiqueta_col4": "Total",
        "anchos_columnas": [220, 80, 100, 100],
    },

    # FACSAM
    "FACSAM": {
        "estilo_cliente": "facsam",
        "color_header_tabla": "#c17d7d", # Rosa palo
        "color_texto_header": "#6b4c4c", # Café oscuro
        "estilo_tabla": "facsam_style",   
        "etiqueta_col1": "Descripción",
        "etiqueta_col2": "Cantidad",
        "etiqueta_col3": "Precio<br/>Unitario",
        "etiqueta_col4": "Total",
        "anchos_columnas": [220, 90, 90, 90],
    },

    # FICSAR
    # FICSAR
    "FICSAR": {
        "estilo_cliente": "ficsar",
        "color_header_tabla": "#ffffff", # Blanco para sobreescribir el genérico
        "color_texto_header": "#000000", # Negro
        "estilo_tabla": "ficsar_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col2": "CANT.",
        "anchos_columnas": [250, 70, 80, 90],
    },

    # ASESORES GBR
    "ASESORES GBR": {
        "estilo_cliente": "asesores_gbr",
        "color_header_tabla": "#2f3a4b", # Azul oscuro
        "color_texto_header": "#ffffff", # Blanco
        "estilo_tabla": "asesores_gbr_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col2": "HORAS/CANT.",
        "anchos_columnas": [230, 80, 80, 90],
    },

    # GLOBALEARTH
    "GLOBALEARTH": {
        "estilo_cliente": "globalearth",
        "color_header_tabla": "transparent",
        "color_texto_header": "#555555", # Gris oscuro
        "estilo_tabla": "globalearth_style",   
        "etiqueta_col1": "CONCEPTO",
        "anchos_columnas": [180, 100, 100, 100],
    },

    # GOVIDA
    "GOVIDA": {
        "estilo_cliente": "govida",
        "color_header_tabla": "#75cbe6", # Celeste/Azul claro
        "color_texto_header": "#ffffff", # Blanco
        "estilo_tabla": "govida_style",   
        "anchos_columnas": [250, 80, 80, 90],
    },

    # KALE
    "KALE": {
        "estilo_cliente": "kale",
        "color_header_tabla": "transparent",
        "color_texto_header": "#000000", # Negro
        "estilo_tabla": "kale_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "anchos_columnas": [240, 80, 80, 100],
    },

    # LEVICTUS
    "LEVICTUS": {
        "estilo_cliente": "levictus",
        "color_header_tabla": "transparent",
        "color_texto_header": "#000000",
        "estilo_tabla": "levictus_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col2": "",
        "etiqueta_col3": "",
        "anchos_columnas": [380, 0.1, 0.1, 120],
        "ocultar_columnas_centrales": True,
    },

    # LEXIC
    "LEXIC": {
        "estilo_cliente": "lexic",
        "color_header_tabla": "#5e8aef", # Azul vibrante
        "color_texto_header": "#ffffff", # Blanco
        "estilo_tabla": "lexic_style",   
        "etiqueta_col1": "Descripción",
        "etiqueta_col2": "Cantidad",
        "etiqueta_col3": "Precio",
        "anchos_columnas": [220, 90, 90, 100],
    },

    # LIMGRATSA
    "LIMGRATSA": {
        "estilo_cliente": "limgratsa",
        "color_header_tabla": "#eedfcb", # Beige
        "color_texto_header": "#8c5c38", # Café
        "estilo_tabla": "limgratsa_style",   
        "etiqueta_col1": "Descripción",
        "etiqueta_col2": "Cantidad",
        "etiqueta_col3": "Precio Unitario",
        "etiqueta_col4": "Total",
        "anchos_columnas": [250, 80, 80, 90],
    },

    # LITERSA
    "LITERSA": {
        "estilo_cliente": "litersa",
        "color_header_tabla": "transparent",
        "color_texto_header": "#666666", # Gris/Café oscuro
        "estilo_tabla": "litersa_style",   
        "etiqueta_col1": "CONCEPTO",
        "anchos_columnas": [200, 100, 100, 100],
    },

    # LOTSA
    "LOTSA": {
        "estilo_cliente": "lotsa",
        "color_header_tabla": "transparent",
        "color_texto_header": "#231f82", # Azul oscuro Lotsa
        "estilo_tabla": "lotsa_style",   
        "etiqueta_col3": "VALOR<br/>UNITARIO",
        "anchos_columnas": [230, 90, 100, 80],
    },

    # PLAFOREY
    "PLAFOREY": {
        "estilo_cliente": "plaforey",
        "color_header_tabla": "transparent",
        "color_texto_header": "#000000", 
        "estilo_tabla": "plaforey_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col2": "",
        "etiqueta_col3": "",
        "anchos_columnas": [380, 0.1, 0.1, 120],
        "ocultar_columnas_centrales": True,
    },

    # RAWAN
    "RAWAN": {
        "estilo_cliente": "rawan",
        "color_header_tabla": "transparent",
        "color_texto_header": "#0d47a1", # Azul corporativo
        "estilo_tabla": "rawan_style",   
        "etiqueta_col1": "Producto",
        "etiqueta_col2": "Cantidad",
        "etiqueta_col3": "Precio unitario",
        "etiqueta_col4": "Total",
        "anchos_columnas": [220, 90, 100, 100],
    },

    # TABEL
    "TABEL": {
        "estilo_cliente": "tabel",
        "color_header_tabla": "#04437a", # Azul oscuro
        "color_texto_header": "#ffffff", # Blanco
        "estilo_tabla": "tabel_style",   
        "anchos_columnas": [230, 80, 90, 90],
    },

    # TERIGEN
    "TERIGEN": {
        "estilo_cliente": "terigen",
        "color_header_tabla": "transparent",
        "color_texto_header": "#000000",
        "estilo_tabla": "terigen_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "etiqueta_col2": "",
        "etiqueta_col3": "",
        "anchos_columnas": [350, 0.1, 0.1, 100],
        "ocultar_columnas_centrales": True,
    },

    # TORRES
    "TORRES": {
        "estilo_cliente": "torres",
        "color_header_tabla": "#263645", 
        "color_texto_header": "#ffffff", 
        "estilo_tabla": "torres_style",   
        "etiqueta_col1": "DESCRIPCIÓN",
        "anchos_columnas": [230, 70, 80, 92],
    },

    # VIMEX
    "VIMEX": {
        "estilo_cliente": "vimex",
        "color_header_tabla": "#f5cccc", # Rosa salmón pastel
        "color_texto_header": "#000000", 
        "estilo_tabla": "vimex_style",   
        "anchos_columnas": [230, 80, 90, 90],
    },








    
   
}

# ==========================================
# CONFIGURACIÓN POR DEFECTO
# ==========================================
DEFAULT_TEMA = {
    "fuente_base": "Helvetica",
    "fuente_bold": "Helvetica-Bold",
    "mostrar_nota_validez": False,
    "titulo_cotizacion": "",
    "etiqueta_col1": "PRODUCTO",
    "etiqueta_col2": "CANTIDAD",
    "etiqueta_col3": "PRECIO",
    "etiqueta_col4": "TOTAL",
    "anchos_columnas": [220, 80, 100, 100],
    "ocultar_columnas_centrales": False,
}

def get_tema(nombre_tema):
    """Devuelve la configuración del tema combinada con los valores por defecto."""
    tema_especifico = TEMAS.get(nombre_tema.upper(), TEMAS["AVIDUX"])
    tema_completo = DEFAULT_TEMA.copy()
    tema_completo.update(tema_especifico)
    return tema_completo

# Coordenadas base (puedes ajustarlas individualmente después si algún PDF tiene un diseño diferente)
COORDS_BASE = {
    "cliente": (140, 580),
    "rfc": (140, 565),
    "uso_cfdi": (140, 550),
    "domicilio": (140, 535),
    "fecha": (470, 580),
    "folio": (470, 565),
    "x_tabla_inicio": 45,
    "y_tabla_techo": 445,
    "y_subtotal": 260,
    "y_iva": 240,
    "y_total": 220,
    "col_totales": 580
}

MAPA_PLANTILLAS = {
    "AVIDUX":       {"pdf": "MEMBRETADA AVIDUX.pdf",      
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 600), "folio_centro":(306,680)}, "tema": "AVIDUX"},
    
    "373 COMERCIO": {"pdf": "MEMBRETADA_373_COMERCIO.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (45, 590), "fecha_folio": (420, 690)}, "tema": "373 COMERCIO"},

    "MELLAFE": {"pdf": "MEMBRETADA_MELLAFE.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (40, 560), "folio_centro": (380, 680)}, "tema": "MELLAFE"},

    "SISUC": {"pdf": "MEMBRETADA_SISUC.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (40, 620), "fecha_folio": (340, 680)}, "tema": "SISUC"},

    "AGRAMON": {"pdf": "MEMBRETADA_AGRAMON.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (40, 580), "fecha_folio": (400, 680)}, "tema": "AGRAMON"},

    "AMELIT": {"pdf": "MEMBRETADA_AMELIT.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (40, 640), "fecha_folio": (40, 680)}, "tema": "AMELIT"},

    "BERGUN": {"pdf": "MEMBRETADA_BERGUN.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (40, 630), "folio_centro": (300, 665)}, "tema": "BERGUN"},

    "BERZAN": {"pdf": "MEMBRETADA_BERZAN.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (40, 650), "fecha_folio": (400, 680)}, "tema": "BERZAN"},

    "CALAFELL": {"pdf": "MEMBRETADA_CALAFELL.pdf", 
        "coords": {"x_tabla_inicio": 40, "cliente": (120, 560), "fecha_folio": (40, 680)}, "tema": "CALAFELL"},

    "CRISAC": {"pdf": "MEMBRETADA_CRISAC.pdf", 
        "coords": {"x_tabla_inicio": 65, "cliente": (65, 660), "folio": (480, 715)}, "tema": "CRISAC"},

    "CUENCA": {"pdf": "MEMBRETADA_CUENCA.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (70, 580), "folio": (450, 715), "fecha": (380, 620)}, "tema": "CUENCA"},

    "DERSA": {"pdf": "MEMBRETADA_DERSA.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 660), "fecha": (340, 660)}, "tema": "DERSA"},
    
    "EXPRESATEL": {"pdf": "MEMBRETADA_EXPRESATEL.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 580), "fecha": (420, 660)}, "tema": "EXPRESATEL"},

    "FACSAM": {"pdf": "MEMBRETADA_FACSAM.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 652), "folio": (450, 630)}, "tema": "FACSAM"},

    "FICSAR": {"pdf": "MEMBRETADA_FICSAR.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 570), "folio": (450, 680)}, "tema": "FICSAR"},

    "ASESORES GBR": {"pdf": "MEMBRETADA_ASESORES_GBR.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 580), "folio": (400, 620)}, "tema": "ASESORES GBR"},

    "GLOBALEARTH": {"pdf": "MEMBRETADA_GLOBALEARTH.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 615), "fecha": (450, 615)}, "tema": "GLOBALEARTH"},

    "GOVIDA": {"pdf": "MEMBRETADA_GOVIDA.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 660), "fecha": (500, 700)}, "tema": "GOVIDA"},

    "KALE": {"pdf": "MEMBRETADA_KALE.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 540), "folio": (380, 720)}, "tema": "KALE"},

    "LEVICTUS": {"pdf": "MEMBRETADA_LEVICTUS.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 600), "folio": (450, 720)}, "tema": "LEVICTUS"},

    "LEXIC": {"pdf": "MEMBRETADA_LEXIC.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 680), "fecha": (450, 680)}, "tema": "LEXIC"},

    "LIMGRATSA": {"pdf": "MEMBRETADA_LIMGRATSA.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 660), "folio": (380, 715)}, "tema": "LIMGRATSA"},

    "LITERSA": {"pdf": "MEMBRETADA_LITERSA.pdf", 
        "coords": {"x_tabla_inicio": 50, "cliente": (50, 620), "folio": (380, 660)}, "tema": "LITERSA"},

    "LOTSA": {"pdf": "MEMBRETADA_LOTSA.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 660), "fecha": (330, 660)}, "tema": "LOTSA"},

    "PLAFOREY": {"pdf": "MEMBRETADA_PLAFOREY.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 550), "folio": (490, 715)}, "tema": "PLAFOREY"},

    "RAWAN": {"pdf": "MEMBRETADA_RAWAN.pdf", 
        "coords": {"x_tabla_inicio": 50, "cliente": (320, 630), "fecha": (50, 630), "folio": (400, 690)}, "tema": "RAWAN"},

    "TABEL": {"pdf": "MEMBRETADA_TABEL.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 660), "folio": (350, 650)}, "tema": "TABEL"},

    "TERIGEN": {"pdf": "MEMBRETADA_TERIGEN.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 560), "folio": (400, 640)}, "tema": "TERIGEN"},

    "TORRES": {"pdf": "MEMBRETADA_TORRES.pdf", 
        "coords": {"x_tabla_inicio": 90, "cliente": (90, 580), "folio": (400, 630)}, "tema": "TORRES"},
        
    "VIMEX": {"pdf": "MEMBRETADA_VIMEX.pdf", 
        "coords": {"x_tabla_inicio": 60, "cliente": (60, 600), "folio": (420, 630)}, "tema": "VIMEX"},

}

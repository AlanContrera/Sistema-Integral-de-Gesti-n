import os

src_dir = os.path.dirname(__file__)
app_jsx_path = os.path.join(src_dir, 'App.jsx')

with open(app_jsx_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_lines(start, end):
    return "".join(lines[start-1:end])

parsers_code = "import React from 'react';\n\n" + get_lines(607, 710) + "\nexport { limpiarTextoCorreo, ParseadorDeTablas };\n"
modal_code = "import React, { useState } from 'react';\nimport { X } from 'lucide-react';\nimport { updateComprobante } from '../services/api';\n\n" + get_lines(9, 182) + "\nexport default ModalVistaPrevia;\n"
facturas_code = "import React, { useState, Fragment } from 'react';\nimport { Landmark, ChevronLeft, Download } from 'lucide-react';\nimport ExcelJS from 'exceljs';\nimport { saveAs } from 'file-saver';\n\n" + get_lines(184, 437) + "\nexport default VistaFacturas;\n"
expediente_code = "import React, { useState } from 'react';\nimport { ChevronLeft, FileText, ArrowRightLeft, Download } from 'lucide-react';\nimport { getComprobantes } from '../services/api';\n\n" + get_lines(716, 922) + "\nexport default VistaExpediente;\n"

os.makedirs(os.path.join(src_dir, 'components'), exist_ok=True)
os.makedirs(os.path.join(src_dir, 'utils'), exist_ok=True)

with open(os.path.join(src_dir, 'utils', 'parsers.jsx'), 'w', encoding='utf-8') as f:
    f.write(parsers_code)

with open(os.path.join(src_dir, 'components', 'ModalVistaPrevia.jsx'), 'w', encoding='utf-8') as f:
    f.write(modal_code)

with open(os.path.join(src_dir, 'components', 'VistaFacturas.jsx'), 'w', encoding='utf-8') as f:
    f.write(facturas_code)

with open(os.path.join(src_dir, 'components', 'VistaExpediente.jsx'), 'w', encoding='utf-8') as f:
    f.write(expediente_code)

print("Extracted successfully")

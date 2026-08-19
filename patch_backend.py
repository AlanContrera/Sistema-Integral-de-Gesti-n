import re

file_path = 'backend/apps/cotizador/views.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''            return Response({
                "empresa_emisora": {
                    "id": empresa_db.id if empresa_db else None,
                    "nombre": empresa_db.nombre_empresa if empresa_db else (empresa_factura_excel or "Desconocida"),
                    "match": bool(empresa_db)
                },
                "cliente": {
                    "id": cliente_db.id if cliente_db else None,
                    # DEVOLVEMOS LA EMPRESA COMO DATO PRINCIPAL
                    "nombre": cliente_db.empresa if cliente_db else (cliente_receptor_excel or "Desconocido"),
                    "match": bool(cliente_db)
                }
            })'''

replacement = '''            return Response({
                "empresa_emisora": {
                    "id": empresa_db.id if empresa_db else None,
                    "nombre": empresa_db.nombre_empresa if empresa_db else (empresa_factura_excel or "Desconocida"),
                    "correo": empresa_db.correo_remitente if empresa_db else "",
                    "match": bool(empresa_db)
                },
                "cliente": {
                    "id": cliente_db.id if cliente_db else None,
                    "nombre": cliente_db.empresa if cliente_db else (cliente_receptor_excel or "Desconocido"),
                    "correo": cliente_db.correo if cliente_db else "",
                    "match": bool(cliente_db)
                }
            })'''

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('views.py modificado correctamente.')
else:
    print('No se encontro el target en views.py')

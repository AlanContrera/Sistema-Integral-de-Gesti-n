import sqlite3
conn = sqlite3.connect('db.sqlite3', timeout=30)
cur = conn.cursor()
cur.execute('SELECT id, asunto, tipo_ingreso, parent_id FROM correos_correoprocesado ORDER BY id DESC LIMIT 10')
for row in cur.fetchall():
    print(row)

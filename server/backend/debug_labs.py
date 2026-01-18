
import sqlite3
from db_connect import get_connection

conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT id, lab_name, location FROM appointments ORDER BY created_at DESC")
rows = cur.fetchall()
print("ID | Lab Name | Location")
print("-" * 30)
for r in rows:
    print(f"{r[0]} | '{r[1]}' | '{r[2]}'")
conn.close()

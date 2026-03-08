from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("DESCRIBE lab_settings")
with open("schema_full.txt", "w") as f:
    for row in cur.fetchall():
        f.write(str(row) + "\n")
cur.close()
conn.close()

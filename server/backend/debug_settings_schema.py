from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("DESCRIBE lab_settings")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()

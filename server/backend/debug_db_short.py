from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT id, email, role FROM users")
for row in cur.fetchall():
    print(row)
cur.execute("SHOW TABLES")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()

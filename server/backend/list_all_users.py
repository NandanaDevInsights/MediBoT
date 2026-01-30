from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT id, email, username, role FROM users")
for row in cur.fetchall():
    print(row)
conn.close()

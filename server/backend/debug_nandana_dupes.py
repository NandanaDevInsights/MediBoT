from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT id, email, role FROM users WHERE email='nandanapramod329@gmail.com'")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()

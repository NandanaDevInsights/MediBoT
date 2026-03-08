from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT * FROM lab_admin_users")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()

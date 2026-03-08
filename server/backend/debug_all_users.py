from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT id, email, role FROM users")
rows = cur.fetchall()
print(f"Total users: {len(rows)}")
for row in rows:
    print(row)
cur.close()
conn.close()

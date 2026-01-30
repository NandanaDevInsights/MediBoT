from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT id, email, provider, role FROM users WHERE email='medibot.care@gmail.com'")
print(cur.fetchone())
conn.close()

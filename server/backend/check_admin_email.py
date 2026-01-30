from db_connect import get_connection
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT email, role FROM users WHERE email='medibot.care@gmail.com'")
print(cur.fetchall())
conn.close()

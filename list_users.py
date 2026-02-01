import mysql.connector

try:
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='medibot_final'
    )
    
    cur = conn.cursor()
    cur.execute('SELECT id, email, username, role, provider, password_hash FROM users')
    
    print("All users in database:")
    print("-" * 120)
    for row in cur.fetchall():
        pwd_preview = (row[5][:20] + '...') if row[5] else 'None'
        print(f"ID: {row[0]:3} | Email: {row[1]:30} | Username: {row[2]:20} | Role: {row[3]:12} | Provider: {row[4]:10} | PWD: {pwd_preview}")
    print("-" * 120)
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

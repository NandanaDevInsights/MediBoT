import mysql.connector

try:
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='medibot_final'
    )
    
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) FROM users')
    count = cur.fetchone()[0]
    print(f"Total users in database: {count}")
    
    cur.execute('SELECT id, email, username, role, provider FROM users')
    
    print("\nAll users:")
    for row in cur.fetchall():
        print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")

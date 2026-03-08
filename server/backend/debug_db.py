from db_connect import get_connection

def check():
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, email, username, role, provider FROM users")
    rows = cur.fetchall()
    print("=== USERS TABLE ===")
    for row in rows:
        print(row)
    
    cur.execute("SHOW TABLES")
    tables = cur.fetchall()
    print("\n=== TABLES ===")
    for t in tables:
        print(t)
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    check()

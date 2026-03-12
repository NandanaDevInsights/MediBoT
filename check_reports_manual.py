import sqlite3
import os

def check_reports():
    db_path = 'server/backend/medibot.db'
    if not os.path.exists(db_path):
        print("DB not found at", db_path)
        return
    
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    print("\n--- reports table structure ---")
    try:
        cur.execute("PRAGMA table_info(reports)")
        for col in cur.fetchall():
            print(col)
    except Exception as e:
        print(e)
        
    print("\n--- reports table data (first 5) ---")
    try:
        cur.execute("SELECT * FROM reports LIMIT 5")
        for row in cur.fetchall():
            print(row)
    except Exception as e:
        print(e)
        
    print("\n--- users table data (first 5) ---")
    try:
        cur.execute("SELECT id, username, email FROM users LIMIT 5")
        for row in cur.fetchall():
            print(row)
    except Exception as e:
        print(e)

    conn.close()

if __name__ == "__main__":
    check_reports()

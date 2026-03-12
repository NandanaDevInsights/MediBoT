import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_notifications():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASS"),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("--- notifications table count ---")
        cur.execute("SELECT COUNT(*) FROM notifications")
        print(cur.fetchone())
        
        print("\n--- recent 5 notifications ---")
        cur.execute("SELECT * FROM notifications ORDER BY id DESC LIMIT 5")
        for row in cur.fetchall():
            print(row)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_notifications()

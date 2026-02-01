
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def check_admins():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        print("--- app_users (Admins) ---")
        cur.execute("SELECT id, email, role, username FROM app_users WHERE role IN ('LAB_ADMIN', 'SUPER_ADMIN')")
        for row in cur.fetchall():
            print(row)
        
        print("\n--- lab_admin_users (Whitelist) ---")
        cur.execute("SELECT id, email FROM lab_admin_users")
        for row in cur.fetchall():
            print(row)
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_admins()

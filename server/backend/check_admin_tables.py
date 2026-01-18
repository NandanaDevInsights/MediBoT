
import os
import mysql.connector
from dotenv import load_dotenv
import json

load_dotenv()

def check_tables():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor(dictionary=True)
        
        print("--- USERS (LIMIT 20) ---")
        cur.execute("SELECT id, email, username, role, provider FROM users LIMIT 20")
        print(json.dumps(cur.fetchall(), indent=2))

        print("\n--- LAB_ADMIN_USERS (LIMIT 20) ---")
        # Check if table exists first
        cur.execute("SHOW TABLES LIKE 'lab_admin_users'")
        if cur.fetchone():
            cur.execute("SELECT id, email, role, provider FROM lab_admin_users LIMIT 20")
            print(json.dumps(cur.fetchall(), indent=2))
        else:
            print("Table 'lab_admin_users' does not exist.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_tables()

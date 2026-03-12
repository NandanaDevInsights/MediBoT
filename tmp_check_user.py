import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_user():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASS"),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("--- user 2 details ---")
        cur.execute("SELECT id, username, phone_number FROM users WHERE id=2")
        print(cur.fetchone())
        
        print("\n--- user_profile 2 details ---")
        cur.execute("SELECT user_id, contact_number FROM user_profile WHERE user_id=2")
        print(cur.fetchone())
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_user()

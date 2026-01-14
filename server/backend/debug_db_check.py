
import os
import mysql.connector
from dotenv import load_dotenv
import json

load_dotenv()

def check_data():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor(dictionary=True)
        
        print("--- USERS ---")
        cur.execute("SELECT id, email, role FROM users")
        users = cur.fetchall()
        print(json.dumps(users, indent=2))
            
        print("\n--- PRESCRIPTIONS (First 5) ---")
        cur.execute("SELECT id, user_id, mobile_number, file_path FROM prescriptions LIMIT 5")
        rx = cur.fetchall()
        print(json.dumps(rx, indent=2))
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_data()

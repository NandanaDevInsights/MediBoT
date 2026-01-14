
import os
import mysql.connector
from dotenv import load_dotenv
import json

load_dotenv()

def dump_db():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor(dictionary=True)
    
    print("--- USERS ---")
    cur.execute("SELECT id, email, role FROM users")
    print(json.dumps(cur.fetchall(), indent=2))

    print("\n--- PRESCRIPTIONS ---")
    cur.execute("SELECT id, user_id, file_path, status, mobile_number FROM prescriptions")
    print(json.dumps(cur.fetchall(), indent=2))
    
    conn.close()

if __name__ == "__main__":
    dump_db()


import os
import mysql.connector
from dotenv import load_dotenv
import json

load_dotenv()

def check_schema():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor(dictionary=True)
        
        print("--- USERS SCHEMA ---")
        cur.execute("DESCRIBE users")
        print(json.dumps(cur.fetchall(), indent=2))
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_schema()

import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_users_schema():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASS"),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("--- users schema ---")
        cur.execute("DESCRIBE users")
        for col in cur.fetchall():
            print(col)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_users_schema()

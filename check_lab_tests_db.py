
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def check_lab_settings():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT name, tests_config FROM laboratories")
        rows = cur.fetchall()
        for row in rows:
            print(f"Lab: {row['name']}")
            print(f"Tests Config: {row['tests_config'][:200]}...")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_lab_settings()

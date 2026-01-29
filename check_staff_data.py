
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def check():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "medibot")
        )
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM lab_staff LIMIT 1")
        row = cur.fetchone()
        print(f"SAMPLE_ROW: {row}")
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check()

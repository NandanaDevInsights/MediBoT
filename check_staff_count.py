
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
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM lab_staff")
        count = cur.fetchone()[0]
        print(f"LAB_STAFF_COUNT: {count}")
        
        cur.execute("SHOW COLUMNS FROM lab_staff")
        cols = [c[0] for c in cur.fetchall()]
        print(f"LAB_STAFF_COLS: {cols}")
        
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check()

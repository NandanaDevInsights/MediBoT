import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_db():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASS"),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("--- appointments schema ---")
        cur.execute("DESCRIBE appointments")
        for col in cur.fetchall():
            print(col)
            
        print("\n--- recent 5 appointments ---")
        cur.execute("SELECT id, user_id, patient_name, contact_number, status FROM appointments ORDER BY id DESC LIMIT 5")
        for row in cur.fetchall():
            print(row)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()

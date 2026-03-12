import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

def check_reports():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "127.0.0.1"),
            port=int(os.environ.get("DB_PORT", 3306)),
            user=os.environ.get("DB_USER"),
            password=os.environ.get("DB_PASSWORD"),
            database=os.environ.get("DB_NAME")
        )
        cur = conn.cursor()
        
        print("\n--- reports table structure ---")
        cur.execute("DESCRIBE reports")
        for col in cur.fetchall():
            print(col)
            
        print("\n--- reports table data (first 5) ---")
        cur.execute("SELECT * FROM reports LIMIT 5")
        for row in cur.fetchall():
            print(row)
            
        print("\n--- users table data (first 5) ---")
        cur.execute("SELECT id, username, email FROM users LIMIT 5")
        for row in cur.fetchall():
            print(row)

        cur.close()
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    check_reports()

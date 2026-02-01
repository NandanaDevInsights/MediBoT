
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\.env')

def verify_db_password():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        email = "admin@example.com"
        password = "Admin@123"
        
        cur.execute("SELECT password_hash FROM app_users WHERE email=%s", (email,))
        row = cur.fetchone()
        if row:
            db_hash = row[0]
            print(f"Hash in DB: {db_hash}")
            # Try to check
            if bcrypt.checkpw(password.encode('utf-8'), db_hash.encode('utf-8')):
                print("Password check PASSED in this script.")
            else:
                print("Password check FAILED in this script.")
        else:
            print("User not found.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_db_password()

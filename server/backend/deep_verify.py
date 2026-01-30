import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def deep_verify():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        test_email = "admin@example.com"
        test_pass = "admin123"
        
        print(f"Checking user: {test_email}")
        cur.execute("SELECT password_hash, role FROM users WHERE email=%s", (test_email,))
        row = cur.fetchone()
        
        if not row:
            print(f"ERROR: {test_email} not found in database!")
            return
            
        db_hash, role = row
        print(f"Role in DB: {role}")
        print(f"Hash in DB: {db_hash}")
        
        # Verify using exactly the same logic as app.py
        try:
            is_valid = bcrypt.checkpw(test_pass.encode("utf-8"), db_hash.encode("utf-8"))
            print(f"Bcrypt Verification: {'SUCCESS' if is_valid else 'FAILED'}")
        except Exception as e:
            print(f"Bcrypt Check Error: {e}")
            
        conn.close()
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    deep_verify()

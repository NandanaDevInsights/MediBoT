
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def test_login_verification():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        print(f"Connected to {conn.database}")
        
        test_cases = [
            ("patient@example.com", "Patient@123"),
            ("admin@example.com", "Admin@123"),
            ("testadmin@lab.com", "Admin@123")
        ]
        
        for email, pwd in test_cases:
            print(f"\nTesting {email}...")
            cur.execute("SELECT password_hash FROM users WHERE email=%s", (email,))
            row = cur.fetchone()
            if not row:
                print("  User not found!")
                continue
                
            db_hash = row[0]
            print(f"  Hash found: {db_hash[:10]}...")
            
            if bcrypt.checkpw(pwd.encode('utf-8'), db_hash.encode('utf-8')):
                print("  MATCH: Password verify SUCCEEDED")
            else:
                print("  FAIL: Password verify FAILED")
                
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login_verification()

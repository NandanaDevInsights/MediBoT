import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def test_internal_login():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        email = "admin@example.com"
        password = "admin123"
        
        print(f"Testing login for {email} with password {password}...")
        
        cur.execute(
            "SELECT id, email, password_hash, role FROM users WHERE email=%s AND role IN ('LAB_ADMIN', 'SUPER_ADMIN')",
            (email,)
        )
        row = cur.fetchone()
        
        if not row:
            print("FAILED: User not found in database with that email and admin role.")
            # List all users to see what's there
            cur.execute("SELECT email, role FROM users")
            print("Current users in DB:")
            for r in cur.fetchall():
                print(f"  - {r}")
            return

        uid, db_email, phash, role = row
        print(f"Found user: ID={uid}, Email={db_email}, Role={role}")
        print(f"Hash in DB: {phash}")
        
        if bcrypt.checkpw(password.encode('utf-8'), phash.encode('utf-8')):
            print("SUCCESS: Password matches!")
        else:
            print("FAILED: Password mismatch.")
            # Test a fresh hash
            fresh_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
            print(f"Fresh hash for target password: {fresh_hash}")
            if bcrypt.checkpw(password.encode('utf-8'), fresh_hash.encode('utf-8')):
                print("Fresh hash verification works.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_internal_login()

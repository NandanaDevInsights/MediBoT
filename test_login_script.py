
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def test_manual_login(identifier, password):
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        query = """
            SELECT id, email, password_hash, role 
            FROM users 
            WHERE LOWER(email) = LOWER(%s) OR username = %s 
            LIMIT 1
        """
        cur.execute(query, (identifier, identifier))
        row = cur.fetchone()
        
        if not row:
            print(f"FAILED: User '{identifier}' not found.")
            return

        uid, email, phash, role = row
        print(f"Found User: ID={uid}, Role={role}, Email={email}")
        
        if bcrypt.checkpw(password.encode('utf-8'), phash.encode('utf-8')):
            print("SUCCESS: Password matched.")
        else:
            print("FAILED: Password Mismatch.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Testing Patient Login:")
    test_manual_login("patient@example.com", "Patient@123")
    print("\nTesting Admin Login:")
    test_manual_login("admin@example.com", "Admin@123")
    print("\nTesting Patient Username Login:")
    test_manual_login("patient_user", "Patient@123")

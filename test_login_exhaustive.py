
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def test_app_logic(identifier, password):
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    
    # 1. get_user_with_password logic
    query = """
        SELECT id, email, password_hash, provider, role, pin_code, username 
        FROM users 
        WHERE LOWER(email) = LOWER(%s) OR username = %s 
        LIMIT 1
    """
    cur.execute(query, (identifier, identifier))
    user_row = cur.fetchone()
    
    if not user_row:
        print(f"FAILED: User '{identifier}' not found.")
        return
    
    id, email, password_hash, provider, role, pin_code, username = user_row
    
    # 2. bcrypt check logic
    if not password_hash:
        print("FAILED: No password hash.")
        return
        
    if bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8")):
        print(f"SUCCESS: Login verified for {email} ({role})")
    else:
        print(f"FAILED: Password mismatch for {email}")
    
    conn.close()

if __name__ == "__main__":
    print("Test 1: Patient Email")
    test_app_logic("patient@example.com", "Patient@123")
    print("\nTest 2: Patient Username")
    test_app_logic("patient_user", "Patient@123")
    print("\nTest 3: Admin Email")
    test_app_logic("admin@example.com", "Admin@123")
    print("\nTest 4: Admin Username")
    test_app_logic("admin_user", "Admin@123")
    print("\nTest 5: Wrong Password")
    test_app_logic("patient@example.com", "Wrong@123")

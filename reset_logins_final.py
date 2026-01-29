
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def reset_all_logins():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    
    # Clear existing to avoid confusion
    cur.execute("DELETE FROM users WHERE email IN ('patient@example.com', 'admin@example.com')")
    
    # 1. Patient
    p_pass = "Patient@123".encode('utf-8')
    p_hash = bcrypt.hashpw(p_pass, bcrypt.gensalt(12)).decode('utf-8')
    cur.execute(
        "INSERT INTO users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
        ("patient@example.com", "patient_user", p_hash, "USER", "password")
    )
    
    # 2. Admin
    a_pass = "Admin@123".encode('utf-8')
    a_hash = bcrypt.hashpw(a_pass, bcrypt.gensalt(12)).decode('utf-8')
    cur.execute(
        "INSERT INTO users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
        ("admin@example.com", "admin_user", a_hash, "LAB_ADMIN", "password")
    )
    
    # Whitelist
    cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", ("admin@example.com",))
    
    conn.commit()
    print("Logins reset successfully.")
    conn.close()

if __name__ == "__main__":
    reset_all_logins()

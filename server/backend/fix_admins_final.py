import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def fix_all_admins():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    
    password = "admin123"
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    
    # 1. Update existing admin passwords
    cur.execute("UPDATE users SET password_hash=%s WHERE role IN ('LAB_ADMIN', 'SUPER_ADMIN')", (hashed,))
    print(f"Updated {cur.rowcount} admin passwords to 'admin123'")
    
    # 2. List them all clearly
    cur.execute("SELECT id, email, role FROM users WHERE role IN ('LAB_ADMIN', 'SUPER_ADMIN')")
    admins = cur.fetchall()
    print("\nVerified Admins:")
    for a in admins:
        print(f" - Email: {a[1]}, Role: {a[2]}")
        
    # 3. Specifically ensure 'admin@example.com' exists as LAB_ADMIN
    cur.execute("SELECT id FROM users WHERE email='admin@example.com'")
    if not cur.fetchone():
        cur.execute("INSERT INTO users (email, username, password_hash, role, provider) VALUES ('admin@example.com', 'admin_user', %s, 'LAB_ADMIN', 'password')", (hashed,))
        print("Created default admin@example.com")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_all_admins()

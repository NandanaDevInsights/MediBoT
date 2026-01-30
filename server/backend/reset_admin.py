import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def reset_admin_password():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    
    email = "admin@example.com"
    new_password = "admin123"
    
    # Check if user exists
    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    
    hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    
    if user:
        cur.execute("UPDATE users SET password_hash=%s, role='LAB_ADMIN' WHERE email=%s", (hashed, email))
        print(f"Password for {email} reset to {new_password}")
    else:
        # Create user
        cur.execute("INSERT INTO users (email, username, password_hash, role, provider) VALUES (%s, 'admin_user', %s, 'LAB_ADMIN', 'password')", (email, hashed))
        print(f"Created new admin user: {email} with password: {new_password}")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    reset_admin_password()

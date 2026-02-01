
import os
import mysql.connector
import bcrypt
from dotenv import load_dotenv

load_dotenv()

def fix_all_logins():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot_final")
        )
        cur = conn.cursor()
        
        # 1. Fix Admin (admin@example.com) -> 'admin123' and username 'admin'
        # Check if 'admin' username exists and isn't us
        cur.execute("SELECT id FROM users WHERE username='admin' AND email != 'admin@example.com'")
        if cur.fetchone():
            print("Warning: Username 'admin' already taken by another email. Skipping username rename.")
        else:
            cur.execute("UPDATE users SET username='admin' WHERE email='admin@example.com'")
            print("Updated username for admin@example.com to 'admin'")

        pass_admin = "admin123"
        hash_admin = bcrypt.hashpw(pass_admin.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
        cur.execute("UPDATE users SET password_hash=%s, role='LAB_ADMIN' WHERE email='admin@example.com'", (hash_admin,))
        print(f"Updated password for admin@example.com to '{pass_admin}'")

        # 2. Fix Patient (patient@example.com) -> 'password123'
        pass_p = "password123"
        hash_p = bcrypt.hashpw(pass_p.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
        cur.execute("UPDATE users SET password_hash=%s, role='USER' WHERE email='patient@example.com'", (hash_p,))
        print(f"Updated password for patient@example.com to '{pass_p}'")

        # 3. Fix Super Admin (medibot.care@gmail.com) -> 'Admin@123'
        pass_sa = "Admin@123"
        hash_sa = bcrypt.hashpw(pass_sa.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
        cur.execute("UPDATE users SET password_hash=%s, role='SUPER_ADMIN' WHERE email='medibot.care@gmail.com'", (hash_sa,))
        print(f"Updated password for medibot.care@gmail.com to '{pass_sa}'")
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_all_logins()

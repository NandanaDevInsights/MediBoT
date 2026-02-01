
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def seed_users():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        print(f"Connected to {conn.database}")

        users_to_seed = [
            # (email, username, password, role)
            ("patient@example.com", "patient_user", "Patient@123", "USER"),
            ("admin@example.com", "admin_user", "Admin@123", "LAB_ADMIN"),
            ("testadmin@lab.com", "test_admin", "Admin@123", "LAB_ADMIN"),
            ("medibot.care@gmail.com", "super_admin", "Super@123", "SUPER_ADMIN")
        ]

        print("Seeding users table...")
        for email, username, pwd, role in users_to_seed:
            pwd_bytes = pwd.encode('utf-8')
            pwd_hash = bcrypt.hashpw(pwd_bytes, bcrypt.gensalt(12)).decode('utf-8')
            
            # Check if exists
            cur.execute("SELECT id FROM users WHERE email=%s", (email,))
            existing = cur.fetchone()
            
            if existing:
                print(f"Update: {email}")
                cur.execute(
                    "UPDATE users SET password_hash=%s, role=%s, username=%s WHERE email=%s",
                    (pwd_hash, role, username, email)
                )
            else:
                print(f"Insert: {email}")
                cur.execute(
                    "INSERT INTO users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, 'password')",
                    (email, username, pwd_hash, role)
                )
            
            # If Admin, ensure in whitelist
            if "ADMIN" in role:
                cur.execute("SELECT id FROM lab_admin_users WHERE email=%s", (email,))
                if not cur.fetchone():
                    print(f"Whitelisting: {email}")
                    cur.execute(
                        "INSERT INTO lab_admin_users (email, role, provider) VALUES (%s, %s, 'password')",
                        (email, role)
                    )

        conn.commit()
        print("\nSuccess! Credentials:")
        for email, _, pwd, _ in users_to_seed:
            print(f"  {email} : {pwd}")
            
        cur.close()
        conn.close()

    except Exception as e:
        print(f"Error seeding: {e}")

if __name__ == "__main__":
    seed_users()

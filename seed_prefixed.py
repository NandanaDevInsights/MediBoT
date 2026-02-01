
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\.env')

def seed_everything():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot_new")
        )
        cur = conn.cursor()
        
        users_to_seed = [
            # Username, Email, Password, Role
            ("James", "keerthanapramod55@gmail.com", "James@123", "LAB_ADMIN"),
            ("Sherya", "nandanapramod329@gmail.com", "Sherya@123", "USER"),
            ("Nandana", "47.nandanapramod@gmail.com", "admin123", "LAB_ADMIN"),
            ("admin_user", "admin@example.com", "Admin@123", "LAB_ADMIN"),
            ("patient_user", "patient@example.com", "Patient@123", "USER"),
            ("SuperAdmin", "medibot.care@gmail.com", "Super@123", "SUPER_ADMIN")
        ]
        
        print("Seeding users into mb_users...")
        for username, email, password, role in users_to_seed:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
            cur.execute("DELETE FROM mb_users WHERE email=%s", (email,))
            cur.execute(
                "INSERT INTO mb_users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
                (email, username, hashed, role, "password")
            )
            
            # Whitelist if admin
            if role in ["LAB_ADMIN", "SUPER_ADMIN"]:
                cur.execute("DELETE FROM mb_lab_admin_whitelist WHERE email=%s", (email,))
                cur.execute("INSERT INTO mb_lab_admin_whitelist (email) VALUES (%s)", (email,))
        
        conn.commit()
        print("Done seeding.")
        conn.close()
    except Exception as e:
        print(f"Seed error: {e}")

if __name__ == "__main__":
    seed_everything()

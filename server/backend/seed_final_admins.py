
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\.env')

def seed_admins():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Seeding users into app_users...")
        
        # 1. Admin
        admin_email = "admin@example.com"
        admin_pass = "Admin@123".encode('utf-8')
        admin_hash = bcrypt.hashpw(admin_pass, bcrypt.gensalt(12)).decode('utf-8')
        
        cur.execute("DELETE FROM app_users WHERE email=%s", (admin_email,))
        cur.execute(
            "INSERT INTO app_users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
            (admin_email, "admin_user", admin_hash, "LAB_ADMIN", "password")
        )
        
        # Whitelist
        cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", (admin_email,))
        
        # 2. Patient
        patient_email = "patient@example.com"
        patient_pass = "Patient@123".encode('utf-8')
        patient_hash = bcrypt.hashpw(patient_pass, bcrypt.gensalt(12)).decode('utf-8')
        
        cur.execute("DELETE FROM app_users WHERE email=%s", (patient_email,))
        cur.execute(
            "INSERT INTO app_users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
            (patient_email, "patient_user", patient_hash, "USER", "password")
        )
        
        conn.commit()
        print("Users seeded successfully.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    seed_admins()

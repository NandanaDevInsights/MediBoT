
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\.env')

def setup_and_seed():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # 1. Ensure lab_admin_users exists
        cur.execute("""
        CREATE TABLE IF NOT EXISTS lab_admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255),
            role VARCHAR(50) DEFAULT 'LAB_ADMIN',
            pin_code VARCHAR(10),
            provider VARCHAR(50) DEFAULT 'password',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        print("- lab_admin_users table ensured.")

        # 2. Seed Admin
        admin_email = "admin@example.com"
        admin_pass = "Admin@123".encode('utf-8')
        admin_hash = bcrypt.hashpw(admin_pass, bcrypt.gensalt(12)).decode('utf-8')
        
        cur.execute("DELETE FROM app_users WHERE email=%s", (admin_email,))
        cur.execute(
            "INSERT INTO app_users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
            (admin_email, "admin_user", admin_hash, "LAB_ADMIN", "password")
        )
        
        # Also seed into lab_admin_users (some parts of app.py check this)
        cur.execute("DELETE FROM lab_admin_users WHERE email=%s", (admin_email,))
        cur.execute(
            "INSERT INTO lab_admin_users (email, password_hash, role, provider) VALUES (%s, %s, %s, %s)",
            (admin_email, admin_hash, "LAB_ADMIN", "password")
        )
        print(f"- Admin {admin_email} seeded with password 'Admin@123'.")
        
        # 3. Seed Patient
        patient_email = "patient@example.com"
        patient_pass = "Patient@123".encode('utf-8')
        patient_hash = bcrypt.hashpw(patient_pass, bcrypt.gensalt(12)).decode('utf-8')
        
        cur.execute("DELETE FROM app_users WHERE email=%s", (patient_email,))
        cur.execute(
            "INSERT INTO app_users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
            (patient_email, "patient_user", patient_hash, "USER", "password")
        )
        print(f"- Patient {patient_email} seeded with password 'Patient@123'.")
        
        conn.commit()
        print("Done.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup_and_seed()

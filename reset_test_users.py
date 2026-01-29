
import os
import bcrypt
import mysql.connector
from dotenv import load_dotenv

# Load from the correct location
load_dotenv('server/backend/.env')

def setup_test_accounts():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()

        # 1. Test Patient
        patient_email = "patient@example.com"
        patient_pass = "Patient@123"
        patient_hash = bcrypt.hashpw(patient_pass.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
        
        print(f"Upserting patient: {patient_email}")
        cur.execute("DELETE FROM users WHERE email=%s", (patient_email,))
        cur.execute(
            "INSERT INTO users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
            (patient_email, "patient_user", patient_hash, "USER", "password")
        )

        # 2. Test Lab Admin
        admin_email = "admin@example.com"
        admin_pass = "Admin@123"
        admin_hash = bcrypt.hashpw(admin_pass.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')

        print(f"Upserting lab admin: {admin_email}")
        cur.execute("DELETE FROM users WHERE email=%s", (admin_email,))
        cur.execute(
            "INSERT INTO users (email, username, password_hash, role, provider) VALUES (%s, %s, %s, %s, %s)",
            (admin_email, "admin_user", admin_hash, "LAB_ADMIN", "password")
        )
        
        # Ensure whitelisted
        cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", (admin_email,))
        
        # Ensure profile exists
        cur.execute("SELECT id FROM users WHERE email=%s", (admin_email,))
        uid = cur.fetchone()[0]
        cur.execute(
            "INSERT INTO lab_admin_profile (user_id, lab_name, admin_name) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE lab_name='Test Lab'",
            (uid, "Test Lab", "System Admin")
        )

        conn.commit()
        print("\nTest accounts created successfully!")
        print(f"Patient: {patient_email} / {patient_pass}")
        print(f"Admin:   {admin_email} / {admin_pass}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    setup_test_accounts()

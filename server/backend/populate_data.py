
import os
import mysql.connector
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
import random

load_dotenv()

def populate_data():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()

    # 1. Create a few more users
    print("Creating sample users...")
    sample_users = [
        ("john.doe@example.com", "User123!", "+919876543210"),
        ("sarah.smith@example.com", "User123!", "+919876543211"),
        ("mike.ross@example.com", "User123!", "+919876543212")
    ]
    
    for email, pwd, phone in sample_users:
        # Check if exists
        cur.execute("SELECT id FROM users WHERE email=%s", (email,))
        if not cur.fetchone():
            from bcrypt import hashpw, gensalt
            hashed = hashpw(pwd.encode('utf-8'), gensalt()).decode('utf-8')
            cur.execute("INSERT INTO users (email, password_hash, provider, role) VALUES (%s, %s, 'password', 'USER')", (email, hashed))
            print(f"Created {email}")
        else:
            print(f"Skipped {email} (exists)")

    conn.commit()

    # 2. Add some prescriptions
    print("Adding sample prescriptions...")
    cur.execute("SELECT id, email FROM users WHERE role='USER'")
    users = cur.fetchall()
    
    sample_tests = ["Blood Test", "Urine Analysis", "MRI Scan", "CT Scan"]
    
    for uid, email in users:
        # Check if they have prescription
        cur.execute("SELECT id FROM prescriptions WHERE user_id=%s", (uid,))
        if cur.fetchone():
            continue

        # Add 1 or 2 prescriptions
        for _ in range(random.randint(1, 2)):
             test = random.choice(sample_tests)
             cur.execute("""
                INSERT INTO prescriptions (user_id, file_path, file_type, status, test_type, mobile_number)
                VALUES (%s, 'http://localhost:5000/static/sample_rx.jpg', 'image/jpeg', 'Pending', %s, 'N/A')
             """, (uid, test))
             print(f"Added prescription for {email}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    populate_data()

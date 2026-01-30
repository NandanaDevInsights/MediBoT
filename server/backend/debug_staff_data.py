
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "medibot")
    )

try:
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    
    # Check Lab Staff
    cur.execute("SELECT * FROM lab_staff")
    staff = cur.fetchall()
    print(f"Total Staff in DB: {len(staff)}")
    for s in staff:
        print(f"Staff: {s.get('name')}, LabID: {s.get('lab_id')}")

    # Check Lab Admin Profile
    cur.execute("SELECT * FROM lab_admin_profile")
    admins = cur.fetchall()
    print(f"Total Admins: {len(admins)}")
    for a in admins:
        print(f"Admin UserID: {a.get('user_id')}, LabID: {a.get('lab_id')}, Email: {a.get('email')}")

    # Check Users to correlate
    cur.execute("SELECT id, email, role FROM users WHERE role='LAB_ADMIN'")
    users = cur.fetchall()
    print(f"Lab Admin Users: {users}")

    conn.close()
except Exception as e:
    print(f"Error: {e}")


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
    cur.execute("SELECT * FROM lab_admin_profile")
    with open("lab_profiles.txt", "w") as f:
        for row in cur.fetchall():
            f.write(str(row) + "\n")
            
    cur.execute("SELECT user_id, role FROM users WHERE role IN ('LAB_ADMIN', 'SUPER_ADMIN')")
    with open("admin_users.txt", "w") as f:
        for row in cur.fetchall():
            f.write(str(row) + "\n")
            
    conn.close()
    print("Done")
except Exception as e:
    print(f"Error: {e}")

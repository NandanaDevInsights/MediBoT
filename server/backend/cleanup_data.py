
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def cleanup_sample_data():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()

    sample_emails = [
        "john.doe@example.com",
        "sarah.smith@example.com",
        "mike.ross@example.com"
    ]
    
    print("Cleaning up sample users...")
    for email in sample_emails:
        # Get ID to delete prescriptions first (foreign key might cascade, but being safe)
        cur.execute("SELECT id FROM users WHERE email=%s", (email,))
        row = cur.fetchone()
        if row:
            uid = row[0]
            # Delete prescriptions
            cur.execute("DELETE FROM prescriptions WHERE user_id=%s", (uid,))
            # Delete user
            cur.execute("DELETE FROM users WHERE id=%s", (uid,))
            print(f"Deleted {email} (ID: {uid})")
        else:
            print(f"User {email} not found.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    cleanup_sample_data()

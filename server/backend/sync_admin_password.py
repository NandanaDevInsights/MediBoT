
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def sync_password(email):
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print(f"Syncing password for {email}...")

        # Get hash from users
        cur.execute("SELECT password_hash FROM users WHERE email=%s", (email,))
        user_row = cur.fetchone()
        
        if not user_row:
            print("User not found in 'users' table.")
            return

        user_hash = user_row[0]
        
        # Update lab_admin_users
        cur.execute("UPDATE lab_admin_users SET password_hash=%s WHERE email=%s", (user_hash, email))
        conn.commit()
        
        if cur.rowcount > 0:
            print(f"Success! Updated password hash for {email} in lab_admin_users.")
        else:
            print(f"Warning: No admin found with email {email} (or hash was already same).")
            
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_password("47.nandanapramod@gmail.com")

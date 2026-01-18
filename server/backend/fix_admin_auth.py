
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def fix_admin_hashes():
    """
    Fixes lab_admin_users entries that have no password_hash by copying from users table.
    """
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Checking for broken admin records...")
        
        # Find admins with missing password hash
        cur.execute("SELECT id, email FROM lab_admin_users WHERE password_hash IS NULL OR password_hash = ''")
        broken_admins = cur.fetchall()
        
        if not broken_admins:
            print("No broken admin records found (all have passwords).")
            return

        print(f"Found {len(broken_admins)} admins without passwords.")
        
        for admin_id, email in broken_admins:
            print(f"Fixing {email}...")
            
            # Find in users table
            cur.execute("SELECT password_hash FROM users WHERE email=%s", (email,))
            user_row = cur.fetchone()
            
            if user_row and user_row[0]:
                pw_hash = user_row[0]
                cur.execute("UPDATE lab_admin_users SET password_hash=%s, role='LAB_ADMIN', provider='password' WHERE id=%s", (pw_hash, admin_id))
                conn.commit()
                print(f"  -> Copied password hash from 'users' table.")
            else:
                print(f"  -> User not found in 'users' table or has no hash. Cannot fix automatically.")

        print("Done.")
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_admin_hashes()

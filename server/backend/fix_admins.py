
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def fix_all_admins():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # 1. Fix empty roles
        print("Fixing empty roles...")
        cur.execute("UPDATE users SET role='LAB_ADMIN' WHERE role='' OR role IS NULL")
        
        # 2. Upgrade specific email if it was missed
        target_email = '47.nandanapramod@gmail.com'
        print(f"Ensuring {target_email} is LAB_ADMIN...")
        cur.execute("UPDATE users SET role='LAB_ADMIN' WHERE email=%s", (target_email,))
        
        # 3. Ensure whitelist
        print("Syncing whitelist...")
        cur.execute("SELECT email FROM users WHERE role='LAB_ADMIN'")
        admins = cur.fetchall()
        for (email,) in admins:
            cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", (email,))
            
        conn.commit()
        print("Done.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_all_admins()

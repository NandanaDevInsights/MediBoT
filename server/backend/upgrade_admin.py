
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def upgrade_users():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        # Upgrade common dev emails
        emails = [
            'nandanapramod329@gmail.com', 
            'nandanapramod2028@mca.ajce.in',
            'patient@example.com' # upgrade this too for testing ease? maybe not.
        ]
        
        for email in emails:
            print(f"Checking {email}...")
            cur.execute("UPDATE users SET role='LAB_ADMIN' WHERE email=%s AND role='USER'", (email,))
            if cur.rowcount > 0:
                print(f" -> Upgraded {email} to LAB_ADMIN")
                # Ensure they are in whitelist table too
                cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", (email,))
            else:
                print(f" -> No change (maybe already admin or not found)")

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    upgrade_users()

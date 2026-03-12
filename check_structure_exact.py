
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def check_structure():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor(dictionary=True)
        
        # Check laboratories columns
        cur.execute("SHOW COLUMNS FROM laboratories")
        lab_cols = [row['Field'] for row in cur.fetchall()]
        print(f"Laboratories columns: {lab_cols}")
        
        needed = ['tests_config', 'working_hours', 'working_days']
        for col in needed:
            if col not in lab_cols:
                print(f"MISSING: {col} in laboratories")
        
        # Check profiles
        cur.execute("SELECT user_id, lab_name, lab_id FROM lab_admin_profile")
        profiles = cur.fetchall()
        print(f"\nProfiles: {profiles}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_structure()

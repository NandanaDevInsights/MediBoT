
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv(r'c:\Users\NANDANA PRAMOD\Documents\MediBot\server\backend\.env')

def deep_fix_db():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        tables_to_ensure = [
            "app_users",
            "lab_admin_app_users",
            "password_resets",
            "user_otps",
            "laboratories",
            "prescriptions",
            "appointments",
            "lab_staff",
            "reports",
            "lab_admin_profile",
            "bookings",
            "notifications",
            "user_profiles"
        ]
        
        for table in tables_to_ensure:
            try:
                print(f"Checking table: {table}")
                cur.execute(f"SELECT 1 FROM {table} LIMIT 1")
                cur.fetchall()
            except mysql.connector.Error as err:
                if err.errno == 1146 or err.errno == 1813:
                    print(f"Table {table} corrupted or missing (Error {err.errno}). Dropping and recreating...")
                    try:
                        cur.execute(f"DROP TABLE IF EXISTS {table}")
                    except:
                        pass
        
        conn.commit()
        conn.close()
        print("Pre-cleaning done. Now run setup_project_tables.py")
    except Exception as e:
        print(f"Deep fix error: {e}")

if __name__ == "__main__":
    deep_fix_db()


import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def update_schema_v2():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # 1. Add lab_id to lab_admin_profile
        print("Updating lab_admin_profile table...")
        try:
            cur.execute("ALTER TABLE lab_admin_profile ADD COLUMN lab_id INT")
            print("Added lab_id to lab_admin_profile")
        except Exception as e:
            print(f"lab_id might already exist in lab_admin_profile or error: {e}")

        # 2. Add lab_id to lab_staff
        print("Updating lab_staff table...")
        try:
            cur.execute("ALTER TABLE lab_staff ADD COLUMN lab_id INT")
            print("Added lab_id to lab_staff")
        except Exception as e:
            print(f"lab_id might already exist in lab_staff or error: {e}")

        # 3. Add lab_id to prescriptions
        print("Updating prescriptions table...")
        try:
            cur.execute("ALTER TABLE prescriptions ADD COLUMN lab_id INT")
            print("Added lab_id to prescriptions")
        except Exception as e:
            print(f"lab_id might already exist in prescriptions or error: {e}")

        conn.commit()
        cur.close()
        conn.close()
        print("Schema update V2 complete.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_schema_v2()

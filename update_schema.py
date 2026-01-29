
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def update_schema():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        # 1. Add columns to appointments
        print("Updating appointments table...")
        columns_to_add = {
            'age': 'INT',
            'gender': 'VARCHAR(20)',
            'email': 'VARCHAR(255)'
        }
        for col, dtype in columns_to_add.items():
            try:
                cur.execute(f"ALTER TABLE appointments ADD COLUMN {col} {dtype}")
                print(f"Added {col} to appointments")
            except Exception as e:
                print(f"Column {col} might already exist or error: {e}")

        # 2. Add lab_id to reports
        print("Updating reports table...")
        try:
            cur.execute("ALTER TABLE reports ADD COLUMN lab_id INT")
            print("Added lab_id to reports")
        except Exception as e:
            print(f"lab_id might already exist in reports or error: {e}")

        conn.commit()
        cur.close()
        conn.close()
        print("Schema update complete.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_schema()

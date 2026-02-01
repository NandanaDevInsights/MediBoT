import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_needed_tables():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        cur = conn.cursor()
        
        for table in ['prescriptions', 'reports', 'lab_staff', 'lab_admin_profile']:
            cur.execute(f"SHOW COLUMNS FROM {table}")
            cols = [c[0].lower() for c in cur.fetchall()]
            print(f"Table {table}: {'lab_id' in cols}")
            if table == 'lab_staff':
                print(f"Table {table}: {'lab_name' in cols}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_needed_tables()

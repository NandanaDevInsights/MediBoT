import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_all_tables():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        cur = conn.cursor()
        
        tables = ['appointments', 'prescriptions', 'reports', 'lab_staff', 'lab_admin_profile']
        for table in tables:
            cur.execute(f"SHOW COLUMNS FROM {table}")
            cols = [c[0].lower() for c in cur.fetchall()]
            print(f"{table}: lab_id={'lab_id' in cols}, lab_name={'lab_name' in cols}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_all_tables()

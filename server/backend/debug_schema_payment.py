
from db_connect import get_connection
import os
from dotenv import load_dotenv

load_dotenv()

def describe_tables():
    conn = get_connection()
    cur = conn.cursor()
    
    tables = ['appointments', 'lab_admin_profile', 'users']
    for table in tables:
        print(f"\n--- {table} ---")
        try:
            cur.execute(f"DESCRIBE {table}")
            for row in cur.fetchall():
                print(row)
        except Exception as e:
            print(f"Error describing {table}: {e}")
            
    cur.close()
    conn.close()

if __name__ == "__main__":
    describe_tables()

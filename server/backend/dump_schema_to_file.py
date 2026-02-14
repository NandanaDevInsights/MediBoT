
from db_connect import get_connection
import os
from dotenv import load_dotenv

load_dotenv()

def describe_tables():
    with open("schema_dump.txt", "w") as f:
        conn = get_connection()
        cur = conn.cursor()
        
        tables = ['appointments', 'lab_admin_profile', 'users']
        for table in tables:
            f.write(f"\n--- {table} ---\n")
            try:
                cur.execute(f"DESCRIBE {table}")
                for row in cur.fetchall():
                    f.write(str(row) + "\n")
            except Exception as e:
                f.write(f"Error describing {table}: {e}\n")
                
        cur.close()
        conn.close()

if __name__ == "__main__":
    describe_tables()

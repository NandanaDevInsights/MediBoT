import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def check_relevant_schemas():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "127.0.0.1"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        database=os.environ.get("DB_NAME")
    )
    cursor = conn.cursor()
    
    tables = ['slot', 'appointments', 'bookings']
    for table in tables:
        print(f"\n--- {table} ---")
        try:
            cursor.execute(f"DESCRIBE {table}")
            for col in cursor.fetchall():
                print(col)
        except Exception as e:
            print(f"Error describing {table}: {e}")
    
    conn.close()

if __name__ == "__main__":
    check_relevant_schemas()

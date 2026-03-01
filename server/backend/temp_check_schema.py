import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def check_tables():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        cur = conn.cursor()
        
        for table in ['appointments', 'bookings']:
            print(f"\n--- {table.upper()} ---")
            cur.execute(f"DESCRIBE {table}")
            for col in cur.fetchall():
                print(col)
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_tables()

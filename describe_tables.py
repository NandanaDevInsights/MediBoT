
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def describe_tables():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        for table in ['bookings', 'laboratories', 'lab_admin_users']:
            print(f"\nSchema for {table}:")
            cur.execute(f"DESCRIBE {table}")
            rows = cur.fetchall()
            for row in rows:
                print(row)
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    describe_tables()

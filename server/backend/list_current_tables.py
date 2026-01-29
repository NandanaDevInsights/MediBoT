
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def list_tables():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        cur.execute("SHOW TABLES")
        tables = cur.fetchall()
        print("Current tables in medibot:")
        for table in tables:
            print(f"- {table[0]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_tables()

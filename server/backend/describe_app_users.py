
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def describe_app_users():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        cur.execute("DESCRIBE app_users")
        for row in cur.fetchall():
            print(row)
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    describe_app_users()

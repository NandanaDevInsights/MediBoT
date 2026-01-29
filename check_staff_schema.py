
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def check():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        cur.execute("SHOW CREATE TABLE lab_staff")
        create_stmt = cur.fetchone()[1]
        print(create_stmt)
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check()

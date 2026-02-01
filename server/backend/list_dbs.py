
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def list_dbs():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", "")
        )
        cur = conn.cursor()
        cur.execute("SHOW DATABASES")
        for (db_name,) in cur.fetchall():
            print(db_name)
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_dbs()

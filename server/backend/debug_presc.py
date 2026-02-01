import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_presc():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        cur = conn.cursor()
        cur.execute("SHOW COLUMNS FROM prescriptions")
        cols = [c[0] for c in cur.fetchall()]
        print(f"Columns: {cols}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_presc()

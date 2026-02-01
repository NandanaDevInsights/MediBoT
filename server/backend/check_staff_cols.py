import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

def check_columns():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        cur = conn.cursor()
        cur.execute("DESCRIBE lab_staff")
        columns = cur.fetchall()
        print("Columns in lab_staff table:")
        for col in columns:
            print(col)
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_columns()

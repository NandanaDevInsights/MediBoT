
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "medibot")
    )

try:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SHOW TABLES LIKE 'lab_staff'")
    if cur.fetchone():
        print("Table 'lab_staff' exists.")
        cur.execute("DESCRIBE lab_staff")
        for row in cur.fetchall():
            print(row)
    else:
        print("Table 'lab_staff' does NOT exist.")
    conn.close()
except Exception as e:
    print(f"Error: {e}")

import mysql.connector
import os
from dotenv import load_dotenv
from db_connect import get_connection

def check_reports_schema():
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("DESCRIBE reports")
        print("REPORTS TABLE SCHEMA:")
        for res in cur.fetchall():
            print(res)
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_reports_schema()

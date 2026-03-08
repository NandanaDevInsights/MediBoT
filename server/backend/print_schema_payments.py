
from db_connect import get_connection
import os
from dotenv import load_dotenv

load_dotenv()

def print_payments_schema():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DESCRIBE payments")
    rows = cur.fetchall()
    print("Column | Type | Null | Key | Default | Extra")
    print("-" * 50)
    for row in rows:
        print(" | ".join(str(item) for item in row))
    cur.close()
    conn.close()

if __name__ == "__main__":
    print_payments_schema()

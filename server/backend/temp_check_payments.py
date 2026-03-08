
from db_connect import get_connection
import os
from dotenv import load_dotenv

load_dotenv()

def check_payments_table():
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SHOW TABLES LIKE 'payments'")
    table = cur.fetchone()
    
    if table:
        print("Payments table exists.")
        cur.execute("DESCRIBE payments")
        for row in cur.fetchall():
            print(row)
    else:
        print("Payments table does NOT exist.")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    check_payments_table()

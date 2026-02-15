import os
import mysql.connector
from dotenv import load_dotenv

def get_schema():
    load_dotenv()
    conn = mysql.connector.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        database=os.environ.get('DB_NAME')
    )
    cur = conn.cursor()
    
    tables = ['laboratories', 'appointments', 'users']
    for table in tables:
        print(f"\nTABLE: {table}")
        cur.execute(f"DESCRIBE {table}")
        for row in cur.fetchall():
            print(f"  {row[0]:20} | {row[1]:20} | {row[2]:5} | {row[3]:5}")
            
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_schema()

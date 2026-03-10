import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def check_tables():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "127.0.0.1"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        database=os.environ.get("DB_NAME")
    )
    cursor = conn.cursor()
    
    cursor.execute("SHOW TABLES")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"Tables: {tables}")
    
    for table in tables:
        print(f"\n--- {table} ---")
        cursor.execute(f"DESCRIBE {table}")
        for col in cursor.fetchall():
            print(col)
    
    conn.close()

if __name__ == "__main__":
    check_tables()


import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def check_schema():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cursor = conn.cursor()
    
    cursor.execute("DESCRIBE user_profiles")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
        
    conn.close()

if __name__ == "__main__":
    check_schema()

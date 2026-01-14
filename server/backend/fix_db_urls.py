
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def fix_urls():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    
    print("Updating IP to localhost in prescriptions...")
    cur.execute("""
        UPDATE prescriptions 
        SET file_path = REPLACE(file_path, '127.0.0.1:5000', 'localhost:5000')
        WHERE file_path LIKE '%127.0.0.1:5000%'
    """)
    print(f"Updated {cur.rowcount} rows.")
    
    cur.execute("""
        UPDATE reports 
        SET file_path = REPLACE(file_path, '127.0.0.1:5000', 'localhost:5000')
        WHERE file_path LIKE '%127.0.0.1:5000%'
    """)
    print(f"Updated {cur.rowcount} reports.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_urls()

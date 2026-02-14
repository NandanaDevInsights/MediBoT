
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(override=True)

try:
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "medibot")
    )
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES LIKE 'prescriptions'")
    result = cursor.fetchone()
    print(f"Table 'prescriptions' exists: {bool(result)}")
    
    if result:
        cursor.execute("DESCRIBE prescriptions")
        cols = [col[0] for col in cursor.fetchall()]
        print(f"Columns: {cols}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")

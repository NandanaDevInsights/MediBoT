
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

with open('schema_info.txt', 'w') as f:
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        cur.execute("DESCRIBE app_users")
        f.write("Columns in app_users:\n")
        for row in cur.fetchall():
            f.write(str(row) + "\n")
        
        cur.execute("SELECT id, email, role, username FROM app_users")
        f.write("\nUsers in app_users:\n")
        for row in cur.fetchall():
            f.write(str(row) + "\n")
            
        conn.close()
    except Exception as e:
        f.write(f"Error: {e}\n")

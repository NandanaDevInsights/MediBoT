
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def check_laboratories():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        print("\nSchema for laboratories:")
        cur.execute("DESCRIBE laboratories")
        for row in cur.fetchall():
            print(row)
        
        print("\nSchema for lab_admin_profile:")
        cur.execute("DESCRIBE lab_admin_profile")
        for row in cur.fetchall():
            print(row)
            
        print("\nContent of laboratories:")
        cur.execute("SELECT id, name FROM laboratories")
        for row in cur.fetchall():
            print(row)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_laboratories()

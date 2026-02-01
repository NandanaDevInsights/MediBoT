
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def check_fix_db():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database="medibot_fix"
        )
        cur = conn.cursor()
        cur.execute("SHOW TABLES")
        print("Tables in medibot_fix:")
        tables = cur.fetchall()
        for (table,) in tables:
            print(f"- {table}")
            
        for (table,) in tables:
            if table in ['users', 'app_users']:
                print(f"\n--- {table} ---")
                cur.execute(f"SELECT id, email, role FROM {table}")
                for row in cur.fetchall():
                    print(row)
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_fix_db()

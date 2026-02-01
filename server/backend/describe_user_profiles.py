
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def check_schema():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cursor = conn.cursor()
        
        cursor.execute("DESCRIBE user_profiles")
        rows = cursor.fetchall()
        print(f"{'Field':<20} {'Type':<20} {'Null':<10} {'Key':<10} {'Default':<20}")
        print("-" * 80)
        for row in rows:
            # row: Field, Type, Null, Key, Default, Extra
            print(f"{row[0]:<20} {row[1]:<20} {row[2]:<10} {row[3]:<10} {str(row[4]):<20}")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_schema()

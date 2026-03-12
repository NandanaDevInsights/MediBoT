
import os
import mysql.connector
from dotenv import load_dotenv

env_path = os.path.join('server', 'backend', '.env')
load_dotenv(env_path)

try:
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    tables = ['appointments', 'payments', 'lab_feedback', 'prescription', 'lab_admin_profile']
    for table in tables:
        print(f"\n--- {table} ---")
        try:
            cur.execute(f"DESCRIBE {table}")
            rows = cur.fetchall()
            for row in rows:
                print(f"{row[0]}: {row[1]}")
        except Exception as e:
            print(f"Error: {e}")
    conn.close()
except Exception as e:
    print(f"Connection Error: {e}")

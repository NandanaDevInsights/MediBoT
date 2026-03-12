
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
    print("--- payments columns ---")
    cur.execute("DESCRIBE payments")
    for col in cur.fetchall():
        print(col[0])
    conn.close()
except Exception as e:
    print(f"Error: {e}")

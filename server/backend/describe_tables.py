
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

conn = mysql.connector.connect(
    host=os.environ.get("DB_HOST", "localhost"),
    user=os.environ.get("DB_USER", "root"),
    password=os.environ.get("DB_PASSWORD", ""),
    database=os.environ.get("DB_NAME", "medibot")
)
cur = conn.cursor()
for table in ['appointments', 'bookings']:
    print(f"\n--- {table} ---")
    cur.execute(f"DESCRIBE {table}")
    for col in cur.fetchall():
        print(col)
conn.close()

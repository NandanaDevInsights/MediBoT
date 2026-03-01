
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
with open("c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend\\tables_described.txt", "w") as f:
    for table in ['appointments', 'bookings']:
        f.write(f"\n--- {table} ---\n")
        cur.execute(f"DESCRIBE {table}")
        for col in cur.fetchall():
            f.write(str(col) + "\n")
conn.close()

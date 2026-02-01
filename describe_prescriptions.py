import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='server/backend/.env')

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "medibot")
    )

conn = get_connection()
cur = conn.cursor()
cur.execute("DESCRIBE prescriptions")
for row in cur.fetchall():
    print(row)
cur.close()
conn.close()

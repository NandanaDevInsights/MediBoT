
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
cur = conn.cursor(dictionary=True)
cur.execute("SELECT id, name, location FROM laboratories")
rows = cur.fetchall()
with open("c:\\Users\\NANDANA PRAMOD\\Documents\\MediBot\\server\\backend\\laboratories_dump.txt", "w") as f:
    for row in rows:
        f.write(str(row) + "\n")
conn.close()


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
cur.execute("SELECT id, patient_name, lab_name, location, status FROM appointments")
rows = cur.fetchall()
for row in rows:
    print(row)
conn.close()

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
cur = conn.cursor(dictionary=True)

cur.execute("SELECT * FROM prescriptions WHERE patient_name LIKE '%Sherya%' OR username LIKE '%Sherya%' OR extracted_text LIKE '%Sherya%'")
rows = cur.fetchall()
with open('sherya_results_utf8.txt', 'w', encoding='utf-8') as f:
    for r in rows:
        f.write(str(r) + '\n')

cur.close()
conn.close()

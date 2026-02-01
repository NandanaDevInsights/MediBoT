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

print("--- USERS ---")
cur.execute("SELECT id, email, username FROM users")
users = cur.fetchall()
for u in users:
    print(u)

print("\n--- PRESCRIPTIONS ---")
cur.execute("SELECT id, user_id, username, file_path, image_url FROM prescriptions")
prescs = cur.fetchall()
for p in prescs:
    print(p)

cur.close()
conn.close()

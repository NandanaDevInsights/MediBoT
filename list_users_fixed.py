
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv('server/backend/.env')

def list_users():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    cur = conn.cursor()
    cur.execute("SELECT id, email, username, role, provider, password_hash FROM users")
    rows = cur.fetchall()
    for row in rows:
        print(f"ID: {row[0]}, Email: {row[1]}, Username: {row[2]}, Role: {row[3]}, Provider: {row[4]}, Hash: {row[5][:10] if row[5] else 'None'}...")
    conn.close()

if __name__ == "__main__":
    list_users()

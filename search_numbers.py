import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv('server/backend/.env')
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='medibot'
)
cur = conn.cursor()

print("--- Looking for similar numbers ---")
cur.execute("SELECT contact_number FROM user_profile WHERE contact_number IS NOT NULL")
for row in cur.fetchall():
    print(f"Profile: {row[0]}")

cur.execute("SELECT contact_number FROM appointments WHERE contact_number IS NOT NULL")
for row in cur.fetchall():
    print(f"Appointment: {row[0]}")

cur.close()
conn.close()


import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="medibot"
)
conn.autocommit = True
cur = conn.cursor()

# Drop order: Children first
tables_to_drop = [
    'user_profiles',
    'notifications',
    'bookings',
    'lab_admin_profile',
    'reports',
    'prescriptions',
    'appointments',
    'password_resets',
    # Others
    'user_otps',
    'lab_admin_users',
    'lab_staff',
    'laboratories',
    'users'
]

cur.execute("SET FOREIGN_KEY_CHECKS = 0;")

for table in tables_to_drop:
    try:
        print(f"Dropping {table}...")
        cur.execute(f"DROP TABLE IF EXISTS {table}")
        print(f" - Dropped {table}")
    except Exception as e:
        print(f" - Failed to drop {table}: {e}")

cur.execute("SET FOREIGN_KEY_CHECKS = 1;")
conn.close()

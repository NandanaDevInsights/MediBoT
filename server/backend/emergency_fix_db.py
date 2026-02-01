
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="medibot"
    )
    conn.autocommit = True
    cur = conn.cursor()

    tables = ['users', 'lab_admin_users', 'password_resets', 'user_otps', 'laboratories', 
              'prescriptions', 'appointments', 'lab_staff', 'reports', 'lab_admin_profile', 
              'bookings', 'notifications', 'user_profiles']

    for table in tables:
        try:
            print(f"Checking {table}...")
            cur.execute(f"SELECT 1 FROM {table} LIMIT 1")
            cur.fetchall()
            print(f" - {table} is OK.")
        except mysql.connector.Error as err:
            print(f" - {table} FAILED: {err}")
            # 1932: Table doesn't exist in engine
            # 1146: Table doesn't exist
            if err.errno == 1932:
                print(f"   -> Attempting to DROP {table}...")
                try:
                    cur.execute(f"DROP TABLE IF EXISTS {table}")
                    print(f"   -> DROP successful.")
                except Exception as e2:
                    print(f"   -> DROP failed: {e2}")
            elif err.errno == 1146:
                print(f"   -> Table missing (expected).")
            else:
                 # Try dropping for other errors just in case
                print(f"   -> Attempting generic DROP for {table}...")
                try:
                    cur.execute(f"DROP TABLE IF EXISTS {table}")
                    print(f"   -> DROP successful.")
                except Exception as e3:
                    print(f"   -> DROP failed. {e3}")

    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")

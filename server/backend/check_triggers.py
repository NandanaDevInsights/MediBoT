
from db_connect import get_connection
import mysql.connector

def check_notifications():
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5")
        rows = cur.fetchall()
        for row in rows:
            print(f"ID: {row['id']}, Message: {row['message'][:100]}..., Created: {row['created_at']}")
        
        cur.execute("SELECT * FROM appointments ORDER BY created_at DESC LIMIT 5")
        appts = cur.fetchall()
        for appt in appts:
            print(f"Appt ID: {appt['id']}, Status: {appt['status']}, Patient: {appt['patient_name']}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_notifications()

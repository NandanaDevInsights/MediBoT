import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def dump_bookings():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        cur = conn.cursor(dictionary=True)
        
        cur.execute("SELECT id, patient_name, lab_name, location, status FROM appointments LIMIT 10")
        appt_rows = cur.fetchall()
        print("--- APPOINTMENTS ---")
        for row in appt_rows:
            print(row)
            
        cur.execute("SELECT id, patient_name, location, status FROM bookings LIMIT 10")
        booking_rows = cur.fetchall()
        print("\n--- BOOKINGS ---")
        for row in booking_rows:
            print(row)
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dump_bookings()

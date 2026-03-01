import mysql.connector
import os
import json
from dotenv import load_dotenv

load_dotenv()

def dump_bookings():
    try:
        conn = mysql.connector.connect( host=os.getenv('DB_HOST'), user=os.getenv('DB_USER'), password=os.getenv('DB_PASSWORD'), database=os.getenv('DB_NAME') )
        cur = conn.cursor(dictionary=True)
        
        cur.execute("SELECT id, patient_name, lab_name, location, status FROM appointments LIMIT 10")
        appt_rows = cur.fetchall()
        
        cur.execute("SELECT id, patient_name, location, status FROM bookings LIMIT 10")
        booking_rows = cur.fetchall()
        
        with open("debug_results.json", "w", encoding='utf-8') as f:
            json.dump({"appointments": appt_rows, "bookings": booking_rows}, f, indent=2)
            
        print("Done. Wrote to debug_results.json")
                
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dump_bookings()

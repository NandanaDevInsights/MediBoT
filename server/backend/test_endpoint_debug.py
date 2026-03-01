
import os
import mysql.connector
from dotenv import load_dotenv
import json

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

def test_endpoint_logic():
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        user=os.environ.get("DB_USER", "root"),
        password=os.environ.get("DB_PASSWORD", ""),
        database=os.environ.get("DB_NAME", "medibot")
    )
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT 
                a.id, 
                a.patient_name as patient, 
                a.lab_name as lab, 
                COALESCE(a.tests, a.test_type) as test, 
                a.location, 
                a.appointment_time as time,
                a.appointment_date as date,
                a.payment_status as payment,
                a.status
            FROM appointments a
            ORDER BY a.created_at DESC
            LIMIT 200
        """)
        rows = cur.fetchall()
        print(f"Total rows: {len(rows)}")
        if rows:
            print("First row keys:", rows[0].keys())
            print("First row content:", rows[0])
            
        # Check specific lab
        search_lab = "Royal Clinical Laboratory"
        matched = [r for r in rows if r['lab'] == search_lab]
        print(f"Matched rows for '{search_lab}': {len(matched)}")
        
    finally:
        conn.close()

if __name__ == "__main__":
    test_endpoint_logic()

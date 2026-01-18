"""
Simple test to manually insert a booking to see what error occurs
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def test_insert():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("Testing manual insert into bookings table...")
        print("=" * 60)
        
        # Try to insert a test booking
        try:
            cur.execute("""
                INSERT INTO bookings 
                (patient_name, patient_id, email, phone_number, lab_id, 
                 test_category, selected_test, preferred_date, preferred_time, booking_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                "Test Patient",
                "TEST123",
                "test@example.com",
                "1234567890",
                1,  # lab_id = 1
                "Blood Test",
                "CBC, Hemoglobin",
                "2026-01-20",
                "10:00:00",
                "Pending"
            ))
            conn.commit()
            print("✅ SUCCESS: Test booking inserted successfully!")
            print(f"   Inserted ID: {cur.lastrowid}")
            
        except Exception as e:
            print(f"❌ ERROR during INSERT: {e}")
            print(f"   Error type: {type(e).__name__}")
            import traceback
            traceback.print_exc()
        
        # Check if it was inserted
        cur.execute("SELECT COUNT(*) FROM bookings WHERE lab_id = 1")
        count = cur.fetchone()[0]
        print(f"\nTotal bookings with lab_id=1: {count}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Connection error: {e}")

if __name__ == "__main__":
    test_insert()

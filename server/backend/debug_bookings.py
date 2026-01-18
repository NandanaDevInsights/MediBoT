"""
Debug script to check where the bookings are being saved
"""
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def debug_bookings():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            user=os.environ.get("DB_USER", "root"),
            password=os.environ.get("DB_PASSWORD", ""),
            database=os.environ.get("DB_NAME", "medibot")
        )
        cur = conn.cursor()
        
        print("=" * 70)
        print("DEBUGGING ROYAL CLINICAL LABORATORY BOOKINGS")
        print("=" * 70)
        
        # Check appointments table
        print("\n1. Checking APPOINTMENTS table for Royal Clinical Laboratory:")
        cur.execute("""
            SELECT id, lab_name, patient_name, test_type, appointment_date, appointment_time, status
            FROM appointments 
            WHERE lab_name = 'Royal Clinical Laboratory'
            ORDER BY created_at DESC
            LIMIT 5
        """)
        appointments = cur.fetchall()
        
        if appointments:
            print(f"   Found {len(appointments)} appointment(s):")
            for apt in appointments:
                print(f"   - ID {apt[0]}: {apt[2]} | {apt[3]} | {apt[4]} {apt[5]} | Status: {apt[6]}")
        else:
            print("   ❌ No appointments found for Royal Clinical Laboratory")
        
        # Check bookings table
        print("\n2. Checking BOOKINGS table (lab_id=1):")
        cur.execute("SELECT COUNT(*) FROM bookings WHERE lab_id = 1")
        count = cur.fetchone()[0]
        print(f"   Total bookings with lab_id=1: {count}")
        
        if count > 0:
            cur.execute("""
                SELECT booking_id, patient_name, selected_test, preferred_date, preferred_time, booking_status
                FROM bookings 
                WHERE lab_id = 1
                ORDER BY created_at DESC
            """)
            bookings = cur.fetchall()
            for b in bookings:
                print(f"   - ID {b[0]}: {b[1]} | {b[2]} | {b[3]} {b[4]} | Status: {b[5]}")
        
        # Check all bookings (any lab_id)
        print("\n3. Checking ALL bookings in bookings table:")
        cur.execute("SELECT COUNT(*) FROM bookings")
        total = cur.fetchone()[0]
        print(f"   Total bookings (all labs): {total}")
        
        if total > 0:
            cur.execute("""
                SELECT booking_id, patient_name, lab_id, selected_test, preferred_date
                FROM bookings 
                ORDER BY created_at DESC
                LIMIT 5
            """)
            all_bookings = cur.fetchall()
            for b in all_bookings:
                print(f"   - ID {b[0]}: {b[1]} | Lab ID: {b[2]} | {b[3]} | {b[4]}")
        
        print("\n" + "=" * 70)
        print("DIAGNOSIS:")
        if appointments and count == 0:
            print("❌ PROBLEM: Bookings are in appointments table but NOT in bookings table")
            print("   This means the INSERT into bookings table is failing silently.")
        elif appointments and count > 0:
            print("✅ SUCCESS: Bookings are in BOTH tables")
        else:
            print("❌ PROBLEM: No bookings found in either table")
        print("=" * 70)
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_bookings()
